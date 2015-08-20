

$(document).ready(function() {
	var iqueue = [];
	var fs = require('fs');	
	var appInfo =JSON.parse ( fs.readFileSync('AppInfo.json','utf8') );
	
	loadIframes(appInfo.sites,0)
	loadStocks(appInfo);


});

/**
 * Horizontally grow and load each iframe so that the user experiences minimal delay when switching website.
 * @param  {[type]} q [description]
 * @return {[type]}   [description]
 */

function loadStocks (appInfo) {
	if ( appInfo == undefined)	
		var appInfo =JSON.parse ( require('fs').readFileSync('AppInfo.json','utf8') );
	for (var i = 0; i < appInfo.saved_stocks.length; i++) {
		if (i == appInfo.activeStockIndex)
			$('#Fast_Stock_Switch').before('<li class="active"><a href="#">'+appInfo.saved_stocks[i].name+'</a></li>');
		else
			$('#Fast_Stock_Switch').before('<li><a href="#">'+appInfo.saved_stocks[i].name+'</a></li>');
	};

}
function loadIframes (q, defaultindex) {
	var min = defaultindex;
	var max = defaultindex;

	for (var i = 0; i < q.length; i++) {
		if (i == defaultindex)
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" class="col-xs-12 MH-iframe"></iframe>');
		else
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" class="col-xs-12 MH-iframe MH-iframe-hidden"></iframe>');

		$('.MH-iframe #stockframe-'+i).load(function() {
			console.log("loaded");
		});
	};

};
