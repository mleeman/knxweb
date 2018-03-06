CThermostat2.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var comfortObject = $("<select name=dummy value=''/>");
	var nightObject = $("<select name=dummy value=''/>");
	var frostObject = $("<select name=dummy value=''/>");
	var wTempObject = $("<select name=dummy value=''/>");
	var tempObject = $("<select name=dummy value=''/>");
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				if (!type || type == "1.001" || type == "EIS1") {
					comfortObject.append("<option value='"+id+"'>"+id+"</option>");
					nightObject.append("<option value='"+id+"'>"+id+"</option>");
					frostObject.append("<option value='"+id+"'>"+id+"</option>");
				}
				else if (type == "9.xxx" || type == "EIS5") {
					wTempObject.append("<option value='"+id+"'>"+id+"</option>");
					tempObject.append("<option value='"+id+"'>"+id+"</option>");
				}
			});
		});

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		comfortObject.val(obj.conf.getAttribute("comfort"));
		nightObject.val(obj.conf.getAttribute("night"));
		frostObject.val(obj.conf.getAttribute("frost"));
		wTempObject.val(obj.conf.getAttribute("setpoint"));
		tempObject.val(obj.conf.getAttribute("temp"));
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.applyEdit(label.val(), comfortObject.val(), nightObject.val(), frostObject.val(), wTempObject.val(), tempObject.val());
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('thermostat2');
				conf.setAttribute('label', label.val());
				conf.setAttribute('comfort', comfortObject.val());
				conf.setAttribute('night', nightObject.val());
				conf.setAttribute('frost', frostObject.val());
				conf.setAttribute('setpoint', wTempObject.val());
				conf.setAttribute('temp', tempObject.val());
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("Comfort object:")+"<br />")
		.append(comfortObject)
		.append("<br />"+tr("Night object:")+"<br />")
		.append(nightObject)
		.append("<br />"+tr("Frost object:")+"<br />")
		.append(frostObject)
		.append("<br />"+tr("Setpoint object:")+"<br />")
		.append(wTempObject)
		.append("<br />"+tr("Current temp. object:")+"<br />")
		.append(tempObject)
		.append("<br />").append(button);
};

CThermostat2.menuText='New thermostat II';
CThermostat2.prototype.applyEdit = function(label, comfort, night, frost, wtemp, temp) {
	this.label = label;
	this.conf.setAttribute("label", label);
	this.comfortObject = comfort;
	this.conf.setAttribute("comfort", comfort);
	this.nightObject = night;
	this.conf.setAttribute("night", night);
	this.frostObject = frost;
	this.conf.setAttribute("frost", frost);
	this.wTempObject = wtemp;
	this.conf.setAttribute("setpoint", wtemp);
	this.tempObject = temp;
	this.conf.setAttribute("temp", temp);
	EIBCommunicator.remove(this);
	EIBCommunicator.add(this);
};
