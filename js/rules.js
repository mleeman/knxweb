function Rule(conf) {
	this.id=conf.getAttribute("id");
    var cond = $(conf).children("condition");
	this.cond=createCondition(cond.get(0));
    var actions = new Array();
    $("actionlist[type!='on-false'] > action", conf).each(function() {
        actions.push(createAction(this));
    });
    this.onTrue=actions;
    actions = new Array();
    $("actionlist[type='on-false'] > action", conf).each(function() {
        actions.push(createAction(this));
    });
    this.onFalse=actions;

}

Rule.prototype = {
	getCondition: function() {
		return this.cond;
	},
	getActionTrue: function() {
		return this.onTrue;
	},
	getActionFalse: function() {
		return this.onFalse;
	},
	getContent: function() {
	    var content = $("<p>"+tr('Condition: ')+"</p>")
	        .append(this.cond.getContent())
	        .append("<br/>");
        if (this.onTrue.length) {
	        content.append(tr('Actions if True: ')+"<ul>");
    	    for (key in this.onTrue) {
    	        content.append("<li>"+this.onTrue[key].getContent()+"</li>"); //.getContent());
    	    }
    	    content.append("</ul><br/>")
    	}
        if (this.onFalse.length) {
    	    content.append(tr('Actions if False: ')+"<ul>")
    	    for (key in this.onFalse) {
    	        content.append("<li>"+this.onFalse[key].getContent()+"</li>"); //.getContent());
    	    }
    	    content.append("</ul><br/>")
    	}
		return content;
	}
}

function Condition(conf) {
    this.conf = conf;
}

Condition.prototype = {
	getContent: function() {
		return "empty";
	}
}

function createCondition(conf) {
    var type = conf.getAttribute('type');
    if (type == "object")
        return new ObjectCondition(conf);
    else if (type == "and")
        return new AndCondition(conf);
    else if (type == "or")
        return new OrCondition(conf);
    else if (type == "timer")
        return new TimerCondition(conf);
    return new Condition(conf);
}

function AndCondition(conf) {
    var conditions = Array();
    $(conf).children("condition").each(function () {
        conditions.push(createCondition(this));    
    });
    this.conditions = conditions;
}

AndCondition.prototype.getContent = function() {
    var content = "";
    if (this.conditions.length) {
	    content += "<font color='red'>";
	    for (key in this.conditions) {
	        content += ("("+this.conditions[key].getContent()+") AND ");
	    }
	    content = content.slice(0, -5);
	    content += "</font>";
	}
	return content;
}

function OrCondition(conf) {
    var conditions = Array();
    $(conf).children("condition").each(function () {
        conditions.push(createCondition(this));    
    });
    this.conditions = conditions;
}

OrCondition.prototype.getContent = function() {
    var content = "";
    if (this.conditions.length) {
	    content += "<font color='green'>";
	    for (key in this.conditions) {
	        content += ("("+this.conditions[key].getContent()+") OR ");
	    }
	    content = content.slice(0, -4);
	    content += "</font>";
	}
	return content;
}

function ObjectCondition(conf) {
    this.conf = conf;
}

ObjectCondition.prototype.getContent = function() {
    var id = this.conf.getAttribute('id');
    var val = this.conf.getAttribute('value');
	return "<font color='orange'>["+id+"] == '"+val+"'</font>";
}

function TimerCondition(conf) {
    this.conf = conf;
}

TimerCondition.prototype.getContent = function() {
    var details = '';
    $("at", this.conf).each(function () {
        if (wdays = this.getAttribute('wdays'))
            details += tr("on weekdays ") + wdays + " ";
        if (exceptions = this.getAttribute('exception')) {
            if (exceptions == 'yes')
                details += tr("only on exception days ");
            else if (exceptions == 'no')
                details += tr("except on exception days ");
        }
        details += tr("at ") + this.getAttribute('hour') + ":" + this.getAttribute('min') + "<br/>";
    });
    $("every", this.conf).each(function () {
        details += tr("every ") + this.textContent + tr(" seconds")+"<br/>";
    });
    $("until", this.conf).each(function () {
        if (wdays = this.getAttribute('wdays'))
            details += tr(" weekdays ") + wdays + " ";
        if (exceptions = this.getAttribute('exception')) {
            if (exceptions == 'yes')
                details += tr("only on exception days ");
            else if (exceptions == 'no')
                details += tr("except on exception days ");
        }
        details += tr("until ") + this.getAttribute('hour') + ":" + this.getAttribute('min') + "<br/>";
    });
    $("during", this.conf).each(function () {
        details += tr("during ") + this.textContent + tr(" seconds")+"<br/>";
    });
	return "<font color='blue' style='cursor: pointer' onClick=\"$('div.timerDetails', this).toggle();\" >Timer<div class='timerDetails' style='display: none' >"+details+"</div></font>";
}

function Action(conf) {
    this.conf = conf;
}

Action.prototype = {
	getContent: function() {
		return "empty";
	}
}

function createAction(conf) {
    var type = conf.getAttribute('type');
    if (type == "set-value")
        return new SetValueAction(conf);
    else if (type == "dim-up")
        return new DimUpAction(conf);
    else if (type == "send-sms")
        return new SendSmsAction(conf);
    else if (type == "send-email")
        return new SendEmailAction(conf);
    else if (type == "cycle-on-off")
        return new CycleOnOffAction(conf);
    else if (type == "shell-cmd")
        return new ShellCmdAction(conf);
    return new Action(conf);
}

function SetValueAction(conf) {
    this.conf = conf;
}

SetValueAction.prototype.getContent = function() {
    var id = this.conf.getAttribute('id');
    var val = this.conf.getAttribute('value');
	return tr("Set object '")+id+tr("' to '")+val+"'";
}

function DimUpAction(conf) {
    this.conf = conf;
}

DimUpAction.prototype.getContent = function() {
    var id = this.conf.getAttribute('id');
    var start = this.conf.getAttribute('start');
    var stop = this.conf.getAttribute('stop');
    var duration = this.conf.getAttribute('duration');
	return tr("Dim object '")+id+tr("' from ")+start+tr(" to ")+stop+tr(" during ")+duration+tr(" seconds");
}

function SendSmsAction(conf) {
    this.conf = conf;
}

SendSmsAction.prototype.getContent = function() {
    var id = this.conf.getAttribute('id');
    var value = this.conf.getAttribute('value');
	return tr("Send SMS '")+value+tr("' to ")+id;
}

function SendEmailAction(conf) {
    this.conf = conf;
}

SendEmailAction.prototype.getContent = function() {
    var to = this.conf.getAttribute('to');
    var subject = this.conf.getAttribute('subject');
    var body = this.conf.text;
	return tr("Send Email with subject '")+subject+tr("' to ")+to;
}

function CycleOnOffAction(conf) {
    this.conf = conf;
    var stop = $("stopcondition", this.conf);
    if (stop.length > 0) {
        this.stopCondition = createCondition(stop.get(0));
    }
}

CycleOnOffAction.prototype.getContent = function() {
    var id = this.conf.getAttribute('id');
    var on = this.conf.getAttribute('on');
    var off = this.conf.getAttribute('off');
    var count = this.conf.getAttribute('count');
    var content = tr("Cycle object '")+id+tr("' ON for ")+on+tr(" sec and OFF for ")+off+tr(" sec ")+count+tr(" times");
    if (this.stopCondition)
        content += tr(" (stop condition: ")+this.stopCondition.getContent()+")";
	return content;
}

function ShellCmdAction(conf) {
    this.conf = conf;
}

ShellCmdAction.prototype.getContent = function() {
    var cmd = this.conf.getAttribute('cmd');
	return tr("Execute shell command '")+cmd+"'";
}

function loadRules()
{
	var body = '<read><config><rules/></config></read>';
	req = jQuery.ajax({ type: 'post', url: 'linknx.php?action=cmd', data: body, processData: false, dataType: 'xml',
//	req = jQuery.ajax({ type: 'get', url: 'rules.xml', data: body, processData: false, dataType: 'xml', // TODO: remove this hardcoded xml file access
		success: function(responseXML, status) {
			var xmlResponse = responseXML.documentElement;
			if (xmlResponse.getAttribute('status') != 'error') {
//				UIController.setObjectsList(xmlResponse);
           		var rulesList = $('#rules').empty();
    			$('rule', responseXML)
    			    .each(function() {
        				var ruleHdr = "<div class='ruleHdr'>"+this.getAttribute('id')+"</div>";
        				rulesList.append(ruleHdr);
        				var details = $("<div class='ruleDetail'/>");
        				var rule = new Rule(this);
        				details.append(rule.getContent());
        				rulesList.append(details);
        			});
			}
			else
				alert(tr("Error: ")+xmlResponse.textContent);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			UIController.setNotification(tr("Error while loading rules: ")+textStatus);
		}
	});
}

function addMenu()
{
	addMenuSection('design', 'Design')
		.append('<a name="displayZoneLayout" href="design.html" >'+tr('Display design')+'</a><br/>'
		+'<a name="modifyZoneLayout" href="designedit.html" >'+tr('Modify design')+'</a><br/>'
		+'<a name="displayRules" href="rules.html" >'+tr('Display rules')+'</a><br/>');
}

jQuery(function($) {
	displayVersion();
	addMenu();
	loadRules();
  
//	runAfter.init();
});

