$(document).ready(function() {
	
	// $('body').on('click', function(event) {
	// 	event.preventDefault();
	// 	$('body').append('<div class="modal fade in" id="myModal" role="dialog" style="display: block;">'+
 //    '<div class="modal-dialog">' +
    
 //      '<!-- Modal content--> '+
 //     ' <div class="modal-content">' +
 //       ' <div class="modal-header">' +
 //        '  <button type="button" class="close" data-dismiss="modal">×</button>' +
 //        '  <h4 class="modal-title">Modal Header</h4>' +
 //      '  </div>' +
 //    '    <div class="modal-body">' +
 //     '     <p>Some text in the modal.</p>' +
 //    '    </div>' +
 //    '    <div class="modal-footer">' +
 //    '      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
 //     '   </div>' +
 //    '  </div>' +
      
 //   ' </div>' +
 //  '</div>')
	// 	/* Act on the event */
	// });

	$('#command_AddSite').click(function(event) {
		$('#model_SiteTable').append('<tr class="model_SiteTable_Cell_dormant"><td class="model_SiteTable_URL">Unconfigured</td><td>Example</td></tr>')
	});


	$('#model_SiteTable').on('dblclick', "tr.model_SiteTable_Cell_dormant",function(event) {
		
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

	$('#model_SiteTable').on('mouseenter',"tr",function(event) {
		console.log("I am the burning man")
	});

});



