// APIKey = "04f50896a4e31a98e332740a88e3546c";

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
    addInputLocalStorage ();
    getInput();
    
};
// showing current weather conditions for the city

function getInput(){
    $(".five-day-forecast").empty();
    $(".city-name").empty();

    cityInput = $("#cityInput").val();
    var cityCode = cityInput;
    // var countryCode = "US";
    console.log(cityCode);
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
    
    

    $(".city-name").addClass("wather-container")
    $(".city-name").append(icon)    
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
           weatherIcon = data.weather[0].icon;
            
            img = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            icon.attr('src',img)
        
            cityName.text(cityCode);

            var date = new Date(data.dt * 1000);
            console.log (date)
            dateTime.text("("+ (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            wind.text("Wind Speed: " + data.wind.speed + " MPH");
            temperature.text("Temperature: "+ data.main.temp + " F");
            humidity.text("Humidity: " + data.main.humidity + " %");


            //display 5 day forecast

            var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude +'&lon='+longitude+ '&appid=04f50896a4e31a98e332740a88e3546c';

            fetch(forecastURL)
            .then (function(response){
                return response.json();
            })
            .then (function(data){
                console.log(data.list);
                 // for loop that uses every 8th data point 
                for (var i = 0; i<data.list.length; i+=8){
                    
                    var forecastDate = $("<div>");
                    var forecastIcon=$("<img>");
                    var windForecast=$("<div>"); 
                    var tempForecast =$("<div>"); 
                    var humidityForecast=$("<div>");
                    var oneDayWrapper = $("<div>");
                    windForecast.text("Wind Speed: " + data.list[i].wind.speed + " mph");
                    tempForecast.text("Temperature: "+ data.list[i].main.temp + " F");
                    console.log(data.list[i].main.temp);
                    humidityForecast.text("Humidity: " + data.list[i].main.humidity + " %");
                    var newdate = new Date(data.list[i].dt * 1000);
                   
                    forecastDate.text("("+ (newdate.getMonth()+1) + "/" + newdate.getDate() + "/" + newdate.getFullYear() + ")");
                    
                    newIcon = data.list[i].weather[0].icon;
                    var forecastIconUrl;
                    forecastIconUrl = "https://openweathermap.org/img/wn/" + newIcon + ".png";
                    forecastIcon.attr('src',forecastIconUrl);

                    oneDayWrapper.append(windForecast);
                    oneDayWrapper.append(tempForecast);
                    oneDayWrapper.append(humidityForecast);
                    oneDayWrapper.append(forecastIcon);
                    oneDayWrapper.append(forecastDate);
                    $(".five-day-forecast").append(oneDayWrapper);
    
                
                }
            });
           

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
function addInputLocalStorage () {
    
    cityList = getData();
    
    if (!cityList.includes(cityInput)){
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
