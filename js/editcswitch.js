CSwitch.prototype.addObjectFields = function(target, obj) {
	var dpath = "design/"+UIController.getDesignName()+"/";
	var label = $("<input type='text'>");
	var commandObject = $("<select name=dummy value=''/>");
	var imgType = $("<select name=dummy value=''/>");
	var imgOn = $("<input type='text' class='textValue'>");
	var imgOff = $("<input type='text' class='textValue'>");
	var readonly = $("<input type='checkbox' />");
	var readonlychecked = false;
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				if (!type || type == "1.001" || type == "EIS1")
					commandObject.append("<option value='"+id+"'>"+id+"</option>");
			});
		});
	for(key in CSwitch.img_on) {
		imgType.append("<option value='"+key+"'>"+tr(key)+"</option>");
	}

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		commandObject.val(obj.conf.getAttribute("object"));
		readonly.val(obj.conf.getAttribute("readonly"));
		var img = obj.conf.getAttribute("img");
		imgType.val(img);
		if (img == 'custom') {
			imgOn.val(obj.conf.getAttribute("on"));
			imgOff.val(obj.conf.getAttribute("off"));
		}
		readonlychecked = (readonly.val() == 'true');
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
			obj.conf.setAttribute("label", label.val());
			obj.conf.setAttribute("object", commandObject.val());
			if (readonly.is(':checked'))
				obj.conf.setAttribute("readonly", true);
			else
				obj.conf.removeAttribute("readonly");

			var img = imgType.val();
			obj.conf.setAttribute("img", img);
			if (img == 'custom') {
				obj.conf.setAttribute("on", imgOn.val());
				obj.conf.setAttribute("off", imgOff.val());
			}
			else {
				obj.conf.removeAttribute("on");
				obj.conf.removeAttribute("off");
			}
			obj.loadConfig(obj.conf);
			EIBCommunicator.remove(obj);
			EIBCommunicator.add(obj);
			target.remove();
		});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('switch');
				var img = imgType.val();
				conf.setAttribute('label', label.val());
				conf.setAttribute('object', commandObject.val());
				conf.setAttribute('img', img);
				if (img == 'custom') {
					conf.setAttribute('on', imgOn.val());
					conf.setAttribute('off', imgOff.val());
				}
				if (readonly.is(':checked'))
					conf.setAttribute("readonly", true);
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label).append("<br />"+tr("Command object:")+"<br />").append(commandObject).append("<br />").append(tr("ReadOnly:")).append(readonly).append("<br />"+tr("Image type:")+"<br />").append(imgType).append("<br />");
	var customdiv = $("<div class='textValue'/>").append(tr("Image On:")+"<br />").append(imgOn)
		.append("<br />"+tr("Image Off:")+"<br />").append(imgOff).append("<br />");
	target.append(customdiv)
		.append(button);
	imgType.change(function() {
		if ($(this).val() == 'custom') customdiv.show(); else customdiv.hide();
	}).change();
	readonly.get(0).checked = readonlychecked;
};

CSwitch.menuText='New switch';
