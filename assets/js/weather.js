var searchBtn = document.querySelector('.search');
var displayDate = document.getElementById('displayDate');
var temp = document.getElementById('temp');
var windSpeed = document.getElementById('windSpeed');
var humidity = document.getElementById('humidity');
var uvIndex = document.getElementById('uvIndex');
var pastSearches = document.getElementById('past-searches');
var inputValue = document.getElementById('inputValue').value;
var pastCity = document.createElement("btn");


var cities = [];

searchBtn.addEventListener('click', function (e) {
    e.preventDefault()
    var inputValue = document.getElementById('inputValue').value;
    fiveDay(inputValue);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue + '&units=imperial&APPID=f9d491be2c04cabd7a30f6d0ce1b0f1e')
        .then(response => response.json())
        .then(data => {
            var date = moment().format("MMMM Do YYYY, h:mm a");
            displayDate.innerText = inputValue + " " + "(" + date + ")";
            img.setAttribute("src", `https://openweathermap.org/img/wn/${data['weather'][0]['icon']}@2x.png`);;
            var tempValue = data['main']['temp'] + " degrees";
            temp.innerText = "Temp: " + tempValue;
            windSpeed.innerText = "Wind: " + data['wind']['speed'] + " MPH";
            humidity.innerText = "Humidity: " + data['main']['humidity'] + "%";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            displayUvIndex(lat, lon);

            cities.push(inputValue);
            var pastCity = document.createElement("btn");
            pastCity.textContent = inputValue;
            pastCity.classList = 'past search button';
            pastCity.setAttribute("type", "submit");
            pastSearches.appendChild(pastCity);
            var br = document.createElement("br");
            pastSearches.appendChild(br);
            console.log(pastCity.textContent);
            pastCity.addEventListener('click', history(pastCity.textContent));
        })
});

function history() {
    inputValue = pastCity.textContent
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue + '&units=imperial&APPID=f9d491be2c04cabd7a30f6d0ce1b0f1e')
        .then(response => response.json())
        .then(data => {
            var date = moment().format("MMMM Do YYYY, h:mm a");
            displayDate.innerText = inputValue + " " + "(" + date + ")";
            img.setAttribute("src", `https://openweathermap.org/img/wn/${data['weather'][0]['icon']}@2x.png`);;
            var tempValue = data['main']['temp'] + " degrees";
            temp.innerText = "Temp: " + tempValue;
            windSpeed.innerText = "Wind: " + data['wind']['speed'] + " MPH";
            humidity.innerText = "Humidity: " + data['main']['humidity'] + "%";
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            displayUvIndex(lat, lon);
        });
};

function displayUvIndex(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&APPID=f9d491be2c04cabd7a30f6d0ce1b0f1e")
        .then(response => response.json())
        .then(data => {
            uvIndex.innerText = 'UV Index: ' + data['current']['uvi'];

        }).
        catch(err => alert('Error' + err))

}

function fiveDay(city) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&APPID=f9d491be2c04cabd7a30f6d0ce1b0f1e')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            var forecast = data.list;
            // console.log(forecast)
            var HTMLText = ""
            for (let i = 0; i < forecast.length; i += 8) {

                let date = forecast[i].dt_txt;
                year = date.slice(0, 4);
                date = date.slice(0, -9).substring(5).replace('-', '/').concat('/', year);

                HTMLText += `<div class="card col-2">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${forecast[i]['weather'][0]['icon']}@2x.png"/>
                <p>Temp: ${forecast[i].main.temp} degrees</p>
                <p>Wind speed: ${forecast[i].wind.speed} MPH</p>
                <p>Humidity: ${forecast[i].main.humidity}%</p>
                </div>`
            }
            document.querySelector("#five-day").innerHTML = HTMLText
        })
}


searchBtn.addEventListener('click', fiveDay())
pastCity.addEventListener('click', history(pastCity.textContent));
