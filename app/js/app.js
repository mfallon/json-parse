console.log("JS loaded");
/**
 * Simple JSON Request 
 * 
 * @author: 	markfallondub@gmail.com
 * @date:		31/10/2015
 *
 */

// Declare global vars to handle this request
var url = "http://rocky-brushlands-8739.herokuapp.com/rates";
var url = "http://api.openweathermap.org/data/2.5/forecast?q=";
var loc = ['Dublin', 'IE'];
var apiKey = "5fc90572a995cd56331458f4507e4242";
var response = "";
var error = "";
var requestObj = null;

// Handle Browsers older than IE7
if(window.XMLHttpRequest) {
	requestObj = new XMLHttpRequest();	
} else if (window.ActiveXObject) {
	requestObj = new ActiveXObject("Microsoft.XMLHTTP");
}

/**
 * Function
 * @param printable - the parsed JSON object as array of objects
 * @param sort (object) - expects object with sorting params
 */
var printResponse = function(printable, sort) {
	var _sort = sort || {};
	// if provided with a valid sort object, use it
	if (sort.hasOwnProperty('key') && printable.hasOwnProperty(_sort.key)) {
		printable.sort(sortBy(sortParams));
	}
	for(line in printable) {
		if(printable.hasOwnProperty(line)) {
			// TODO: output to table
			console.log(printable[line]);
		}
	}
};

/**
 * Function
 * @param params (object) - sort parameters with key and direction of sort
 * returns (function) - indicates which is the bigger in a comparison
 */
var sortBy = function(params) {
	return function(a,b) {
		if(!a.hasOwnProperty(params.key) || a[params.key] == b[params.key]) {
			return 0;
		}
		return params.direction ? +(a[params.key] > b[params.key]) : +(a[params.key] < b[params.key]);
	}	
};

// Only proceed if we have a valid HTTPRequest object
if(requestObj) {
	requestObj.onreadystatechange = function() {
		if(requestObj.readyState = XMLHttpRequest.DONE) {
			if(requestObj.status == 200) {
				response = JSON.parse(requestObj.responseText);
				// TODO: would rather watch response from elsewhere
				print(response);
			} else {
				error = "Error: " + requestObj.status;
			}
		}
	}
}

// Now make request using default params
requestObj.open("GET", url + loc.join(',') + "&APPID=" + apiKey, true);
requestObj.send();

