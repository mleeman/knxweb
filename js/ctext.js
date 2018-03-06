function CText(conf) {
    this.content = $("<td class='textDiv' align='center'/>");
    this.loadConfig(conf);

	var widget = this.init(conf, 'textDiv');
	widget.append($("<tr/>").append(this.content));
}

CText.type='text';
UIController.registerWidget(CText);
CText.prototype = new CWidget();
CText.prototype.getListeningObject = function() {
	return Array(this.object);
};
CText.prototype.loadConfig = function(conf) {
	this.label=conf.getAttribute("label");
	this.style=conf.getAttribute("style");
	this.format=conf.getAttribute("format");
	this.object=conf.getAttribute("object");
	this.pattern=conf.getAttribute("pattern");
	if (!this.pattern)
	    this.pattern="(.*)";
	this.regex = new RegExp(this.pattern);
	if (!this.format)
	    this.format=this.label;

	this.content.text(this.format);
	this.content.attr('style',this.style);

	// Backward compatibility, will be removed later on
	var offset=conf.getAttribute("offset");
	if (offset && this.object) {
	    this.format = this.format.substr(0, offset) + "$1" + this.format.substr(offset);
    	conf.removeAttribute("offset");
    	conf.setAttribute("format", this.format);
	}
};
CText.prototype.updateObject = function(obj,value) {
	if (obj==this.object)
	{
	    var m = value.match(this.regex);
	    if (m)
            value = m[0].replace(this.regex, this.format);
        else
            value = '';
		$('td.textDiv', this.div).text(value);
	}
};
