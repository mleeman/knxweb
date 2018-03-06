CWidget.prototype.edit = function(canMove, canClose) {
	var offset = 0;
	$('table tbody tr.editWidget', this.div).each(function() { $(this).remove(); offset = -15; });
	if (canMove || canClose) {
		offset += 15;
		var headerTr = $("<tr class='editWidget'/>");
		var header = $("<th align='right'/>");
		if (canClose) {
			var closeBtn = $("<img src='images/close.gif' style='cursor: pointer; margin-right: 2px;'/>").get(0);
			closeBtn.owner=this;
			closeBtn.onclick=function() { UIController.remove(this.owner); };
			header.append(closeBtn);
		}
		headerTr.get(0).owner = this;
		headerTr.dblclick(function() { this.owner.createEditDialog(); });
		headerTr.append(header);
		$('table tbody', this.div).prepend(headerTr);

		if (canMove) {
			headerTr.css('cursor', 'move');
			Drag.init(headerTr.get(0),this.div);
			this.div.onDragEnd = function(x,y) {
            	if (UIController.leftOffset)
            	    x = x - UIController.leftOffset;
            	if (UIController.topOffset)
            	    y = y - UIController.topOffset;
				this.owner.conf.setAttribute('x', x);
				this.owner.conf.setAttribute('y', y+15);
			}
		}
	}
	if (offset != 0) {
		if (this.div.style.height)
			this.div.style.height = (parseInt(this.div.style.height, 10)+offset)+'px';
		this.div.style.top = (parseInt(this.div.style.top, 10)-offset)+'px';
	}
};

CWidget.prototype.createEditDialog = function() {
	var edit = $("<div class='editDiv' style='display:block;'/>");
	var obj = this;

    edit.css('left', this.div.style.left);
    edit.css('top', this.div.style.top);
	edit.appendTo(document.body);
	this.addObjectFields(edit, obj);
};
