		var fs = require('fs');
		var path = require('path')

		$(document).ready(function() {

			$("#export-dummy").on('change', '', function(event) {
				
				var dest = $(this).val()
				if (path.extname(dest) != ".mhStocks" )
					dest = dest + ".mhStocks";

				var exported = getSelectedFromTable('#table-export-stocks');

				fs.writeFileSync(dest, JSON.stringify(exported) )
			});

			$("#export-button").on('click', '', function(event) {
				$("#export-dummy").click();
				/* Act on the event */
			});

			$("#export-dummy-urls").on('change', '', function(event) {
				var dest = $(this).val()
				if (path.extname(dest) != ".mhUrls" )
					dest = dest + ".mhUrls";
				var exported = getSelectedFromTable('#table-export-urls');

				fs.writeFileSync(dest, JSON.stringify(exported) )
			});

			$("#export-button-urls").on('click', '', function(event) {
				$("#export-dummy-urls").click();
				/* Act on the event */
			});

			$("#import-button").on('click', '', function(event) {
				$("#import-dummy").click();
				/* Act on the event */
			});

			$("#import-dummy").on('change', '', function(event) {
				
				if (path.extname($(this).val()) != ".mhUrls" && path.extname($(this).val()) != ".mhStocks")
					MHAlertLittle("File I/O Error","File was unable to be read.",function() {})
				var imported = JSON.parse( fs.readFileSync($(this).val(), 'utf8' ) )
				bindTableData("#table-import",imported)
				$('#approve-import-button').removeClass('disabled')
			});


			$("#approve-import-button").on('click', '', function(event) {

				var dest = $('#import-dummy').val()
				var config = getConfiguration();
				var sel = getSelectedFromTable('#table-import')
				
				if (path.extname(dest) == ".mhUrls")
				{
					for (var x = 0; x < sel.length; x++) {
						var el = sel[x];
						var i = config.sites.indexOf(el);
						if (i > -1){
							continue;							
						}

						else
						{
							config.sites.push(el)
							bindTableData("#table-export-stocks",getConfiguration().sites);
						}
					};
					setConfiguration(config);
					config = getConfiguration();
				}
				if (path.extname(dest) == ".mhStocks"  )
				{

					for (var x = 0; x < sel.length; x++) {
						var el = sel[x];
						var i = checkDuplicates(config.saved_stocks,el);
						if (i > -1){

							MHAlert ("Duplicate Found",
								capitalizeFirstLetter(el.name)+" is a Stock already saved within the app. Press Continue to overwrite.",
								"Overwrite",
								"Skip",
								function() {
								 config.saved_stocks[i] = el
								 setConfiguration(config);
								 bindTableData("#table-export-stocks",getConfiguration().saved_stocks);
								 
								},
								function() {});
							
						}

						else
						{
							config.saved_stocks.push(el)
							bindTableData("#table-export-stocks",getConfiguration().saved_stocks);
						}
					};
					setConfiguration(config);
					config = getConfiguration();
			
				}

				console.log("hello from the end");

			});

			
			bindTableData("#table-export-stocks",getConfiguration().saved_stocks);
			bindTableData("#table-export-urls",getConfiguration().sites);


	});



