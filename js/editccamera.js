CCamera.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'/>");
	var camUrl = $("<input type='text'/>");

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		camUrl.val(obj.conf.getAttribute("url"));
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.applyEdit(label.val(), camUrl.val());
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('camera');
				conf.setAttribute('label', label.val());
				conf.setAttribute('url', camUrl.val());
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("Cam picture URL:")+"<br />").append(camUrl).append("<br />").append(button);
};

CCamera.menuText='New camera';
CCamera.prototype.applyEdit = function(label, url) {
	this.label = label;
	this.conf.setAttribute("label", label);
	this.camUrl = url;
	this.conf.setAttribute("url", url);
};
