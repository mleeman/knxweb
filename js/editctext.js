CText.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var style = $("<input type='text'>");
	var format = $("<input type='text'>");
	var cb = $("<input type='checkbox'/>");
	var object = $("<select class='textValue' name=dummy value=''/>");
	var pattern = $("<input type='text' class='textValue'>");
	var cbchecked = false;
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				var type = this.getAttribute('type');
				object.append("<option value='"+id+"'>"+id+"</option>");
			});
		});

	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		style.val(obj.conf.getAttribute("style"));
		format.val(obj.conf.getAttribute("format"));
		var oid = obj.conf.getAttribute("object");
		if (oid) {
			object.val(oid);
			pattern.val(obj.conf.getAttribute("pattern"));
			cbchecked = true;
		}
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
				obj.conf.setAttribute("label", label.val());
				obj.conf.setAttribute("style", style.val());
				obj.conf.setAttribute("format", format.val());
				if (cb.is(':checked'))
					obj.conf.setAttribute("object", object.val());
				else
					obj.conf.removeAttribute("object");
				if (pattern.val())
					obj.conf.setAttribute("pattern", pattern.val());
				else
					obj.conf.removeAttribute("pattern");
				obj.loadConfig(obj.conf);
				EIBCommunicator.remove(obj);
				EIBCommunicator.add(obj);
				target.remove();
			});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('text');
				conf.setAttribute('label', label.val());
				conf.setAttribute('style', style.val());
				conf.setAttribute('format', format.val());
				if (cb.is(':checked')) {
					conf.setAttribute('object', object.val());
					conf.setAttribute('pattern', pattern.val());
				}
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label)
		.append("<br />"+tr("Style:")+"<br />").append(style)
		.append("<br />"+tr("Format:")+"<br />").append(format)
		.append("<br />"+tr("Insert value:")).append(cb)
		.append("<br />");
	var objdiv = $("<div class='textValue'/>").append(tr("Object:")+"<br />").append(object)
		.append("<br />"+tr("Pattern:")+"<br />").append(pattern).append("<br />");
	target.append(objdiv)
		.append(button);

	function update_cb(val) { if (val) objdiv.show(); else { objdiv.hide(); pattern.val(''); }};

	cb.click(function () {
		update_cb(this.checked);
	});
	cb.get(0).checked = cbchecked;
	update_cb(cbchecked);
};

CText.menuText='New text';
