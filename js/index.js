
var request = require('request');		//Referred to on line 43, request is used to see if the stock really exists, and what is its information.
var fs = require('fs');					//Required for read and writes for options and configurations.
var currentTabIndex=0;					//Information required to update/switch tabs.
var selectedStockIndex=0;				//Information required for updating tabs.
var stocks;								//Name of the JSON we use to store options and configurations
$( document ).ready(function() {		//Get Ready to run!
	if (fs.existsSync("Stocks.json"))	//Do we have options saved?
	{
		console.log("Stocks.json exists, load into html");
		var stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') )	//Load options
		for (var i = stocks.recentStocks.length - 1; i >= 0; i--) {			//Populate stock list.
			$("#recentStocks").append("<li id='"+i+"' class='new-item'>"+stocks.recentStocks[i].symbol+"</li>");
			console.log(stocks.recentStocks[i].name)
		};
		for (var i = 0; i < stocks.Urls.length; i++) {						//Populate Iframe List with correct urls

			$('#urllist').append('<div class="row"><div class="medium-3 columns" id="input">URL:</div><div class="medium-8 columns"><input id="urlInput" type="text" value="'+stocks.Urls[i]+'"></div><div class="medium-1 columns"><i class="fa fa-close"></i></div></div>')	
			if(i==0)
				$('.iList').append('<iframe src="'+getURL(stocks.Urls[i])+'" frameborder="0" id="'+i+'" class="pageView pageViewVisible"></iframe> ')
			else
				$('.iList').append('<iframe src="'+getURL(stocks.Urls[i])+'" frameborder="0" id="'+i+'" class="pageView"></iframe> ')
			console.log(getURL(stocks.Urls[i]));
		};
	}
	else
	{
		console.log("First time setup!");
		fs.writeFileSync("Stocks.json", '{ "recentStocks":[],"Urls":[],"}', "utf8");	//Build a config file if there isn't one
	}


	$("#recentStocks li").click(function(){												//Track the last clicked stock. His index which is also his id, will be used.
		selectedStockIndex = $(this).attr("id");										//Reload all iframes.

		$( "iframe" ).each(function( index ) {
			console.log( $( this).attr('src') )
		 $(this).attr('src',getURL( stocks.Urls[index]));
		});
	})

	$("#queryButton").click(function(event) {

		//This request returns JSON, however with a yahoo string encasing it. Remove the wrapping text and convert into JSON. 
		//When we have parsed the text, extract the stock name and symbol and save it to the config file while updating the stock list.

		request('http://d.yimg.com/autoc.finance.yahoo.com/autoc?query='+encodeURIComponent($('#queryBar').val())+'&callback=YAHOO.Finance.SymbolSuggest.ssCallback', function (error, response, body) {
			if (!error && response.statusCode == 200) {
    			body = body.replace('YAHOO.Finance.SymbolSuggest.ssCallback(',"");
    			body = body.slice(0, body.length-1)
    			body = JSON.parse(body)
    		$('#urllist').append('<div class="row"><div class="medium-3 columns" id="input">URL:</div><div class="medium-8 columns"><input id="urlInput" type="text"></div><div class="medium-1 columns"><i class="fa fa-close"></i></div></div>')	;
    			var name = body.ResultSet.Result[0].name;
    			var symbol = body.ResultSet.Result[0].symbol
				var obj = JSON.parse('{	"name"	:"'+name+'","symbol":"'+symbol+'"}')
				var stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') );
				if (fs.readFileSync("Stocks.json","utf8").indexOf(name) == -1)
				{
				stocks['recentStocks'].push(obj);
				fs.writeFileSync("Stocks.json",JSON.stringify(stocks),"utf8");
				$("#recentStocks").append('<li class="new-item" >'+obj.symbol+'</li>')	
			}
		}
	});
});


	$('#iconlist #Add_url').click(function(event) {
		//add a particular url, create new input and Iframe.

		$('#urllist').append('<div class="row"><div class="medium-3 columns" id="input">URL:</div><div class="medium-8 columns"><input id="urlInput" type="text"></div><div class="medium-1 columns"><i class="fa fa-close"></i></div></div>')
		$('.iList').append('<iframe height="100%" src="'+stocks.Urls[stocks.Urls.length-1]+'" frameborder="0" class="pageView pageViewVisible" id="if_'+stocks.Urls.length+'"></iframe> ')	
	})
	$('#iconlist #save_url').click(function(event) {
		//Save all new and changed inputs
		var l=[];
		var stocks 	=  JSON.parse(	fs.readFileSync(conf,'utf8') );
		for (var i =0; i< $("#urllist input").length; i++) {
			console.log($("#urllist #urlInput")[i].value)
			l.push($("#urllist #urlInput")[i].value );
		};

		$("iframe").each(function(index){
			//Update each iframe.
			$(this).attr('src',getURL( stocks.Urls[index]));
		})

		stocks.Urls = l;
		//save the information	
		fs.writeFileSync("Stocks.json",JSON.stringify(stocks),"utf8");
	});

	$("#Control_Back").click(function(event){
		//On button click, we will switch the iframe. We are also handling if the new index is less than 0 or greater than the amount of tabs we have.
		var old = currentTabIndex;
		if (currentTabIndex==0)
			{currentTabIndex=$("iframe").length-1} 
		else
			{currentTabIndex--};
		handleIframe(old,currentTabIndex);
	});
	$("#Control_Forw").click(function(event){
		//On button click, we will switch the iframe. We are also handling if the new index is less than 0 or greater than the amount of tabs we have.
		var old = currentTabIndex;
		if (currentTabIndex==$("iframe").length-1)
			{currentTabIndex=0} 
		else
			{currentTabIndex++};
		handleIframe(old,currentTabIndex);
	});
});

function getURL (url) {

	//Lazy way to lookup urls, and swap out the correct information.
		stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') )
		console.log(JSON.stringify(stocks.recentStocks) )
		console.log(selectedStockIndex)
		url = url.split("[SYMBOL]").join(stocks.recentStocks[selectedStockIndex].symbol)
		url = url.split("[NAME]").join(stocks.recentStocks[selectedStockIndex].name)
		console.log("replaced!")
		return url;
}

function synConfig () {

}
function handleIframe(first,second)
{

	//Change Iframe classs (specifically, by toggling.)
	$( "iframe" ).each(function( index ) {
		if(index==first || index==second)
			$( this).toggleClass("pageViewVisible");
		});
}