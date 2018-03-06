CValue.prototype.addObjectFields = function(target, obj) {
	var dpath = "design/"+UIController.getDesignName()+"/";
	var label = $("<input type='text'>");
	var commandObject = $("<select name=dummy value=''/>");
	var imgBtn = $("<input type='text' class='textValue'>");
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				commandObject.append("<option value='"+id+"'>"+id+"</option>");
			});
		});

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		commandObject.val(obj.conf.getAttribute("object"));
		imgBtn.val(obj.conf.getAttribute("img"));
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
			obj.conf.setAttribute("label", label.val());
			obj.conf.setAttribute("object", commandObject.val());
			obj.conf.setAttribute("img", imgBtn.val());
			obj.loadConfig(obj.conf);
//			EIBCommunicator.remove(obj);
//			EIBCommunicator.add(obj);
			target.remove();
		});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('value');
				conf.setAttribute('label', label.val());
				conf.setAttribute('object', commandObject.val());
				conf.setAttribute('img', imgBtn.val());
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label).append("<br />"+tr("Command object:")+"<br />").append(commandObject).append("<br />"+tr("Image:")+"<br />").append(imgBtn).append("<br />")
		.append(button);
};

CValue.menuText='New value input';
