function CThermostat(conf) {
	this.modeObject=conf.getAttribute("mode");
	this.wTempObject=conf.getAttribute("setpoint");
	this.tempObject=conf.getAttribute("temp");
	this.consigne=0;
	this.mode=0;
	this.modeDiv=0;
	this.sendCounter=0;

    var widget = this.init(conf, 'thermostatDiv', '96px', '68px');
	var aRow = $("<tr height=36/>");
	var content = $("<td align='left' valign='middle'/>");

	this.modeDiv = $('<div/>').get(0);
	this.updateMode('');
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
	this.switchmode.onclick=function() {
		if (this.owner.mode == 'frost') {
			this.owner.mode = 'night';
		}
		else if (this.owner.mode == 'night') {
			this.owner.mode = 'standby';
		}
		else if (this.owner.mode == 'standby') {
			this.owner.mode = 'comfort';
		}
		else {
			this.owner.mode = 'frost';
		}
		this.owner.updateMode(this.owner.mode);
		runAfter.add(this.owner.sendMode,1, this.owner);
	}

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

CThermostat.type='thermostat';
UIController.registerWidget(CThermostat);
CThermostat.prototype = new CWidget();
CThermostat.prototype.getListeningObject = function() {
	return Array(this.modeObject,this.wTempObject,this.tempObject);
};
CThermostat.prototype.updateObject = function(obj,value) {
	if (obj==this.tempObject) this.updateTemp(value);
	if ((obj==this.wTempObject)&&(!runAfter.isIn(this.sendValue))) {
		this.updateSetpoint(value)
		this.consigne=parseFloat(value);
	}
	if ((obj==this.modeObject)&&(!runAfter.isIn(this.sendMode))) {
		this.mode=value;
		this.updateMode(value);
	}
};
CThermostat.prototype.sendValue = function(sender) {
	EIBCommunicator.eibWrite(sender.wTempObject,sender.consigne);
};
CThermostat.prototype.sendMode = function(sender) {
	EIBCommunicator.eibWrite(sender.modeObject,sender.mode);
};
CThermostat.prototype.updateSetpoint = function(value) {
	this.wtemp.innerHTML=tr("Setpoint: ")+value+"&deg;";
};
CThermostat.prototype.updateTemp = function(value) {
	this.temp.innerHTML=tr("Temp: ")+value+"&deg;";
};
CThermostat.prototype.updateMode = function(value) {
	this.modeDiv.innerHTML=tr("Mode: ")+tr(value);
};
