// runAfter
var runAfter = {
	functions: new Array(),
	
	init: function() {
		runAfter.timer();
	},
	add: function(f,delay, sender) {
		for(var i=0;i<runAfter.functions.length; i++) {
			o=runAfter.functions[i];
			if (o.func==f) {
				o.delay=delay;
				return;
			}
		}

		o=new Object();
		o.func=f;
		o.delay=delay;
		o.sender=sender;
		runAfter.functions.push(o);
	},
	timer: function() {
		for(var i=0;i<runAfter.functions.length; i++) {
			o=runAfter.functions[i];
			if (o.delay==0) {
				o.func(o.sender);
				runAfter.functions.splice(i,1);
			}
			else o.delay--;
		}
		setTimeout(runAfter.timer,1000);
	},
	isIn: function(f) {
		for(var i=0;i<runAfter.functions.length; i++) {
			o=runAfter.functions[i];
			if (o.func==f) return true;
		}
		return false;
	}
}

// EIBCommunicator
var EIBCommunicator = {
	listeners: new Object(),
	
	add: function(o) {
		var l=o.getListeningObject();
		for(var i=0;i<l.length; i++)
			if (l[i]) {
				if (!EIBCommunicator.listeners[l[i]]) EIBCommunicator.listeners[l[i]]=Array();
				EIBCommunicator.listeners[l[i]].push(o);
			}
	},
	remove: function(o) {
		for(key in EIBCommunicator.listeners) {
			for (var i=0;i<EIBCommunicator.listeners[key].length; i++) {
				if (EIBCommunicator.listeners[key][i]==o) EIBCommunicator.listeners[key].splice(i,1);
			}
			if (EIBCommunicator.listeners[key].length==0) delete EIBCommunicator.listeners[key];
		}
	},
	eibWrite: function(obj,value, successCallBack) {
		if (!obj)
			return;
		var body = "<write><object id='"+obj+"' value='"+value+"'/></write>";

		req = jQuery.ajax({ type: 'post', url: 'linknx.php?action=cmd', data: body, processData: false, dataType: 'xml' ,
			success: function(responseXML, status) {
				var xmlResponse = responseXML.documentElement;
				if (xmlResponse.getAttribute('status') == 'success') {
		   			EIBCommunicator.sendUpdate(obj, value);
				}
				else
					alert(tr("Error: ")+xmlResponse.textContent);
				if (successCallBack) successCallBack(response);
			}
		})
	},
	sendUpdate: function(obj,value) {
		var listeners = EIBCommunicator.listeners[obj];
		if (listeners) {
			for (var i=0;i<listeners.length; i++)
				listeners[i].updateObject(obj,value);
		}
	},
	eibRead: function(objects,completeCallBack) {
		if (objects.length > 0) {
			var body = '<read><objects>';
			for (i=0; i < objects.length; i++)
				if (objects[i])
					body += "<object id='" + objects[i] + "'/>";
			body += "</objects></read>";

			var req = jQuery.ajax({ type: 'post', url: 'linknx.php?action=cmd', data: body, processData: false, dataType: 'xml',
				success: function(responseXML, status) {
					var xmlResponse = responseXML.documentElement;
					if (xmlResponse.getAttribute('status') != 'error') {
						// Send update to subscribers
						var objs = xmlResponse.getElementsByTagName('object');
						if (objs.length == 0)
								EIBCommunicator.sendUpdate(objects, xmlResponse.childNodes[0].nodeValue);	
						else {
							for (i=0; i < objs.length; i++) {
								var element = objs[i];
								EIBCommunicator.sendUpdate(element.getAttribute('id'),element.getAttribute('value'));
							}
						}
					}
					else
						UIController.setNotification(tr("Error: ")+xmlResponse.textContent);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					UIController.setNotification(tr("Error: ")+textStatus);
				},
				complete: completeCallBack
			});
		}
		else if (completeCallBack)
		    completeCallBack();
	},
	loadObjectList: function() {
		var body = '<read><config><objects/></config></read>';
		var req = jQuery.ajax({ type: 'post', url: 'linknx.php?action=cmd', data: body, processData: false, dataType: 'xml',
			success: function(responseXML, status) {
				var xmlResponse = responseXML.documentElement;
				if (xmlResponse.getAttribute('status') != 'error') {
					UIController.setObjectsList(xmlResponse);
				}
				else
					alert(tr("Error: ")+xmlResponse.textContent);
			}
		});
	},
	updateAll: function(completeCallBack) {
		var obj = new Array();
		for(key in EIBCommunicator.listeners)
			obj.push(key);
		EIBCommunicator.eibRead(obj, completeCallBack);
	},
	periodicUpdate: function() {
		EIBCommunicator.updateAll(function(XMLHttpRequest, textStatus) {
				setTimeout('EIBCommunicator.periodicUpdate()', 1000);
			});
	},
	removeAll: function() {
		for(key in EIBCommunicator.listeners) 
			delete EIBCommunicator.listeners[key];
	}
}

// UIController
var UIController = {
	objects: new Array(),
	objectListListeners: new Array(),
	zoneListListeners: new Array(),
	editMode: false,
	leftOffset: null,
	topOffset: null,
	currentZone: '',
	widgetList: new Array(),
	setConfig: function(doc, name) {
		this.config = doc;
		this.designName = name;
		this.zoneListChanged();
	},
	getDesignName: function() {
		return this.designName;
	},
	setObjectsList: function(doc) {
		UIController.objectlist = doc;
		for(var i=0;i<this.objectListListeners.length; i++) {
			this.objectListListeners[i](doc);
		}
	},
	addObjectListListener: function(f) {
		this.objectListListeners.push(f);
		f(UIController.objectlist);
	},
	addZoneListListener: function(f) {
		this.zoneListListeners.push(f);
		f(UIController.config);
	},
	zoneListChanged: function() {
		for(var i=0;i<this.zoneListListeners.length; i++) {
			this.zoneListListeners[i](UIController.config);
		}
	},
	registerWidget: function(widget) {
		this.widgetList[widget.type]=widget;
	},
	changeZoneBackground: function(zoneid, bg) {
		$('zone[id='+zoneid+']', UIController.config).attr('img', bg);
		this.setZoneBackground(bg);
	},
	setZoneBackground: function(bg) {
		if (bg == null || bg == "")
			bg = 'images/1pixel.gif';
		else
			bg = 'design/'+this.designName+'/'+bg;
		$('#bgImage').attr('src', bg);
	},
	drawZone: function(zoneid) {
		UIController.removeAll();
		EIBCommunicator.removeAll();
		if (!zoneid)
			zoneid = $('zone', UIController.config).attr('id');
		this.currentZone = zoneid;
		var zone = $('zone[id='+zoneid+']', UIController.config);
		UIController.setZoneBackground(zone.attr('img'));
		zone.children('control').each(function() {
			UIController.addWidget(this, UIController.editMode);
		});
		EIBCommunicator.updateAll();
	},
	editZone: function(mode) {
		this.editMode = (mode != null) ? mode : !this.editMode;
		for(var i=0;i<UIController.objects.length; i++)
			UIController.objects[i].edit(this.editMode, this.editMode);
	},

	createWidget: function(conf, modify) {
		var obj = null;
		var type = conf.getAttribute('type');
		var cls = this.widgetList[type];
		if (cls)
			obj = new cls(conf);
		if (obj!=null) {
			if (modify)
				obj.edit(true, true);
			document.body.appendChild(obj.div);
			UIController.objects.push(obj);
			EIBCommunicator.add(obj);
			return true;
		}
		return false;
	},
	addWidget: function(o, modify) {
		if (!this.createWidget(o, modify)) {
			var type = o.getAttribute('type');
			$.getScript("js/c"+type+".js", function() { UIController.createWidget(o, modify); });
		}
	},
	add: function(conf) {
		$('zone[id='+this.currentZone+']', UIController.config).each(function() {
			this.appendChild(conf);
		});
		UIController.addWidget(conf, true);
	},
	createControl: function(type) {
		var conf = UIController.config.createElement('control');
   		conf.setAttribute('type', type);
   		return conf;
	},
	remove: function(o) {
		for(var i=0;i<UIController.objects.length; i++) {
			if (o==UIController.objects[i]) {
				document.body.removeChild(o.div);
				UIController.objects.splice(i,1);
				$(o.conf).remove();
				EIBCommunicator.remove(o);
				return;
			}
		}
	},
	addZone: function(zoneid, zoneName) {
		var newzone = UIController.config.createElement('zone');
		newzone.setAttribute('id', zoneid);
		newzone.setAttribute('name', zoneName);
		$('zones', UIController.config).append(newzone);
		this.zoneListChanged();
	},
	removeZone: function(zoneid) {
		$('zone[id='+zoneid+']', UIController.config).each(function() { this.parentNode.removeChild( this ); });
		this.zoneListChanged();
	},
	serializeToString: function(doc) {
        if (jQuery.browser.msie)
            return doc.xml;
   		return (new XMLSerializer()).serializeToString(doc);
    },
	saveDesign: function(version) {
		var string = this.serializeToString(UIController.config);
		var url = 'design.php?action=savedesign&name='+this.designName+'&ver='+version;
		req = jQuery.ajax({ type: 'post', url: url, data: string, processData: false, dataType: 'xml' ,
			success: function(responseXML, status) {
				var xmlResponse = responseXML.documentElement;
				if (xmlResponse.getAttribute('status') == 'success') {
					UIController.setNotification(tr("Design saved successfully"));
				}
				else {
					UIController.setNotification(tr("Error while saving design: ")+xmlResponse.textContent);
					alert(tr("Error while saving design: ")+xmlResponse.textContent);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				UIController.setNotification(tr("Error while saving design: ")+textStatus);
			}
		});
	},
	displayDesign: function() {
        var string = this.serializeToString(UIController.config);
		var popup = window.open();
		popup.document.write("<html><body><textarea rows=30 cols=100>"+string+"</textarea></body></html>");
		popup.document.close();
	},
	setNotification: function(text)	{
		$('#notificationZone').text(text).show();
		runAfter.add(UIController.clearNotification, 5, this);
	},
	clearNotification: function()	{
		$('#notificationZone').text('').hide();
	},
	removeAll: function(o) {
		zo = UIController.objects.shift();
		while (zo != null) {
			document.body.removeChild(zo.div);
			zo = UIController.objects.shift();
		}
	}
}

function addMenuSection(id, name)
{
	var menu = $('<div class="menuItem" />');
	menu.click(function () { $('#'+id).toggle() });
	menu.mouseover(function () { this.className='menuItem menuItemOver' });
	menu.mouseout(function () { this.className='menuItem' });
	menu.text(tr(name));
	
	var submenu = $('<div class="subMenuItem" style="display: none;" id="'+id+'"/>');
	$("td.menu").append(menu).append(submenu);
	return submenu;
}

function displayVersion()
{
	$('.menuTitle').append("<a href='index.html'><img src='images/settings.gif'/>KnxWeb v0.7pre</a>")

}

function tr(msg)
{
	var cRet = (typeof(i18n)!='undefined') ? i18n[msg] : msg;
	if(!cRet) {
		return "§§§" + msg + "§§§";
	}
	return cRet;
}
