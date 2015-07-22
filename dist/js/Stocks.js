$(document).ready(function() {



	LoadStocks();

	$('#command_AddSite').click(function(event) {
		$('#model_StockTable').append('<tr class="model_StockTable_Cell_dormant"><td class="model_StockTable_URL">Unconfigured</td><td>Example</td></tr>')
	});


	$('#model_StockTable').on('dblclick', "tr.model_StockTable_Cell_dormant",function(event) {
		
		$(this).attr('class', 'model_StockTable_Cell_active');
		var Textvalue = $(this).children('').first().text();
		console.log(Textvalue)
		$(this).children('').first().replaceWith('<input type="text" value="'+Textvalue+'"/>');
		$(this).children('').first().focus();
	});

	$('#model_StockTable').on('focusout',"tr.model_StockTable_Cell_active",function(event) {
		$(this).attr('class', 'model_StockTable_Cell_dormant');
		$(this).children('').first().replaceWith('<td class="model_StockTable_URL">'+$(this).children('').first().val()+"</td>");
	});
	
});



function LoadStocks () {
	var fs = require('fs');

	var file = JSON.parse(fs.readFileSync("AppInfo.js",'utf8') );
	console.log(file);
	for (var i = file.Stocks.length - 1; i >= 0; i--) {
		$('#model_StockTable').append('<tr class="model_StockTable_Cell_dormant"><td class="model_StockTable_URL">'+file.Stocks[i].name+'</td><td>'+file.Stocks[i].ticker+'</td></tr>')
	};

	// body...
}