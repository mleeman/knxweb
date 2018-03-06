function CValue(conf) {
    this.light = $("<img/>").get(0);
    this.loadConfig(conf);
	this.value=false;
    var widget = this.init(conf);
	widget.append($("<tr/>").append($("<td/>").append(this.light)));

	this.light.onclick=function() { this.owner.displayValueDialog()	};
	this.light.owner=this;
}

CValue.type='value';
UIController.registerWidget(CValue);
CValue.prototype = new CWidget();
CValue.prototype.loadConfig = function(conf) {
	this.commandObject=conf.getAttribute("object");
	var values = new Object();
	var next = new Object();
	var prev = undefined;
	var first = undefined;
	var dpath = "design/"+UIController.getDesignName()+"/";
	this.light.src=dpath+conf.getAttribute("img");
};

CValue.prototype.displayValueDialog = function() {
	var newdiv = $("<div class='editDiv' style='display:block;'/>");
	var obj = this;

    newdiv.css('left', this.div.style.left);
    newdiv.css('top', this.div.style.top);
	newdiv.appendTo(document.body);

    var value = $("<input type='text'>");
	newdiv.append(value);
    var okBtn = $("<input type='button' value='"+tr('Ok')+"'/>");
    var commandObject = this.commandObject;
	okBtn.click(function() {
        EIBCommunicator.eibWrite(commandObject, value.val());
        newdiv.remove();
	});
	newdiv.append(okBtn);

    var closeBtn = $("<input type='button' value='"+tr('Close')+"'/>");
    var commandObject = this.commandObject;
	closeBtn.click(function() { newdiv.remove(); });
	newdiv.append(closeBtn);
};
