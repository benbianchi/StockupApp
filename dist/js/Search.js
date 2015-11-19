$(document).ready(function() {
	var material = window.location.href.slice(window.location.href.indexOf('#') + 1);
	console.log(material);
	performRequest(material);
});

function performRequest (sq) {
	// body...
	$.ajax({
		url: 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?query='+sq+'&callback=YAHOO.Finance.SymbolSuggest.ssCallback',
		type: 'GET',
		dataType: 'default: text'
	})
	.done(function(result) {
		console.log("success");
	})
	// .fail(function(result) {
	// })
	// .always(function(result) 
	// {

	// 	result = result.responseText.replace("YAHOO.Finance.SymbolSuggest.ssCallback(","");
	// 	result  = JSON.parse(result.slice(0,length-1));
	// 	console.log("complete"+ JSON.stringify (result) );
	// 	$('.result-container').text(JSON.stringify(result) );

	// });


}
	


