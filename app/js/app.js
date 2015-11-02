/**
 * Simple JSON Request using OpenWeatherMap.org
 * 
 * @author: 	markfallondub@gmail.com
 * @date:	31/10/2015
 *
 */

// Data Source - Open Weather Map
var owmUriForecast = "http://api.openweathermap.org/data/2.5/forecast/daily";
var owmUriFind = "http://api.openweathermap.org/data/2.5/find";
var apiKey = "5fc90572a995cd56331458f4507e4242";


/**
 * Function convertDecimal
 * @param value (string) - the float to convert to celesius
 * returns (float) - rounded 1 dec place
 */
var convertDecimal = function(value) {
    // convert to number
    value = +value;
    // If the value is not a number
    if (isNaN(value)) {
        return 0;
    }
    
    return Math.round(value*10)/10;
};

/**
 * Function convertTimeStamp
 * @param timestamp (string) - unix timestamp format
 * returns (string) - date string formatted
 */
var convertTimeStamp = function(timestamp) {
    var date = new Date(+timestamp * 1000);
    var day = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
    return day[date.getDay()] + " " + date.getDate() + "<sup>" + getOrdinalSuffixOf(date.getDate()) + "</sup>";
};

/**
 * Function getOrdinalSuffixOf
 * @param value (int) - a day integer to return an ordinal suffix from
 * returns (string)
 */
function getOrdinalSuffixOf(value) {
    var j = value % 10,
        k = value % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

// Polyfill for IE 8 as forEach function not supported yet below IE 9
if (typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function(callback){
      for (var i = 0; i < this.length; i++){
        callback.apply(this, [this[i], i, this]);
      }
    };
}

/**
 * What to do when the user clicks submit
 */
$('.submit').click(function(){
    // get city from input field
    var city = $('.city_names').val();

    var dailyWeather = [];

    // Query OpenWeatherMap for results
    $.ajax({
        url: owmUriForecast,

        // name of the callback parameter
        jsonp: "callback",

        // expecting JSONP
        dataType: "jsonp",

        // data we want
        data: {
            q: city,
            units:"metric",
            mode: "json",
            cnt: "5",
            appid: apiKey
        },

        // Process response
        success: function( response ) {
            if(response.hasOwnProperty('list') && response.list.length > 0) {
                response.list.forEach(function(element,index,array){
                    var convertedTimeStamp = new Date(element.dt);
                    // Generate weather blocks
                    $("#weatherResults > .styled").append(
                            "<div class='block'>" +
                                convertDecimal(element.temp.day) +
                                "&#8451<span>" +
                                element.weather[0].description +
                                    "<span>" +
                                    convertTimeStamp(element.dt) +
                                    "</span>" +
                                "</span>" +
                            "</div>"
                    );
                });
            }
        }
    });
});

/**
 * What to do when the document loads
 *  - Initialise autocomplete on input field
 */
$(document).ready(function(){
    // assign pretty picture to background using backstrech plugin
    $.backstretch('img/scenic.jpg');
    // Bind autocomplete to input field
    $( ".city_names" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: owmUriFind,
                dataType: "jsonp",
                data: {
                    q: request.term,
                    mode: "json",
                    appid: apiKey
                },
                success: function( data ) {
                    

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



