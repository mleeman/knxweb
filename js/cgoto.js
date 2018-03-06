function CGoto(conf) {
	this.img = $("<img/>").get(0);
    this.loadConfig(conf);

    var widget = this.init(conf);
	widget.append($("<tr/>").append($("<td/>").append(this.img)));

	this.img.owner=this;
	this.img.onclick=function() {
		gotoZone(this.owner.zone_id);
	};
}

CGoto.img = {
'left': 'images/gotoLeft.png',
'right': 'images/gotoRight.png',
'upper': 'images/gotoUpper.png',
'lower': 'images/gotoLower.png',
custom: ''
}

CGoto.type='goto';
UIController.registerWidget(CGoto);
CGoto.prototype = new CWidget();
CGoto.prototype.loadConfig = function(conf) {
	this.zone_id=conf.getAttribute("target");

	var imgType=conf.getAttribute("img");
	if (!imgType)
		imgType='right';
	if (imgType.indexOf("images/") != -1) {
		// Backward compatibility
		imgType = imgType.slice(11, -4).toLowerCase();
		conf.setAttribute("img", imgType);
	}

	if (imgType == 'custom') {
		var dpath = "design/"+UIController.getDesignName()+"/";
		this.imgFile = dpath+conf.getAttribute("imgfile");
	}
	else {
		this.imgFile = CGoto.img[imgType];
	}
	this.img.src=this.imgFile;
};
