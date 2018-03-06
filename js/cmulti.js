function CMulti(conf) {
    this.light = $("<img/>").get(0);
    this.loadConfig(conf);
	this.value=undefined;
    var widget = this.init(conf);
	widget.append($("<tr/>").append($("<td/>").append(this.light)));

	this.light.owner=this;
}

CMulti.type='multi';
UIController.registerWidget(CMulti);
CMulti.prototype = new CWidget();
CMulti.prototype.getListeningObject = function() {
	return Array(this.commandObject);
};
CMulti.prototype.loadConfig = function(conf) {
	this.commandObject=conf.getAttribute("object");
	var values = new Object();
	var next = new Object();
	var prev = undefined;
	var first = undefined;
	var dpath = "design/"+UIController.getDesignName()+"/";
	$('item', conf).each(function() {
		var val = this.getAttribute("value");
		values[val] = dpath+this.getAttribute("img");
		if (prev)
			next[prev] = val;
		else
			first = val;
		prev = val;
	});
	next[prev] = first;
	this.values = values;
	this.next = next;

	this.light.src=this.values[first];

	this.readonly = (conf.getAttribute("readonly") == 'true');
	if (this.readonly)
		this.light.onclick = null;
	else {
		this.light.onclick=function() {
			var val = this.owner.next[this.owner.value];
			if (val) {
				EIBCommunicator.eibWrite(this.owner.commandObject, val);
				this.owner.updateObject(this.owner.commandObject, val);
			}
		};
	};	
};
CMulti.prototype.updateObject = function(obj,value) {
	if (obj==this.commandObject)
	{
		var newval = this.values[value];
		if (newval) 
		{
			this.light.src=newval;
			this.value=value;
		}
	}
};
