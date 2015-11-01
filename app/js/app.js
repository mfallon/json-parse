/**
 * Simple JSON Request using OpenWeatherMap.org
 * 
 * @author: 	markfallondub@gmail.com
 * @date:		31/10/2015
 *
 */

// Declare global vars to handle this request
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
/*
// Only proceed if we have a valid HTTPRequest object
if(requestObj) {
    requestObj.onreadystatechange = function() {
        if(requestObj.readyState = XMLHttpRequest.DONE) {
            if(requestObj.status == 200) {
                response = JSON.parse(requestObj.responseText);
                // TODO: would rather watch response from elsewhere
                printResponse(response);
            } else {
                error = "Error: " + requestObj.status;
            }
        }
    }
}

// Now make request using default params
requestObj.open("GET", url + loc.join(',') + "&APPID=" + apiKey, true);
requestObj.send();

*/

var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();

//console.log("hour: "+hour+" minute: "+min);

if(hour<5){
      $(function() {
//    			   var BV = new $.BigVideo();
//    			   BV.init();
//    			   BV.show(['night.mp4'],{ambient:true});
      });
  }else if(hour<16){
           $(function() {
//    			   var BV = new $.BigVideo();
//    			   BV.init();
//    			   BV.show(['daylight.mp4'],{ambient:true});
      });
  }else if(hour<19){
           $(function() {
//    			   var BV = new $.BigVideo();
//    			   BV.init();
//    			   BV.show(['evening.mp4'],{ambient:true});
      });
  }else{
           $(function() {
//    			   var BV = new $.BigVideo();
//    			   BV.init();
//    			   BV.show(['night.mp4'],{ambient:true});
      });
 }

$('.submit').click(function(){
	
	var city = $('.city_names').val();
	//console.log(city);
	$.ajax({
	    url: "http://api.openweathermap.org/data/2.5/find",
	 
	    // name of the callback parameter
	    jsonp: "callback",
	 
	    // tell jQuery we're expecting JSONP
	    dataType: "jsonp",
	 
	    //what we want
	    data: {
	        q: city,
	        units:"metric",
	        mode: "json",
                appid: apiKey
	    },
	 
	    // work with the response
	    success: function( response ) { 
	    	  
	    	
             var temp = response.list[0].main.temp;
             
             if(temp<25 ){
            	 $('.message').html("it's feels cold, get a jacket");
             }else if(temp<35){
            	 $('.message').html("it's feels normal"); 
             }else if(temp<50){
            	 $('.message').html("it's feels hot, switch on your AC");
             }

	    	 	$('.city').html(response.list[0].name);
	    	 	$('.country').html('( </span><span>'+response.list[0].sys.country+'</span><span> )');
	    	 	$('.temp').html('<span>'+response.list[0].main.temp+'</span><span class="t">* C</span>');
	    		
	        
	    }
	});
});

$(document).ready(function(){
    $( ".city_names" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/find",
                dataType: "jsonp",
                data: {
                        q: request.term,
                        mode: "json",
                        appid: apiKey
                },
                success: function( data ) {
                        // Fix for IE 8 as forEach function not supported yet below IE 9
                        if (typeof Array.prototype.forEach != 'function') {
                            Array.prototype.forEach = function(callback){
                              for (var i = 0; i < this.length; i++){
                                callback.apply(this, [this[i], i, this]);
                              }
                            };
                        }

                        var parsed = data.list;
                        var newArray = new Array(parsed.length);
                        var i = 0;
                          parsed.forEach(function (entry) {
            var newObject = {
                label: entry.name+" "+entry.sys.country
            };
            newArray[i] = newObject;
            i++;
        });

                          response(newArray);
                },
                error: function (message) {
            response([]);
        }
            });
        },
        minLength: 2,
        open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });
	
});



