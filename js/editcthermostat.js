CThermostat.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var modeObject = $("<select name=dummy value=''/>");
	var wTempObject = $("<select name=dummy value=''/>");
	var tempObject = $("<select name=dummy value=''/>");
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				if (type == "20.102" || type == "heat-mode")
					modeObject.append("<option value='"+id+"'>"+id+"</option>");
				else if (type == "9.xxx" || type == "EIS5") {
					wTempObject.append("<option value='"+id+"'>"+id+"</option>");
					tempObject.append("<option value='"+id+"'>"+id+"</option>");
				}
			});
		});

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		modeObject.val(obj.conf.getAttribute("mode"));
		wTempObject.val(obj.conf.getAttribute("setpoint"));
		tempObject.val(obj.conf.getAttribute("temp"));
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.applyEdit(label.val(), modeObject.val(), wTempObject.val(), tempObject.val());
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('thermostat');
				conf.setAttribute('label', label.val());
				conf.setAttribute('mode', modeObject.val());
				conf.setAttribute('setpoint', wTempObject.val());
				conf.setAttribute('temp', tempObject.val());
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("Mode object:")+"<br />")
		.append(modeObject)
		.append("<br />"+tr("Setpoint object:")+"<br />")
		.append(wTempObject)
		.append("<br />"+tr("Current temp. object:")+"<br />")
		.append(tempObject)
		.append("<br />").append(button);
};

CThermostat.menuText='New thermostat';
CThermostat.prototype.applyEdit = function(label, mode, wtemp, temp) {
	this.label = label;
	this.conf.setAttribute("label", label);
	this.modeObject = mode;
	this.conf.setAttribute("mode", mode);
	this.wTempObject = wtemp;
	this.conf.setAttribute("setpoint", wtemp);
	this.tempObject = temp;
	this.conf.setAttribute("temp", temp);
	EIBCommunicator.remove(this);
	EIBCommunicator.add(this);
};
