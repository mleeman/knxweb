function loadDesignList()
{
	req = jQuery.ajax({ url: 'design.php?action=designlist', dataType: 'xml',
		success: function(responseXML, status) {
			$('#designName').empty();
			var xmlResponse = responseXML.documentElement;
			if (xmlResponse.getAttribute('status') != 'error') {
		   		var designList = $('#designlist').empty();
				$('design', responseXML)
					.each(function() {
					    var name = this.getAttribute('name');
						var designHdr = $("<div class='designHdr'>"+name+"</div>");
						designList.append(designHdr);
						var details = $("<div class='designDetail'/>");
						$('version', this)
							.each(function() {
								var ver = $(this).text();
							    details.append("> "+ver+" <a href='design.html?design="+name+"&version="+ver+"'>view</a> <a href='designedit.html?design="+name+"&version="+ver+"'>Edit</a> <br/>");
							});
						designList.append(details);
					});
			}
			else
				$('#designList').text(tr('Unable to load design list: ')+xmlResponse.textContent);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$('#designlist').text(tr('Unable to load design list: ')+textStatus);
		}
	});
}

jQuery(function($) {
	displayVersion();
	addMenuSection('design', 'Design')
		.append('<a name="displayZoneLayout" href="design.html" >'+tr('Display design')+'</a><br/>'
		+'<a name="modifyZoneLayout" href="designedit.html" >'+tr('Modify design')+'</a><br/>'
		+'<a name="displayRules" href="rules.html" >'+tr('Display rules')+'</a><br/>');

	UIController.leftOffset = 180;
	loadDesignList();
});
