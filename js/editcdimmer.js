CDimmer.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var commandObject = $("<select name=dummy value=''/>");
	var onoffObject = $("<select name=dummy value=''/>");
	var returnObject = $("<select name=dummy value=''/>");
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				if (!type || type == "1.001" || type == "EIS1")
					onoffObject.append("<option value='"+id+"'>"+id+"</option>");
				else if (type == "3.007" || type == "EIS2")
					commandObject.append("<option value='"+id+"'>"+id+"</option>");
				else if (type == "5.xxx" || type == "EIS6")
					returnObject.append("<option value='"+id+"'>"+id+"</option>");
			});
		});

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		commandObject.val(obj.conf.getAttribute("dim"));
		onoffObject.val(obj.conf.getAttribute("switch"));
		returnObject.val(obj.conf.getAttribute("value"));
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.applyEdit(label.val(), commandObject.val(), onoffObject.val(), returnObject.val());
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('dimmer');
				conf.setAttribute('label', label.val());
				conf.setAttribute('dim', commandObject.val());
				conf.setAttribute('switch', onoffObject.val());
				conf.setAttribute('value', returnObject.val());
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("Command object:")+"<br />")
		.append(commandObject)
		.append("<br />"+tr("On/Off command object:")+"<br />")
		.append(onoffObject)
		.append("<br />"+tr("Value object:")+"<br />")
		.append(returnObject)
		.append("<br />").append(button);
};

CDimmer.menuText='New dimmer';
CDimmer.prototype.applyEdit = function(label, dim, sw, val) {
	this.label = label;
	this.conf.setAttribute("label", label);
	this.commandObject = dim;
	this.conf.setAttribute("dim", dim);
	this.onoffObject = sw;
	this.conf.setAttribute("switch", sw);
	this.returnObject = val;
	this.conf.setAttribute("value", val);
	EIBCommunicator.remove(this);
	EIBCommunicator.add(this);
};
