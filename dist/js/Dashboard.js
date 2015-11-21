var appInfo;
var ConfigPath = "AppInfo.json";
var fs = require("fs");
var activeIframeID = 0;

$(document).ready(function() {

		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);
		console.log(nheight);
		console.log($("#page-wrapper"))

	var iqueue = [];
	
	var appInfo =JSON.parse( fs.readFileSync(ConfigPath,"utf8") );
	
	loadStocks(appInfo);
	loadIframes(appInfo.sites,0);

	$(window).resize(function(event) {
		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);
		// console.log(nheight);
		// console.log($("#page-wrapper"))
	});


	$("#Search_Emblem").click(function(event) {
		console.log($("#search-input").text());
		if ($("#search-input").val() == "")
			return;
		else
			window.location = "../pages/search.html#"+$("#search-input").val();
	});

	$('#Dashboard-List li a').click(function(event) {
		console.log($('#iframe-wrapper #stockframe-'+activeIframeID));		
		$('#iframe-wrapper #stockframe-'+activeIframeID).toggleClass('MH-iframe-hidden');
		console.log(activeIframeID+" vs "+ $(this).attr('index'));
		activeIframeID = $(this).attr('index');
		$('#iframe-wrapper #stockframe-'+activeIframeID).toggleClass('MH-iframe-hidden');

	});


});

/**
 * Horizontally grow and load each iframe so that the user experiences minimal delay when switching website.
 * @param  {[type]} q [description]
 * @return {[type]}   [description]
 */

function loadStocks (appInfo) {
	if ( appInfo == undefined)	
		appInfo =JSON.parse ( fs.readFileSync(ConfigPath,"utf8") );
	for (var i = 0; i < appInfo.saved_stocks.length; i++) {
		if (i == appInfo.activeStockIndex)
			$('#Dashboard-List').append('<li class="active"><a index="'+i+'" symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  href="#">'+appInfo.saved_stocks[i].name+'</a></li>');
		else
			$('#Dashboard-List').append('<li><a index="'+i+'" symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  href="#">'+appInfo.saved_stocks[i].name+'</a></li>');
	};

}
function loadIframes (q, defaultindex) {
	var min = defaultindex;
	var max = defaultindex;

	if (appInfo == undefined)	
		appInfo =JSON.parse( fs.readFileSync(ConfigPath,"utf8") );
	

	console.log(JSON.stringify(appInfo));
	for (var i = 0; i < q.length; i++) {

		//Process URLS and inject stock names.
		
		var source = appInfo["sites"][i]["URL"].replace("[symbol]",appInfo["saved_stocks"][i]["symbol"]).replace("[name]",appInfo["saved_stocks"][i]["name"]);

		if (i == defaultindex)
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe"></iframe>');
		else
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe MH-iframe-hidden"></iframe>');
		console.log(source);
		$('.MH-iframe #stockframe-'+i).load(function() {
			console.log("loaded");
		});
	};

};
