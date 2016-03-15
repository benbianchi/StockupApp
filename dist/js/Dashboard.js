// Dashboard.js
// @author: Ben Bianchi

// The purpose of this script is to correctly handle and populate the Dashboard.html page.

var appInfo;
var ConfigPath = "AppInfo.json";
var fs = require("fs");
var activeIframeID = 0;
var activeStockID = 0;

$(document).ready(function() {
	/*
	The page timeline goes as follows.

	1.	The stocks and sites are loaded through a utility function
	2.	Iframes are generated depending on what stock is selected

	At this point, we have setup listeners that wait for events:
	1.	The user changes the current stock he is looking at.
	2.	The user changes the current site he is using.
	3.	The user adds a new stock using the form at the top left corner of the screen.
	4.	The user changes the dimensions of the screen, forcing a redraw.
	 */

	
	var appInfo =JSON.parse( fs.readFileSync(ConfigPath,"utf8") );
	
	loadStocks(appInfo);
	loadIframes(0,0);

	$('#Search_Emblem').click(function(event) {
		bReloaded=true;
		IframeIndex=activeIframeID;
		console.log("Running");
		var name =	$("#name-search-input").val();
		var symbol=	$("#symbol-search-input").val();

	if (!appInfo)	
		appInfo =JSON.parse ( fs.readFileSync(ConfigPath,"utf8") );

		var jsob = {};
		jsob.name= name;
		jsob.symbol=symbol;

	if (JSON.stringify(appInfo.saved_stocks).indexOf(symbol) == -1)
	{
		appInfo["saved_stocks"].push(jsob);
		fs.writeFileSync(ConfigPath,JSON.stringify(appInfo));
	}

	loadIframes(activeIframeID,activeStockID,true);
	
	// for (var i = 0; i < appInfo.sites.length; i++) {



	// 	if (!bReloaded)
	// 	{
	// 		if (i == IframeIndex)
	// 			$('#Dashboard-List').append('<li index="'+i+'" class="active"><a >'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
	// 		else
	// 			$('#Dashboard-List').append('<li index="'+i+'"><a>'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
	// 	}


	// 	var source = appInfo["sites"][i]["URL"].replace("[symbol]",symbol).replace("[name]",name);
	// 	console.log(source);

	// 	if (i == IframeIndex)
	// 	{
	// 		if ($('#iframe-wrapper').children('')[i])
	// 		{
	// 			$('#iframe-wrapper iframe#stockframe-'+i).attr('src', source);
	// 			$('#iframe-wrapper iframe#stockframe-'+i).attr('class', "MH-iframe");
	// 		}
	// 		else
	// 			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe"></iframe>');
	// 	}
	// 	else
	// 	{
	// 		if ($('#iframe-wrapper').children('')[i])
	// 		{
	// 			$('#iframe-wrapper iframe#stockframe-'+i).attr('src', source);
	// 			$('#iframe-wrapper iframe#stockframe-'+i).attr('class', "MH-iframe MH-iframe-hidden");
	// 		}
	// 		else
	// 			$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe MH-iframe-hidden"></iframe>');
	// 	}


	// 	var nheight =$("#page-wrapper").height();
	// 	$(".panel-body#iframe-wrapper").height(nheight);

	// };
		$('#current_stock').text($('#Populate_StockList li.active a').text())
		$('#current_stock').append('<span class="caret"></span></a>')




		

	});

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

	//When the user changes the stock, then update the iframes and recolor the element to show that it is active.
	$('#Populate_StockList li').click(function(event) {
		
		$('#Populate_StockList li.active').toggleClass('active');
		$(this).toggleClass('active');

		

		loadIframes(activeIframeID,$(this).attr('index'), true);

	});



	$('#current_stock').html($('#Populate_StockList li.active').html())
	$('#current_stock').append('<span class="caret"></span></a>')

});

/**
 * Horizontally grow and load each iframe so that the user experiences minimal delay when switching website.
 * @param  {[type]} q [description]
 * @return {[type]}   [description]
 */

function loadStocks (appInfo) {
	appinfo = getConfiguration();

	for (var i = 0; i < appInfo.saved_stocks.length; i++) {
		if (i == appInfo.activeStockIndex)
			{
			
			$('#Populate_StockList').append('<li index="'+i+'" class="active"><a  symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  >'+appInfo.saved_stocks[i].name+'</a></li>');
		}
		else
		{
			$('#Populate_StockList').append('<li index="'+i+'" ><a symbol="'+appInfo.saved_stocks[i].symbol+'" name="'+appInfo.saved_stocks[i].name+'"  >'+appInfo.saved_stocks[i].name+'</a></li>');
			
		}
	};

}
/**
 * @method loadIframes	Populates Stock list in the left hand menu as well as resets all Iframes to proper URLs.
 * @param  {Integer} IframeIndex	The current index of the current iframe rendered.
 * @param  {Integer} StockIndex 	The current stock that is loaded.	
 * @param  {Boolean} bReloaded	Set to true if the reprogramming of the iframes requires the old ones to be removed.
 * @return {null}
 */
function loadIframes (IframeIndex, StockIndex,bReloaded) {
	
	activeIframeID = IframeIndex;
	activeStockID = StockIndex;

	appInfo = getConfiguration();
	
	for (var i = 0; i < appInfo.sites.length; i++) {



		if (!bReloaded)
		{
			if (i == IframeIndex)
				$('#Dashboard-List').append('<li index="'+i+'" class="active"><a >'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
			else
				$('#Dashboard-List').append('<li index="'+i+'"><a>'+appInfo["sites"][i]["URL"].split('/')[2]+'</a>')
		}


		var source = appInfo["sites"][i]["URL"].replace("[symbol]",appInfo["saved_stocks"][StockIndex]["symbol"]).replace("[name]",appInfo["saved_stocks"][StockIndex]["name"]);

		if (i == IframeIndex)
		{
			if ($('#iframe-wrapper').children('')[i])
			{
				$('#iframe-wrapper iframe#stockframe-'+i).attr('src', source);
				$('#iframe-wrapper iframe#stockframe-'+i).attr('class', "MH-iframe");
			}
			else
				$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe"></iframe>');
		}
		else
		{
			if ($('#iframe-wrapper').children('')[i])
			{
				$('#iframe-wrapper iframe#stockframe-'+i).attr('src', source);
				$('#iframe-wrapper iframe#stockframe-'+i).attr('class', "MH-iframe MH-iframe-hidden");
			}
			else
				$('#iframe-wrapper').append('<iframe id="stockframe-'+i+'" src="'+source+'" class="col-xs-12 MH-iframe MH-iframe-hidden"></iframe>');
		}


		var nheight =$("#page-wrapper").height();
		$(".panel-body#iframe-wrapper").height(nheight);

	};
		$('#current_stock').text($('#Populate_StockList li.active a').text())
		$('#current_stock').append('<span class="caret"></span></a>')

};

