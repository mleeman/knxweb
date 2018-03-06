CScale.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var commandObject = $("<select name=dummy value=''/>");
	var imgType = $("<select name=dummy value=''/>");
	var imgFile = $("<input type='text' class='textValue'>");
	var width = $("<input type='text' class='textValue'>");
	var height = $("<input type='text' class='textValue'>");
	var steps = $("<input type='text' class='textValue'>");
	var vshift = $("<input type='text' class='textValue'>");
	var hshift = $("<input type='text' class='textValue'>");
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				if (type == "5.xxx" || type == "EIS6")
					commandObject.append("<option value='"+id+"'>"+id+"</option>");
			});
		});
	for(key in CScale.img) {
		imgType.append("<option value='"+key+"'>"+tr(key)+"</option>");
	}

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		commandObject.val(obj.conf.getAttribute("object"));
		var img = obj.conf.getAttribute("img");
		imgType.val(img);
		if (img == 'custom') {
			imgFile.val(obj.conf.getAttribute("imgfile"));
			height.val(obj.conf.getAttribute("height"));
			width.val(obj.conf.getAttribute("width"));
			steps.val(obj.conf.getAttribute("steps"));
			vshift.val(obj.conf.getAttribute("vshift"));
			hshift.val(obj.conf.getAttribute("hshift"));
		}
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
			obj.conf.setAttribute("label", label.val());
			obj.conf.setAttribute("object", commandObject.val());
			var img = imgType.val();
			obj.conf.setAttribute("img", img);
			if (img == 'custom') {
				obj.conf.setAttribute("imgfile", imgFile.val());
				obj.conf.setAttribute('height', height.val());
				obj.conf.setAttribute('width', width.val());
				obj.conf.setAttribute('steps', steps.val());
				obj.conf.setAttribute('vshift', vshift.val());
				obj.conf.setAttribute('hshift', hshift.val());
			}
			else {
				obj.conf.removeAttribute('imgfile');
				obj.conf.removeAttribute('height');
				obj.conf.removeAttribute('width');
				obj.conf.removeAttribute('steps');
				obj.conf.removeAttribute('vshift');
				obj.conf.removeAttribute('hshift');
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
				var conf = UIController.createControl('scale');
				var img = imgType.val();
				conf.setAttribute('label', label.val());
				conf.setAttribute('object', commandObject.val());
				conf.setAttribute('img', img);
				if (img == 'custom') {
					conf.setAttribute('imgfile', imgFile.val());
					conf.setAttribute('height', height.val());
					conf.setAttribute('width', width.val());
					conf.setAttribute('steps', steps.val());
					conf.setAttribute('vshift', vshift.val());
					conf.setAttribute('hshift', hshift.val());
				}
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label).append("<br />"+tr("Command object:")+"<br />").append(commandObject).append("<br />"+tr("Image type:")+"<br />").append(imgType).append("<br />");
	var customdiv = $("<div class='textValue'/>").append(tr("Image File:")+"<br />").append(imgFile).append("<br />")
		.append(tr("Width:")+"<br />").append(width).append("<br />")
		.append(tr("Height:")+"<br />").append(height).append("<br />")
		.append(tr("Steps:")+"<br />").append(steps).append("<br />")
		.append(tr("Vertical shift:")+"<br />").append(vshift).append("<br />")
		.append(tr("Horizontal shift:")+"<br />").append(hshift).append("<br />");
	target.append(customdiv)
		.append(button);
	imgType.change(function() {
		if ($(this).val() == 'custom') customdiv.show(); else customdiv.hide();
	}).change();
};

CScale.menuText='New scale';
