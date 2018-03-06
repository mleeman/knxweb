CMulti.prototype.addObjectFields = function(target, obj) {
	var dpath = "design/"+UIController.getDesignName()+"/";
	var label = $("<input type='text'>");
	var commandObject = $("<select name=dummy value=''/>");
	var numItems = $("<select name=dummy value='1'/>");
	var readonly = $("<input type='checkbox' />");
	var readonlychecked = false;
	UIController.addObjectListListener(function (objectlist) {
		$('object',objectlist)
			.each(function() {
				var id = this.getAttribute('id');
				commandObject.append("<option value='"+id+"'>"+id+"</option>");
			});
		});

	for(key=1; key<10; key++) {
		numItems.append("<option value='"+key+"'>"+key+"</option>");
	}

	var customdiv = $("<div class='textValue'/>");

	numItems.change(function() {
		var prevNum = customdiv.find('input:even').length;
		var num = $(this).val();
		if (prevNum > num) {
			customdiv.contents().slice(num*8).remove();
		}
		else {
			for (i=prevNum; i<num; i++) {
				customdiv.append(tr("Value:")+"<br />").append($("<input type='text' class='textValue'>"))
					.append("<br />"+tr("Image:")+"<br />").append($("<input type='text' class='textValue'>")).append("<br />");
			}
		}
	});
	
	var button;
	if (obj) {
		label.val(obj.conf.getAttribute("label"));
		commandObject.val(obj.conf.getAttribute("object"));
		readonly.val(obj.conf.getAttribute("readonly"));
		readonlychecked = (readonly.val() == 'true');
		var items = $('item', obj.conf);
		numItems.val(items.length);
		items.each(function (i) {
//			itemsList.addItem(this.getAttribute("value"), this.getAttribute("img"));
			var valueField = $("<input type='text' class='textValue'>").val(this.getAttribute("value"));
			var imgField = $("<input type='text' class='textValue'>").val(this.getAttribute("img"));
			customdiv.append(tr("Value:")+"<br />").append(valueField)
				.append("<br />"+tr("Image:")+"<br />").append(imgField).append("<br />");
		});
		button = $("<input type='button' value='"+tr('Ok')+"'/>");
		button.click(function() {
			obj.conf.setAttribute("label", label.val());
			obj.conf.setAttribute("object", commandObject.val());
			if (readonly.is(':checked'))
				obj.conf.setAttribute("readonly", true);
			else
				obj.conf.removeAttribute("readonly");

			$(obj.conf).empty();
			$('input:even', customdiv).each(function (i) {
				var item = UIController.config.createElement('item');
				item.setAttribute("value", $(this).val());
				item.setAttribute("img", $('input:odd', customdiv).eq(i).val());
				obj.conf.appendChild(item);
			});
			obj.loadConfig(obj.conf);
			EIBCommunicator.remove(obj);
			EIBCommunicator.add(obj);
			target.remove();
		});
	}
	else {
		button = $("<input type='button' value='"+tr('Add')+"'/>");
		button.click(function() {
				var conf = UIController.createControl('multi');
				conf.setAttribute('label', label.val());
				conf.setAttribute('object', commandObject.val());
				$('input:even', customdiv).each(function (i) {
					var item = UIController.config.createElement('item');
					item.setAttribute("value", $(this).val());
					item.setAttribute("img", $('input:odd', customdiv).eq(i).val());
					conf.appendChild(item);
				});
				if (readonly.is(':checked'))
					conf.setAttribute("readonly", true);
				UIController.add(conf);
			});
		numItems.change();
	}
	target.append(tr("Name:")+"<br />").append(label).append("<br />"+tr("Command object:")+"<br />").append(commandObject).append("<br />").append(tr("ReadOnly:")).append(readonly).append("<br />"+tr("Number of items:")+"<br />").append(numItems).append("<br />");
	target.append(customdiv)
		.append(button);
	readonly.get(0).checked = readonlychecked;
};

CMulti.menuText='New multiswitch';
