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
					$.each(sel,function(index, el) {
						var i = checkDuplicates(config.sites,el);
						if (i > -1)
							MHAlert ("Duplicate Found",
								capitalizeFirstLetter(el.url)+" is a URL already saved within the app. Press Continue to overwrite.",
								"Overwrite",
								"Skip",
								function() { config.sites[i] = el},
								function() {});
						else
							config.sites.push(el)
					});
					bindTableData("#table-export-urls",getConfiguration().sites);
				}
				if (path.extname(dest) == ".mhStocks"  )
				{
					console.log("Dealing with Stocks here");
					$.each(sel,function(index, el) {
						var i = checkDuplicates(config.saved_stocks,el);
						if (i > -1)
							MHAlert ("Duplicate Found",
								el.name+" is a stock already saved within the app. Press Continue to overwrite.",
								"Overwrite",
								"Skip",
								function() { config.saved_stocks[i] = el},
								function() {});
						else
							config.saved_stocks.push(el)
					});
					bindTableData("#table-export-stocks",getConfiguration().saved_stocks);
				}
				dirty = true;

				console.log(sel);



				setConfiguration(config);
			});

			
			bindTableData("#table-export-stocks",getConfiguration().saved_stocks);
			bindTableData("#table-export-urls",getConfiguration().sites);


	});



