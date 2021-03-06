var ConfigPath = "AppInfo.json";
var stocks = [];
fs = require('fs');

var unsaved_changes_title = "Unsaved Changes";
var unsaved_changes_message = "You have made changes to your stock list, would you like to save?";
$(document).ready(function() {



	dirty = false;


	LoadStocks();

	$('#command_AddSite').click(function(event) {
		dirty = true;
		stocks.push( JSON.parse('{"name":"Unconfigured","symbol":"None"}') );
		$('#model_StockTable').append('<tr class="model_StockTable_Entry"><td class="model_StockTable_Name">Unconfigured</td><td class="model_StockTable_Symbol">Example</td><td class="COMMAND"><i id="'+($('tr').length -1)+'" class="delete fa fa-close"></i></td></tr>')
	});


	$('#model_StockTable').on('dblclick', "td",function(event) {

		if ($(this).hasClass('COMMAND'))
			return;

		var cell = $(this);
		var row = $(this).parent('');
		console.log(row);
		$(this).attr('class', 'model_StockTable_Cell');
		var Textvalue = $(this).text();
		$(this).text('');
		$(this).append('<input type="text" value="'+Textvalue+'"/>');
		$(this).children('').focus();
		$(this).children('').focusout(function(event) {
			dirty = true;
			var index = ( $("tr.model_StockTable_Cell").index(row) );
			console.log(index)
			console.log(cell.children('').first().val())
			console.log(cell.children('').siblings('').last().val())
			$(this).replaceWith($(this).val());

			/* Act on the event */
		});
	});


$('#model_StockTable').on('mouseenter', 'tr', function() {
		$(this).children("td:last-child").children('.delete').css({ 'color': 'red'});
	});

	$('#model_StockTable').on('mouseleave', 'tr', function() {
		$(this).children("td:last-child").children('.delete').css({ 'color': 'white'});
	});


$('#model_StockTable').on('click','tr td .delete', function() {
	dirty = true;
	
		$(this).parent('').parent('').remove();
	});

	$('a').click(function(event) {
		var href = $(this).attr('href');
		if (dirty)
		{
			event.preventDefault();
			MHAlert(unsaved_changes_title,unsaved_changes_message,
				"Save","Continue Without Saving",
				function () {
					var out = JSON.parse(fs.readFileSync(ConfigPath,"utf8") );
					stocks  = [];

					for (var i = 0; i < $('tr.model_StockTable_Entry').length; i++) {
						console.log($('tr.model_StockTable_Entry')[i]);


						stocks[i] = JSON.parse ( '{ "name":"'+$('tr.model_StockTable_Entry')[i].children[0].innerHTML+'","symbol":"'+$('tr.model_StockTable_Entry')[i].children[1].innerHTML+'"	}' )
					};
					out.saved_stocks = stocks;
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
 * Load Stocks from a file hosted in the local file tree.
 */
 function LoadStocks () {
 	var fs = require('fs');

 	var file = JSON.parse(fs.readFileSync("AppInfo.json",'utf8') );
 	stocks = file.saved_stocks;	

 	for (var i =0 ; i < file.saved_stocks.length ; i++) {
 		$('#model_StockTable').append('<tr class="model_StockTable_Entry"><td class="model_StockTable_Name">'+file.saved_stocks[i].name+'</td><td>'+file.saved_stocks[i].symbol+'</td><td class="COMMAND"><i id="'+i+'" class="delete fa fa-close"></i></td></tr>')
 	};
 }


