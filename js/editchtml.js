CHtml.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var format = $("<textarea cols='16' rows='4'/>");

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		if (obj.conf.firstChild)
			format.val(obj.conf.firstChild.nodeValue);
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.conf.setAttribute("label", label.val());
				$(obj.conf).empty().append(obj.conf.ownerDocument.createCDATASection(format.val()));
				obj.loadConfig(obj.conf);
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('html');
				conf.setAttribute('label', label.val());
				$(conf).append(conf.ownerDocument.createCDATASection(format.val()));
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("HTML Code:")+"<br />").append(format)
		.append("<br />").append(button);
};

CHtml.menuText='New HTML block';
