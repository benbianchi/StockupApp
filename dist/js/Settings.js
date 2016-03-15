var ConfigPath = "AppInfo.json"
var unsaved_changes_title = "Unsaved Changes";
var unsaved_changes_message = "You have editted your site list. Would you like to save your changes?";
var sites = [];
var fs = require('fs');
var example_stock_name = "Apple Inc."
var example_stock_symbol = "AAPL"


$(document).ready(function() {

	//Load sites and put them into a table.


	
	Loadsites();

	
	$('#command_AddSite').click(function(event) {
		dirty = true;
		$('#model_SiteTable').append('<tr class="model_SiteTable_Cell_dormant"><td class="model_SiteTable_URL">Unconfigured</td><td>Unconfigured</td><td class="COMMAND"><i id="'+($('tr').length -1)+'" class="delete fa fa-close"></i></td></tr>')
	});

	//If the user dbl-clicks, then allow him to edit it.
	$('#model_SiteTable').on('dblclick', "tr.model_SiteTable_Cell_dormant",function(event) {
		dirty = true;
		$(this).attr('class', 'model_SiteTable_Cell_active');
		var Textvalue = $(this).children('').first().text();
		console.log(Textvalue)
		$(this).children('').first().replaceWith('<input type="text" value="'+Textvalue+'"/>');
		$(this).children('').first().focus();
	});

	$('#model_SiteTable').on('focusout',"tr.model_SiteTable_Cell_active",function(event) {
		$(this).attr('class', 'model_SiteTable_Cell_dormant');
		$(this).children('').first().replaceWith('<td class="model_SiteTable_URL">'+$(this).children('').first().val()+"</td>");
	});

	$('#model_SiteTable').on('mouseenter', 'tr.model_SiteTable_Cell_dormant', function() {
		$(this).children("td:last-child").children('.delete').css({ 'color': 'red'});
	});

	$('#model_SiteTable').on('mouseleave', 'tr.model_SiteTable_Cell_dormant', function() {
		$(this).children("td:last-child").children('.delete').css({ 'color': 'white'});
	});



	//If the user clicks the X, then lets delete this entry
	$('#model_SiteTable').on('click','tr td .delete', function() {
	dirty = true;
	
		$(this).parent('').parent('').remove();
	});


		//Prevent the user from leaving if he has changed anything. Then ask him if wants to abandon changes.
		$('a').click(function(event) {
		var href = $(this).attr('href');
		if (dirty)
		{
		event.preventDefault();
			MHAlert(unsaved_changes_title,unsaved_changes_message,
			"Save","Continue Without Saving",
			function () {
				var out = JSON.parse(fs.readFileSync(ConfigPath,"utf8") );
				sites  = [];

				for (var i = 0; i < $('tr.model_SiteTable_Cell_dormant').length; i++) {
					console.log($('tr.model_SiteTable_Cell_dormant')[i]);
					sites[i] = JSON.parse ( '{ "URL":"'+$('tr.model_SiteTable_Cell_dormant')[i].children[0].innerHTML+'"	}' )
				};
				out.sites = sites;
				fs.writeFileSync(ConfigPath,JSON.stringify(out)	);
				window.location = href;
			},
			function () {
				window.location = href;	
			});
		}
	});
});



/**
 * @method Loadsites Load Stocks from a file hosted in the local file tree.
 */
function Loadsites () {
	

	var config = getConfiguration();

	var config = JSON.parse(fs.readFileSync("AppInfo.json",'utf8') );
	sites = file.sites;	

	for (var i =0 ; i < config.sites.length ; i++) {
		console.log(config.sites[i].URL)
		var preview =config.sites[i].URL.replace(/\[symbol\]/g, example_stock_symbol).replace(/\[name\]/g, example_stock_name);
		$('#model_SiteTable').append('<tr class="model_SiteTable_Cell_dormant"><td class="model_SiteTable_URL">'+config.sites[i].URL+'</td><td>'+preview+'</td><td class="COMMAND"><i id="'+i+'" class="delete fa fa-close"></i></td></tr>')
	};
}

