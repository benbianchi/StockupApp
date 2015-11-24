// Dashboard.js
// @author: Ben Bianchi

// The purpose of this script is to correctly handle and populate the Dashboard.html page.

var appInfo;
var ConfigPath = "AppInfo.json";
var fs = require("fs");
var activeIframeID = 0;
var activeStockID = 0;

$(document).ready(function() {

	
	var appInfo =JSON.parse( fs.readFileSync(ConfigPath,"utf8") );
	
	loadStocks(appInfo);
	loadIframes(0,0);

	//Resize the main page for maximum real estate. Fires on window resize.
	$(window).resize(function(event) {
		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);
	});

	//Resize the main page for maximum real estate. Fires on window load (after Iframes).
	$(window).load(function(event) {
		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);

	});

	//When a user clicks a new stock, populate the iframes correctly with new info.
	$('#Dashboard-List li').click(function(event) {
		
		$('#Dashboard-List li.active').toggleClass('active');
		$(this).toggleClass('active');

console.log("iframe-wrapper #stockframe-"+activeIframeID);
		$("#iframe-wrapper #stockframe-"+activeIframeID).toggleClass('MH-iframe-hidden');
		activeIframeID = $(this).attr('index');
		$("#iframe-wrapper #stockframe-"+activeIframeID).toggleClass('MH-iframe-hidden');

		$('#iframe-wrapper #stockframe-'+activeIframeID).toggleClass('MH-iframe-hidden');

		activeIframeID = $(this).attr('index');

		$('#iframe-wrapper #stockframe-'+activeIframeID).toggleClass('MH-iframe-hidden');
				var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);



	});

	$('#Populate_StockList li').click(function(event) {
		
		$('#Populate_StockList li.active').toggleClass('active');
		$(this).toggleClass('active');

		

		loadIframes(activeIframeID,$(this).attr('index'));

	});;

console.log($('#Populate_StockList li.active p').html());
	$('#current_stock').html($('#Populate_StockList li.active').html())
	$('#current_stock').append('<span class="caret"></span></a>')

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
			{
			$('#Dashboard-List').append('<li index="'+i+'" class="active"><a >'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
			$('#Populate_StockList').append('<li index="'+i+'" class="active"><a  symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  >'+appInfo.saved_stocks[i].name+'</a></li>');
		}
		else
		{
			$('#Populate_StockList').append('<li index="'+i+'" ><a symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  >'+appInfo.saved_stocks[i].name+'</a></li>');
			$('#Dashboard-List').append('<li class="" index="'+i+'"><a>'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
		}
	};

}
function loadIframes (IframeIndex, StockIndex) {
	
	activeIframeID = IframeIndex;
	activeStockID = StockIndex;
	if (appInfo == undefined)	
		appInfo =JSON.parse( fs.readFileSync(ConfigPath,"utf8") );
	

	for (var i = 0; i < appInfo["sites"].length -1; i++) {

		if ($('#iframe-wrapper').children('')[i] )
		{
			$('#iframe-wrapper').children('').remove();
		}


		//Process URLS and inject stock names.
		console.log(IframeIndex);
		
		var source = appInfo["sites"][i]["URL"].replace("[symbol]",appInfo["saved_stocks"][StockIndex]["symbol"]).replace("[name]",appInfo["saved_stocks"][StockIndex]["name"]);

		if (i == IframeIndex)
		{
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe"></iframe>');
		}
		else
		{
			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe MH-iframe-hidden"></iframe>');
		}


		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);

		$('#current_stock').text($('#Populate_StockList li.active a').text())
		$('#current_stock').append('<span class="caret"></span></a>')
	};

};



function getSourceAfterProcessing (index ) {
	// body...
}