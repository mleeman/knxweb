function CScale(conf) {
    this.td = $("<td/>")
    this.loadConfig(conf);
    var widget = this.init(conf);
	widget.append($("<tr/>").append(this.td));    
}

CScale.img = {
light: 'images/light_dim.png',
blinds: 'images/blinds_move.png',
custom: ''
}
CScale.steps = {
light: 4,
blinds: 8,
custom: ''
}

CScale.type='scale';
UIController.registerWidget(CScale);
CScale.prototype = new CWidget();
CScale.prototype.getListeningObject = function() {
	return Array(this.commandObject);
};
CScale.prototype.loadConfig = function(conf) {
	this.commandObject=conf.getAttribute("object");
	var imgType=conf.getAttribute("img");
	if (!imgType)
		imgType='blinds';
	if (imgType == 'custom') {
		var dpath = "design/"+UIController.getDesignName()+"/";
		this.imgFile = dpath+conf.getAttribute("imgfile");
		this.width=conf.getAttribute("width");
		this.height=conf.getAttribute("height");
		this.steps=conf.getAttribute("steps");
		this.vshift=conf.getAttribute("vshift");
		this.hshift=conf.getAttribute("hshift");
	}
	else {
		this.imgFile=CScale.img[imgType];
		this.width=32;
		this.height=32;
		this.steps=CScale.steps[imgType];
		this.vshift=32;
		this.hshift=0;
	}
    this.td.css('width', this.width+'px').css('height', this.height+'px')
		.css('background-image', 'url('+this.imgFile+')')
};
CScale.prototype.updateObject = function(obj,value) {
	if (obj==this.commandObject)
	{
		var step = Math.round((value/256)*(this.steps-1));
		this.td.css('background-position', (-step*this.hshift)+'px '+(-step*this.vshift)+'px');
	}
};
