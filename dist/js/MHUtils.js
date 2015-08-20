
/**
 * Render a modal with a specified title and message.
 * @param [String] {title} The Title of the modal message.
 * @param [String] {error_message}	The message of the modal message.
 * @param [String] {continue_text}	The text of the continue button
 * @param [String] {cancel_text}	The text of the cancel button.
 * @param {[Function]}	The Function that will be called if the continue button is clicked.
 * @param {[Function]}	The Function that will be called if the cancel button is clicked.
 */

function MHAlert (title,error_message,continue_text,cancel_text,continue_callback,cancel_callback) {
	$('#Alert_Modal .modal-title').html(title);
	$('#Alert_Modal .modal-body').html(error_message);
	$('#Alert_Modal').modal('show');

	$('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-primary').click(function(event) {
		console.log("Continue!")
		continue_callback();
	});

	$('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-default').click(function(event) {
		console.log("Cancel!")
		cancel_callback();
	});
}

