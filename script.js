// var APIKey = "2c31d1b4f04a9808197b6b9242d8d05a";

// adding input to the list of previously searched cities 
function addInput(){
    cityInput = $("#cityInput").val();
    cityList = getData();
    var lastCity = $("<div>");
    lastCity.attr('id',cityInput);
    lastCity.text(cityInput);
    lastCity.addClass("h4");

    if (!cityList.includes(cityInput)){
        $(".prev-searched-cities").append(lastCity)
    }
    $(".card-subtitle").attr("style","display:inline")
    addData(cityInput);
};
// event listener for previously searched city
$(".prev-searched-cities").on('click', function(event){
    event.preventDefault();
    $(".card-subtitle").attr("style","display:inline")
     $("#cityInput").val() =  event.target.id;
    getInput(); 
});


// showing current weather conditions for the city

function getInput(){
    $(".five-day-forecast").empty();
    $(".city-name").empty();

    cityInput = $("#cityInput").val();
    var cityCode = cityInput;
    var countryCode = "US";
    
    var longitude;
    var latitude;

    var dateTime = $("<div>")
    var icon =$("<img>")
    icon.addClass("icon");    
    var cityName =$("<h>")    
    cityName.addClass("h3")  
    var wind = $("<div>")    
    var temperature = $("<div>")    
    var humidity = $("<div>")   
    var uvIndex = $("<div>")  

    $(".city-name").addClass("wather-container")
    $(".city-name").append(icon)    
    $(".city-name").append(uvIndex)
    $(".city-name").append(wind)    
    $(".city-name").append(temperature)    
    $(".city-name").append(humidity)    
    $(".city-name").append(cityName)    
    $(".city-name").append(dateTime)   
    
    var geoLink = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityCode + "&limit=5&appid=04f50896a4e31a98e332740a88e3546c"
    // using fetch method, convert response into json and return
    fetch(geoLink)
    .then(function(response){
        return response.json();
    })
    .then (function(data){
        longitude = data[0].lon;
        latitude = data[0].lat;

        // fetching current wather
        var theUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + "&lon="+ longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=04f50896a4e31a98e332740a88e3546c";

        fetch(theUrl)
        .then (function(response){
            return response.json();
        })
        .then (function(data){
            console.log(data)
            weatherIcon= data.current.weather[0].icon;

            img = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            icon.attr('src',img)
        
            cityName.text(cityCode);

            var date = new Date(data.current.dt * 1000);
            dateTime.text("("+ (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            wind.text("Wind Speed: " + data.current.wind_speed + " MPH");
            temperature.text("Temperature: "+ data.current.temp + " F");
            humidity.text("Humidity: " + data.current.humidity + " %");

            // handle UV index
            var uvi =$("<div>")
            uvIndex.addClass("d-flex")
            uvIndex.text("UV Index: ");
            uvi.text(data.current.uvi)
            uvIndex.append(uvi)

            //display 5 day forecast

            for (var i = 1; i<6; i++){
            var divContainer = $("<div>")
            this["futureHumidity"+i] = $("<div>")
            this["futureTemp"+i] = $("<div>")
            this["futureWind"+i] = $("<div>")
            this["futureIcon"+i] = $("<img>")
            this["futureDate"+i] = $("<h>")
            // convert to date
            this["forecastDay"+i] = new Date(data.daily[i].dt * 1000); 
            
            
            (this["futureDate"+i]).text(((this["forecastDay"+i]).getMonth()+1) + "/" + (this["forecastDay"+i]).getDate() + "/" + (this["forecastDay"+i]).getFullYear());
            (this["futureTemp"+i]).text("Temperature: "+ data.daily[i].temp.day + " F");
            (this["futureWind"+i]).text("Wind: "+ data.daily[i].wind_speed+ " MPH");
            (this["futureHumidity"+i]).text("Humidity: " + data.daily[i].humidity + " %");
            (this["weatherIcon"+i])= data.daily[i].weather[0].icon;

            Dateimg = "https://openweathermap.org/img/wn/" + (this["weatherIcon"+i]) + ".png";  
                (this["futureIcon"+i]).attr('src',DateimgSrc)

                $(".five-day-forecast").append(divContainer)
                divContainer.addClass("weather")
                divContainer.append((this["futureDate"+i]));
                divContainer.append((this["futureIcon"+i]));
                divContainer.append((this["futureTemp"+i]));
                divContainer.append((this["futureWind"+i]));
                divContainer.append((this["futureHumidity"+i]));

            }

        })
    })
}
// get data from local storage
function getData(){
    var currentList =localStorage.getItem("city");
    if (!currentList){
        console.log(currentList);
        newList = JSON.parse(currentList);

        console.log(newList)
        return newList;
    } else {
        newList = [];
    }
    console.log(newList)
    return newList;

}

//set data to local storage
function addInput () {
    var addedItems = getInput();
    cityList = getData();
    
    if (cityList.includes(cityInput) === false){
        cityList.push(cityInput);
    }
   
    localStorage.setItem("city", JSON.stringify(cityList));
};

//render city list
function renderCityList () {
    var cityList = getData();
    for (var i = 0; i < cityList.length; i++) {
        var cityInput = cityList[i];
        var lastCity =$("<div>") 
        lastCity.text(cityInput) 
        lastCity.addClass("h4")
        lastCity.attr('id',cityInput) 

        $(".prev-searched-cities").append(lastCity)
    }
};

renderCityList();

// event listener for search button
$("#searchButton").on('click', addInput);
$("#searchButton").on('click', getInput);