function CHtml(conf) {
    this.content = $("<td/>");
    this.loadConfig(conf);

	var widget = this.init(conf, 'textDiv');
	widget.append($("<tr/>").append(this.content));
}

CHtml.type='html';
UIController.registerWidget(CHtml);
CHtml.prototype = new CWidget();
CHtml.prototype.loadConfig = function(conf) {
	this.label=conf.getAttribute("label");
	this.content.empty();
	if (conf.firstChild)
		this.content.append(conf.firstChild.nodeValue);
};
