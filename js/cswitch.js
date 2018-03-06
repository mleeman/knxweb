function CSwitch(conf) {
    this.light = $("<img/>").get(0);
    this.loadConfig(conf);
	this.value=false;
    var widget = this.init(conf);
	widget.append($("<tr/>").append($("<td/>").append(this.light)));

	this.light.owner=this;
}

CSwitch.img_on = {
light: 'images/light_on.png',
outlet: 'images/outlet_on.png',
fan: 'images/fan_on.png',
pump: 'images/pump_on.png',
blinds: 'images/blinds_down.png',
custom: ''
}
CSwitch.img_off = {
light: 'images/light_off.png',
outlet: 'images/outlet_off.png',
fan: 'images/fan_off.png',
pump: 'images/pump_off.png',
blinds: 'images/blinds_up.png',
custom: ''
}

CSwitch.type='switch';
UIController.registerWidget(CSwitch);
CSwitch.prototype = new CWidget();
CSwitch.prototype.getListeningObject = function() {
	return Array(this.commandObject);
};
CSwitch.prototype.loadConfig = function(conf) {
	this.commandObject=conf.getAttribute("object");
	var imgType=conf.getAttribute("img");
	if (!imgType)
		imgType='light';
	if (imgType == 'custom') {
		var dpath = "design/"+UIController.getDesignName()+"/";
		this.imgOn = dpath+conf.getAttribute("on");
		this.imgOff = dpath+conf.getAttribute("off");
	}
	else {
		this.imgOn = CSwitch.img_on[imgType];
		this.imgOff = CSwitch.img_off[imgType]; 
	}
	if (this.value)
		this.light.src=this.imgOn;
	else
		this.light.src=this.imgOff;

	this.readonly = (conf.getAttribute("readonly") == 'true');
	if (this.readonly)
		this.light.onclick = null;
	else {
		this.light.onclick=function() {
			var val = this.owner.value ? 'off' : 'on';
			EIBCommunicator.eibWrite(this.owner.commandObject, val);
			this.owner.updateObject(this.owner.commandObject, val);
		};
	}

};
CSwitch.prototype.updateObject = function(obj,value) {
	if (obj==this.commandObject)
	{
		if (value == 'on') 
		{
			this.light.src=this.imgOn;
			this.value=true;
		}	else {
			this.light.src=this.imgOff;
			this.value=false;
		}
	}
};
