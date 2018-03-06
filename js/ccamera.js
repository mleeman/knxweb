function CCamera(conf) {
	this.camUrl=conf.getAttribute("url");
    var widget = this.init(conf, 'camDiv', '32px', '32px');
	var aRow = $("<tr/>");
	var content = $("<td align='center'/>");

    this.img = $("<img src='images/camera.png'/>").get(0);
	this.img.owner=this;
	this.img.onclick=function() {
		var newdiv = $("<div class='camViewDiv' style='display:block;'/>")
		    .css('left', (document.body.clientWidth/2)-160+'px')
		    .css('top', (document.body.clientHeight/2)-120+'px')
		    .get(0);

        var table = $("<table class='camDiv' cellpadding=0 cellspacing=0 />");
        var tableBody = $("<tbody/>");
	
		// Create header
        var headerTr = $("<tr height=15 style='background-color:#000000'/>");
		headerTr.css('cursor', 'move');

        var header = $("<th align='right'/>");
        var closeBtn = $("<img src='images/close.gif' style='cursor: pointer; margin-right: 2px;'/>").get(0);
    	closeBtn.parent=newdiv;
		closeBtn.onclick=function() {
			document.body.removeChild(this.parent);
			while ( this.parent.childNodes.length >= 1 )
    	    {
                this.parent.removeChild( this.parent.firstChild );
				this.parent.camImg.src="";
    	    } 
		};
			
		header.append(closeBtn);
		headerTr.append(header);

		tableBody.append(headerTr);

        var aRow = $("<tr/>");
        var content = $("<td align='center'/>");
/*
		content.get(0).innerHTML='<applet code="com.charliemouse.cambozola.Viewer" archive="lib/cambozola.jar" width="320" height="240">'+
											'<param name="url" value="'+this.owner.camUrl+'">'+
											'</applet>';
*/
		// A modifier par un applet java ou autre

		newdiv.camImg = $("<img src='"+this.owner.camUrl+"' width=320 height=240/>").get(0);
		content.append(newdiv.camImg);
	
		aRow.append(content);
		tableBody.append(aRow);
		table.append(tableBody);
		table.appendTo(newdiv);

		Drag.init(headerTr.get(0),newdiv);

		$('body').append(newdiv);
//		alert(newdiv.innerHTML);
	};

	if (typeof(Drag) == "undefined")
		jQuery.getScript("js/dom-drag.js");
	
	content.append(this.img);
	aRow.append(content);
	widget.append(aRow);
}

CCamera.type='camera';
UIController.registerWidget(CCamera);
CCamera.prototype = new CWidget();
