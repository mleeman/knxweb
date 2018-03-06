function CDimmer(conf) {
	this.commandObject=conf.getAttribute("dim");
	this.onoffObject=conf.getAttribute("switch");
	this.returnObject=conf.getAttribute("value");
	this.value=0;
    var widget = this.init(conf, 'dimmerDiv', '36px', '96px');
	aRow = $("<tr/>");
	content = $("<td align='center'/>");
	aRow.append(content);
	widget.append(aRow);

    content.css('width','32px');
	// Ampoule
    this.light = $("<img src='images/light_off.png'/>").get(0);
	this.light.onclick=function() {
		if (this.owner.value>0) {
			EIBCommunicator.eibWrite(this.owner.onoffObject,"off");
			this.owner.value=0;
		}
		else {
			EIBCommunicator.eibWrite(this.owner.onoffObject,"on");
			this.owner.value=100;
		}
	};
	
	this.light.owner=this;
	content.append(this.light);

	// Plus
    this.plus = $("<img src='images/plus.png'/>").get(0);
	this.plus.owner=this;
	this.plus.onmousedown=function() {
		EIBCommunicator.eibWrite(this.owner.commandObject,"up");
	}
	this.plus.onmouseup=function() {
		EIBCommunicator.eibWrite(this.owner.commandObject,"stop");
	}

	content.append(this.plus);

	// Moins
    this.moins = $("<img src='images/moins.png'/>").get(0);
	this.moins.owner=this;
	this.moins.onmousedown=function() {
		EIBCommunicator.eibWrite(this.owner.commandObject,"down");
	}
	this.moins.onmouseup=function() {
		EIBCommunicator.eibWrite(this.owner.commandObject,"stop");
	}
	content.append(this.moins);

	var content2 = $("<td align='left' valign='bottom' width=4/>");
	this.positionBar = $("<div style='width: 4px; height: 0px; background-color: yellow;'/>").get(0);
	content2.append(this.positionBar);
	
	aRow.append(content2);
}

CDimmer.type='dimmer';
UIController.registerWidget(CDimmer);
CDimmer.prototype = new CWidget();
CDimmer.prototype.getListeningObject = function() {
	return Array(this.returnObject);
};
CDimmer.prototype.setPosition = function(value) {
	if ((value>=0)&&(value<=100)) {
		this.positionBar.style.height=((value/100)*96)+'px';
		this.value=value;
	}
};
CDimmer.prototype.updateObject = function(obj,value) {
	if (obj==this.returnObject) {
		this.setPosition((value/255)*100)
		if (value>0) 
			this.light.src='images/light_on.png';
		else
			this.light.src='images/light_off.png';
	}
};
