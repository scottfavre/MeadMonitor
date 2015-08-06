var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {	
	var CONSTANTS = {
          TEMPERATURE_FAMILY: 0x28,
          CONVERT_TEMPERATURE_COMMAND: 0x44,
          READ_SCRATCHPAD_COMMAND: 0xBE,
          READ_COUNT: 2
        };

	var getAddress = function (device) {
		// 64-bit device code
		// device[0]    => Family Code
		// device[1..6] => Serial Number (device[1] is LSB)
		// device[7]    => CRC
		var i, result = 0;
		for (i = 6; i > 0; i--) {
            result = result * 256 + device[i];
		}
		return result;
	};


	board.io.sendOneWireConfig(7, true);
    board.io.sendOneWireSearch(7, function (err, devices) {
		var d = devices.filter(function (device) {
			return device[0] === CONSTANTS.TEMPERATURE_FAMILY;
		}, this);

		d.forEach(function (device) {
			var address = getAddress(device);
            console.log('Connecting to device: ' + address);
			
			var temperature = new five.Temperature({
				controller: "DS18B20",
				pin: 7,
				freq: 1000,
				address: address
			});
			
			temperature.on("data", function(err, data) {
				console.log("==============0x" + this.address.toString(16));
				console.log("celsius: %d", data.celsius);
			    console.log("fahrenheit: %d", data.fahrenheit);
			    console.log("kelvin: %d", data.kelvin);
			});			
		}.bind(this));
	});


	var led = new five.Led(13);
	led.blink(250);
});

