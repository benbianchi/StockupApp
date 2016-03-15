var tables = [];
var file = undefined;
var dirty = true;
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
  $('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-primary').text(continue_text);

	$('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-primary').click(function(event) {
		console.log("Continue!")
  $('#Alert_Modal').modal('hide');
		continue_callback();
	});

  $('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-default').text(cancel_text);

	$('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-default').click(function(event) {
		console.log("Cancel!")
    $('#Alert_Modal').modal('hide');
		cancel_callback();
	});
}

function MHAlertLittle (title,error_message,continue_callback) {
  $('#Alert_Modal .modal-title').html(title);
  $('#Alert_Modal .modal-body').html(error_message);
  $('#Alert_Modal').modal('show');

  $('#Alert_Modal > div > div > div.modal-footer > button.btn.btn-primary').click(function(event) {
    console.log("Continue!")
    continue_callback();
  });


}

/**
 * @getConfiguration()  get the contents of AppInfo.json, the file that houses settings, stocks, and sites. In an effort to save file processing, if you want an updated version, make sure to set 'dirty' to true.
 * @return {Object}
 */
function getConfiguration () {
  //What we are going to do here is have  function that loads the AppInfo file, and returns it if it hasnt been changed.
  if (file == undefined || dirty == true)
      {
        var fs = require('fs');
        dirty = false;
        file = JSON.parse( fs.readFileSync("AppInfo.json",'utf8') );
        console.log("Fetched File.");
        return file
      } 
    else
    {
      console.log("Deferred to in-memory variable.");
      return file;
    }
}

/**
 * @method setConfiguration
 * @param {Object} conf The Configuration you want to save to AppInfo.json
 */

function setConfiguration (conf) {
  //What we are going to do here is have  function that loads the AppInfo file, and returns it if it hasnt been changed.

        var fs = require('fs');
        dirty = true;
        fs.writeFileSync("AppInfo.json",JSON.stringify(conf) );
        console.log("Wrote to File.");
        console.log(conf);
        return true;

}



function bindTableData(tablequerystring,data)
{
	//First we must elaborate events on this table.
  //A checkbox is checked.
  //A checkbox is unchecked.
  //saved_stocks = [{}]
  if (data == undefined || data == null || data.length == 0)
  {
    console.log("Empty Data");
    return false;
  }
  $(tablequerystring).children().remove();   //Clean the table.
  table = $(tablequerystring)

  var thead = $("<thead>") //Use jquery to create a thead element, we will add to this element later.
  table.append($("<tbody>"))//Use jquery to create a table's body element.
  table.append(thead); // Attach thead to the table we are binding data to.

  thead.append( $("<tr></tr>") );
  var checkboxMarkAll = $("<th><input class='mark-all-checkbox' type='checkbox'> Mark All</th>")


  thead.children('tr').append(checkboxMarkAll);

  for (var i = 0; i < Object.keys(data[0]).length; i++) { //Attach all object's keys as th tags. This makes the columns look nice. In addition, we want to have the first column header be a control box that allows users to quickly add all entries to export/import lists.
  
  thead.children('tr').append('<th>'+capitalizeFirstLetter(Object.keys(data[0])[i])+'</th>' ) 
  };
  $(tablequerystring).append(thead);

  


  for (var i = 0; i < data.length; i++) { //Populate each row with incrementing entries, and finally attach these rows to tbody
    
    var curRow = $("<tr data-index='"+i+"'></tr>");

    curRow.append ( $("<td><input class='rowCheckBox' type='checkbox'></td>"))
    for (var j = 0; j < Object.keys(data[0]).length; j++) {
      curRow.append($('<td>'+data[i][Object.keys(data[i])[j]]+'</td>') )
    
    };
    table.children('tbody').append(curRow);
    
  };

    checkboxMarkAll.children('input').bind('change', function(event) {  //Set an event listener that will set all checkboxes to true or false, depending on the checkbox in the thead.

    if (!$(this).attr('checked') ) 
    {
      $('.rowCheckBox',tablequerystring+' tbody tr').each(function(index, el) {
        el.checked = true;
        
      });
        $(this).attr('checked', true);
        for (var i = 0; i < table.children('input').length; i++) {
          table.children('tbody tr input').prop('checked', true);
        };
    }
      else
      {
        $('.rowCheckBox',tablequerystring+' tbody tr').each(function(index, el) {
        el.checked = false;
        
      });
        $(this).attr('checked', false);
      }
  });

 

  
}
/**
 * @method getSelectedFromTable Get all selected entries from the table.
 * @param {String} tableqstring the query selector for the table you are searching.
 */

  function getSelectedFromTable (tableqstring) {
    var output =[];
    var rows = $(tableqstring+ " tbody tr")


    for (var i = 0; i < rows.length; i++) 
      {
          var obj = {};

        if (rows[i].children[0].children[0].checked == true)
          {

            for (var j =1 ; j < $(tableqstring+' thead tr th').length; j++) {

              obj[$(tableqstring+' thead tr th')[j].innerText.toLowerCase()] = rows[i].children[j].innerText
            };
            
            output.push(obj);
          }


      }
    
    return output;

  }


function capitalizeFirstLetter (s) {
  return s[0].toUpperCase() + s.slice(1);  
}

function checkDuplicates (source,obj) {

  var key = Object.keys(source[0])[0];

   for (var i = 0; i < source.length; i++) {
    console.log(obj[key], source[i][key], i);
     if (obj[key] == source[i][key])
      return i;
   }
   return -1;
}