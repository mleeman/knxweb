CGoto.prototype.addObjectFields = function(target, obj) {
	var label = $("<input type='text'>");
	var jump_to = $("<select name=dummy value=''/>");
	var imgType = $("<select name=dummy value=''/>");
	var imgFile = $("<input type='text' class='textValue'>");
	UIController.addZoneListListener(function (config) {
	    jump_to.empty();
    	$('zone', config)
    	    .each(function() {
    	        jump_to.append("<option value='"+this.getAttribute('id')+"'>"+this.getAttribute('name')+"</option>");
    	    });
    	});
	jump_to.val(this.zone_id);

	for(key in CGoto.img) {
		imgType.append("<option value='"+key+"'>"+tr(key)+"</option>");
	}
	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		jump_to.val(obj.conf.getAttribute("target"));
		var img = obj.conf.getAttribute("img");
		imgType.val(img);
		if (img == 'custom') {
			imgFile.val(obj.conf.getAttribute("imgfile"));
		}
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
			obj.conf.setAttribute("label", label.val());
			obj.conf.setAttribute("target", jump_to.val());
			var img = imgType.val();
			obj.conf.setAttribute("img", img);
			if (img == 'custom') {
				obj.conf.setAttribute("imgfile", imgFile.val());
			}
			else {
				obj.conf.removeAttribute("imgFile");
			}
			obj.loadConfig(obj.conf);
			target.remove();
		});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('goto');
				var img = imgType.val();
				conf.setAttribute('label', label.val());
				conf.setAttribute('target', jump_to.val());
				conf.setAttribute('img', img);
				if (img == 'custom') {
					conf.setAttribute('imgfile', imgFile.val());
				}
				UIController.add(conf);
			});
	}
	target.append(tr("Name:")+"<br />").append(label).append("<br />"+tr("Go to:")+"<br />").append(jump_to).append("<br />"+tr("Image:")+"<br />").append(imgType).append("<br />");
	var customdiv = $("<div class='textValue'/>").append(tr("Image file:")+"<br />").append(imgFile)
		.append("<br />");
	target.append(customdiv)
		.append(button);
	imgType.change(function() {
		if ($(this).val() == 'custom') customdiv.show(); else customdiv.hide();
	}).change();
};

CGoto.menuText='New goto';
