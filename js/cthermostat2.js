function CThermostat2(conf) {
	this.comfortObject=conf.getAttribute("comfort");
	this.nightObject=conf.getAttribute("night");
	this.frostObject=conf.getAttribute("frost");
//	this.modeObject=conf.getAttribute("mode");
	this.wTempObject=conf.getAttribute("setpoint");
	this.tempObject=conf.getAttribute("temp");
	this.consigne=0;
	this.comfort="off";
	this.night="off";
	this.frost="off";
	this.mode="standby";
	this.modeDiv=0;
	this.sendCounter=0;

    var widget = this.init(conf, 'thermostatDiv', '96px', '68px');
	var aRow = $("<tr height=36/>");
	var content = $("<td align='left' valign='middle'/>");

	this.modeDiv = $('<div/>').get(0);
	this.updateMode();
	content.append(this.modeDiv);

	this.wtemp = $('<div/>').get(0);
	this.updateSetpoint('');
	content.append(this.wtemp);

	this.temp = $('<div/>').get(0);
	this.updateTemp('');
	content.append(this.temp);
	aRow.append(content);
	widget.append(aRow);
	
	var aRow2 = $("<tr height=32/>");
    var content2 = $("<td align='left' valign='top'/>");

	// Mode
    this.switchmode = $("<img src='images/switchmode.png'/>").get(0);
	this.switchmode.owner=this;
	this.switchmode.onclick=function() {this.owner.nextMode(); };

	content2.append(this.switchmode);
	
	this.a=function() { alert(this); };

	// Plus
    this.plus = $("<img src='images/plus.png'/>").get(0);
	this.plus.owner=this;
	this.plus.onclick=function() {
		this.owner.consigne+=0.5;
		this.owner.updateSetpoint(this.owner.consigne);
//		this.owner.wtemp.innerHTML="Consigne: "+this.owner.consigne+"&deg;";
		runAfter.add(this.owner.sendValue,3, this.owner);
	}
	
	content2.append(this.plus);

	// Moins
    this.moins = $("<img src='images/moins.png'/>").get(0);
	this.moins.owner=this;
	this.moins.onclick=function() {
		this.owner.consigne-=0.5;
		this.owner.updateSetpoint(this.owner.consigne);
//		this.owner.wtemp.innerHTML="Consigne: "+this.owner.consigne+"&deg;";
		runAfter.add(this.owner.sendValue,3, this.owner);
	}
	content2.append(this.moins);
	aRow2.append(content2);
	widget.append(aRow2);
}

CThermostat2.type='thermostat2';
UIController.registerWidget(CThermostat2);
CThermostat2.prototype = new CWidget();
CThermostat2.prototype.getListeningObject = function() {
	return Array(this.comfortObject,this.nightObject,this.frostObject,this.wTempObject,this.tempObject);
};
CThermostat2.prototype.updateObject = function(obj,value) {
	if (obj==this.tempObject) this.updateTemp(value);
	if ((obj==this.wTempObject)&&(!runAfter.isIn(this.sendValue))) {
		this.updateSetpoint(value)
		this.consigne=parseFloat(value);
	}
	if ((obj==this.comfortObject)&&(!runAfter.isIn(this.sendMode))) {
		this.comfort = value;
		this.updateMode();
	}
	if ((obj==this.nightObject)&&(!runAfter.isIn(this.sendMode))) {
		this.night = value;
		this.updateMode();
	}
	if ((obj==this.frostObject)&&(!runAfter.isIn(this.sendMode))) {
		this.frost = value;
		this.updateMode();
	}
};
CThermostat2.prototype.sendValue = function(sender) {
	EIBCommunicator.eibWrite(sender.wTempObject,sender.consigne);
};
CThermostat2.prototype.sendMode = function(sender) {
	EIBCommunicator.eibWrite(sender.comfortObject,sender.comfort);
	EIBCommunicator.eibWrite(sender.nightObject,sender.night);
	EIBCommunicator.eibWrite(sender.frostObject,sender.frost);
};
CThermostat2.prototype.updateSetpoint = function(value) {
	this.wtemp.innerHTML=tr("Setpoint: ")+value+"&deg;";
};
CThermostat2.prototype.updateTemp = function(value) {
	this.temp.innerHTML=tr("Temp: ")+value+"&deg;";
};
CThermostat2.prototype.updateMode = function() {
	if (this.frost == "on")
		this.mode = "frost";
	else if (this.comfort == "on")
		this.mode = "comfort";
	else if (this.night == "on")
		this.mode = "night";
	else
		this.mode = "standby";
	this.modeDiv.innerHTML=tr("Mode: ")+tr(this.mode);
};
CThermostat2.prototype.nextMode = function() {
	if (this.mode == 'frost') {
		this.frost = "off";
		this.comfort = "off";
		this.night = "on";
	}
	else if (this.mode == 'night') {
		this.frost = "off";
		this.comfort = "off";
		this.night = "off";
	}
	else if (this.mode == 'standby') {
		this.frost = "off";
		this.comfort = "on";
		this.night = "off";
	}
	else {
		this.frost = "on";
		this.comfort = "off";
		this.night = "off";
	}
	this.updateMode();
	runAfter.add(this.sendMode,1, this);
};
