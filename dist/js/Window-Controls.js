// $(document).ready(function() {
// 	console.log("Window-Control Handlers loaded.");

// // Load native UI library
// var gui = require('nw.gui'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)

// // Get the current window
// var win = gui.Window.get();


	
// 	We have 4 window controls:

// 		1.	Minimize 	"minimize"
// 		2.	Maximize 	"maximize"
// 		3.	Fullscreen 	"fullscreen"
// 		4. 	Close		"close"
		
// 		$('#minimize').click(function(event) {
// 			console.log("minimize")
// 			win.minimize();
// 		});

// 		$('#maximize').click(function(event) {
// 			console.log("maximize")
// 			win.maximize();
// 		});

// 		$('#fullscreen').click(function(event) {
// 			console.log("fullscreen")
// 			win.maximize();

			
// 		});


// 		$('#close').click(function(event) {
// 			console.log("close")
// 			win.close();
// 		});
// 	});