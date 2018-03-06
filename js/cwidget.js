function CWidget(conf) {
}

CWidget.prototype = {
	getListeningObject: function() {
		return Array();
	},
	updateObject: function(obj,value) {
	},
	init: function(conf, style, width, height) {
		this.label=conf.getAttribute("label");
		this.conf=conf;
		var x = conf.getAttribute("x");
		var y = conf.getAttribute("y");
		if (!x) x = 20;
		if (!y) y = 20;
		if (!style) style = 'widgetDiv';
//	    conf.setAttribute("x", parseInt(x) - UIController.leftOffset);
		if (UIController.leftOffset)
		    x = parseInt(x) + UIController.leftOffset;
		if (UIController.topOffset)
		    y = parseInt(y) + UIController.topOffset;
		div = $("<div class='"+style+"'/>");
		this.div = div.get(0);
		this.div.owner=this;
		if (this.label != "")
			div.mouseover(function () { UIController.setNotification(this.owner.label); });
	
		// Create table
		table = $("<table class='"+style+"' cellpadding=0 cellspacing=0 />");
		tableBody = $("<tbody/>");
		
		// Create content
		table.append(tableBody);
		div.append(table);
		
		div.css('left', x+"px");
		div.css('top', y+"px");
		if (height) div.css('height', height);
		if (width) div.css('width', width);
		return tableBody;
	}
}
