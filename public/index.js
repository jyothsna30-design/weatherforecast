const dropdown = document.getElementById("dropdown");
const storageKey = "searchedCities";
const inputbutton = document.getElementById("inputbutton");
const city = document.getElementById("city");
//storing city values 
function saveCity() {
  const value = city.value.trim();
  if (!value) return;

  let cities = localStorage.getItem(storageKey);
  let arr = cities ? cities.split(",").filter(Boolean) : [];

  
  if (!arr.some(city => city.toLowerCase() === value.toLowerCase())) {
    arr.push(value);
    localStorage.setItem(storageKey, arr.join(","));
  }

  city.value = "";
  dropdown.style.display = "none";
}

//displaying dropdown
function showDropdown(arr) {
  dropdown.innerHTML = "";
// if arr is null then no display dropdown 
  if (arr.length === 0) {
    dropdown.style.display = "none";
    return;
  }
// display the names of searched cities
  arr.forEach(citys => {
    const div = document.createElement("div");
    div.textContent = citys;
    div.addEventListener("click", () => {
      city.value = citys;
      dropdown.style.display = "none";
    });
    dropdown.appendChild(div);
  });

  dropdown.style.display = "block";
}

//on input, getting the array of cities and send it to display dropdown
city.addEventListener("input", () => {
  const query = city.value.trim().toLowerCase();
  let cities = localStorage.getItem(storageKey);
  let arr = cities ? cities.split(",").filter(Boolean) : [];

  const matches = query
    ? arr.filter(city => city.toLowerCase().includes(query))
    : arr;

  showDropdown(matches);
});

//on focus, getting the array and calling display dropdown
city.addEventListener("focus", () => {
  let cities = localStorage.getItem(storageKey);
  let arr = cities ? cities.split(",").filter(Boolean) : [];

  showDropdown(arr);
});


//if clicked outside the search box or on the document dropdown gets hidden
document.addEventListener("click", (e) => {
  if (e.target !== city && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});
localStorage.clear();

//clicking on search button,calls fetch api
inputbutton.addEventListener("click",function showData(){
  
  //input validation
    if(!(/^[A-Za-z]+$/.test(city.value)) || city.value ==""){
        alert("Enter correct city name");
        return;
    }
    const citys=city.value;
   
    const url= `https://api.openweathermap.org/data/2.5/weather?q=${citys}&APPID=02cee0609024e20db19067082c030dce&units=metric`;
    const forecaturl = `https://api.openweathermap.org/data/2.5/forecast?q=${citys}&APPID=02cee0609024e20db19067082c030dce&units=metric`;
    
    fetch(url).then(response=>response.json()).then(response=> {displayWeather(response)}).catch(error=>{displayError(error)});
    fetch(forecaturl).then(response=>response.json()).then(response=> {forecastWeather(response)}).catch(error=>{displayError(error)});
    
  })
//Error message
function displayError(error){
   const changetemp = document.getElementById("changetemp");
  changetemp.innerHTML = "";
  changetemp.style.display="none";
    const err = document.getElementById("errordiv");
    err.innerHTML = `<p class="text-white text-center text-2xl">${error}</p><img class="m-50" src="error.jpg" width="100%" height="100%" alt="invalid url">`;
 
}

//getting info using location
function clicked(){
  if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
      const lourl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=02cee0609024e20db19067082c030dce&units=metric`;
      const fourl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=02cee0609024e20db19067082c030dce&units=metric`;
      fetch(lourl).then(response=>response.json()).then(response=> {displayWeather(response)}).catch(error=>{displayError(error)});
     fetch(fourl).then(response=>response.json()).then(response=> {forecastWeather(response)}).catch(error=>{displayError(error)});   
    })
      }
        else{ 
          const weatherinfo = document.getElementById("weatherinfo");
                weatherinfo.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
        }

}

//displaying weather info
function displayWeather(response){
    const temp = document.getElementById("tempinfo");
    const weatherinfo = document.getElementById("weatherinfo");
    const weathericon = document.getElementById("weathericon");
    const hum = document.getElementById("humidity");
    const wi =document.getElementById("wind");
    temp.innerHTML="";
    weatherinfo.innerHTML="";
    weathericon.innerHTML="";
    weathericon.src="";
     weathericon.alt="";
    hum.innerHTML="";
    wi.innerHTML="";
   
    //not correct city
    if(response.cod === "404"){
            const changetemp = document.getElementById("changetemp");
            changetemp.innerHTML = "";
            changetemp.style.display="none";
             weatherinfo.innerHTML=`<p class="text-3xl text-center">${response.message}</p><img src="err.png" alt="not found" class="w-50 h-50"> `;
    }
    else{
        const cityName= response.name;
        saveCity(cityName);
        console.log(response.main.temp);
        const temperature =Math.round(response.main.temp);
        setTemp(temperature);//calling temperature change
        const des= response.weather[0].description;
        //changing background images
        if(des.includes("clear sky")){
          document.body.style.backgroundImage = "url('/public/sunny.gif')";
        }
        else if(des.includes("clouds")){
          document.body.style.backgroundImage = "url('/public/cloudy.jpg')";
        }
        else if(des.includes("rain")){
          document.body.style.backgroundImage = "url('/public/rainy.gif')";
        }

        const humidity= response.main.humidity;
        const wind =response.wind.speed;
        const iconcode= response.weather[0].icon;
        const iconurl = `https://openweathermap.org/img/wn/${iconcode}@4x.png`;
        const todaydate= response.dt;
        const date= new Date(todaydate * 1000);

       //alert if temp is greater than 40
      if(temperature>=40){alert("High temperature, Be careful");}
     temp.innerHTML = `<p class="text-3xl">${temperature}°C</p>`;
      weatherinfo.innerHTML = `<p class="text-3xl">${cityName}</p><p class="text-xl">${date.toDateString()}</p><p class="text-xl">${des}</p>`;
      weathericon.src= iconurl;
      weathericon.alt= des;
      hum.innerHTML = `<img src="humidity.gif" alt="humidity" class="w-20 h-20"><p class="text-2xl">Humidity: ${humidity}</p>`;
      wi.innerHTML = `<img src="wind.png" class="w-20 h-20"><p class="text-2xl">Wind: ${wind}</p>`;
         
   const city = document.getElementById("city");
   city.value="";

    }
}
// when clicked on button, the temperature is changed to C/F
function setTemp(temp) {
  tempInCelsius = temp;
  isCelsius = true; 
  tempChange();
}
document.getElementById("changetemp").addEventListener("click", () => {
  isCelsius = !isCelsius;
  tempChange();
});

let tempInCelsius = null;
let isCelsius = true;

function tempChange(){

   
    const temp = document.getElementById("tempinfo");
    const changetemp = document.getElementById("changetemp");
   
    if (isCelsius) {
    temp.innerHTML = `<p class="text-3xl">${tempInCelsius} °C</p>`;
    changetemp.textContent = "Switch to °F";
  } else {
    const tempF = Math.round((tempInCelsius * 9/5) + 32);
    temp.innerHTML = `<p class="text-3xl">${tempF} °F</p>`;
    changetemp.textContent = "Switch to °C";
  }

}

//displaying forcast information
function forecastWeather(response){

  document.getElementById("forecast").innerText="";
    const forecastList = response.list;
        const dailyForecasts = [];
         if (!forecastList || !Array.isArray(forecastList)) {
    console.log("Invalid or missing forecast data:", response);
    return;
  }
  
        forecastList.forEach(item => {
             if (item.dt_txt.includes("12:00:00")) {
                dailyForecasts.push(item);
            }
        });
        dailyForecasts.forEach(forecast => {
    const date = new Date(forecast.dt * 1000).toDateString();
    const temp = Math.round(forecast.main.temp);
    const desc = forecast.weather[0].description;
     const iconcode = forecast.weather[0].icon;
     const iconurl=`https://openweathermap.org/img/wn/${iconcode}@2x.png`
    const fore = document.getElementById("forecast");
    
     fore.innerHTML+= `<div id="fdiv" class="flex flex-col border-2 rounded-lg bg-black m-2 p-2"><img src=${iconurl} alt="icon"><p>${date}</p><p>${temp}°C</p><p>${desc}</p></div>`;
     
    console.log(`${date}: ${temp}°C, ${desc}`);
    });
    


   
}
