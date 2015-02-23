
var conf = "Stocks.json";
var request = require('request');
var fs = require('fs');
var currentTabIndex=0;
var selectedStockIndex=0;
var stocks;
$( document ).ready(function() {
	if (fs.existsSync("Stocks.json"))
	{
		console.log("Stocks.json exists, load into html");
		var stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') )
		for (var i = stocks.recentStocks.length - 1; i >= 0; i--) {
			$("#recentStocks").append("<li id='"+i+"' class='new-item'>"+stocks.recentStocks[i].symbol+"</li>");
			console.log(stocks.recentStocks[i].name)
		};
		for (var i = 0; i < stocks.Urls.length; i++) {
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
		fs.writeFileSync("Stocks.json", '{ "recentStocks":[],"Urls":[],"}', "utf8");
	}


	$("#recentStocks li").click(function(){
		selectedStockIndex = $(this).attr("id");

		$( "iframe" ).each(function( index ) {
			console.log( $( this).attr('src') )
		 $(this).attr('src',getURL( stocks.Urls[index]));
		});
	})

	$("#queryButton").click(function(event) {

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
		console.log("Hello");

		$('#urllist').append('<div class="row"><div class="medium-3 columns" id="input">URL:</div><div class="medium-8 columns"><input id="urlInput" type="text"></div><div class="medium-1 columns"><i class="fa fa-close"></i></div></div>')
		$('.iList').append('<iframe height="100%" src="'+stocks.Urls[stocks.Urls.length-1]+'" frameborder="0" class="pageView pageViewVisible" id="if_'+stocks.Urls.length+'"></iframe> ')	
	})
	$('#iconlist #save_url').click(function(event) {
		var l=[];
		var stocks 	=  JSON.parse(	fs.readFileSync(conf,'utf8') );
		for (var i =0; i< $("#urllist input").length; i++) {
			console.log($("#urllist #urlInput")[i].value)
			l.push($("#urllist #urlInput")[i].value );
		};

		$("iframe").each(function(index){
			$(this).attr('src',getURL( stocks.Urls[index]));
		})
		stocks.Urls = l;
		
		fs.writeFileSync("Stocks.json",JSON.stringify(stocks),"utf8");
	});

	$("#Control_Back").click(function(event){
		var old = currentTabIndex;
		if (currentTabIndex==0)
			{currentTabIndex=$("iframe").length-1} 
		else
			{currentTabIndex--};
		handleIframe(old,currentTabIndex);
	});
	$("#Control_Forw").click(function(event){
		var old = currentTabIndex;
		if (currentTabIndex==$("iframe").length-1)
			{currentTabIndex=0} 
		else
			{currentTabIndex++};
		handleIframe(old,currentTabIndex);
	});
});

function getURL (url) {
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
	$( "iframe" ).each(function( index ) {
		if(index==first || index==second)
			$( this).toggleClass("pageViewVisible");
		});
}