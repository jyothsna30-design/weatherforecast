const inputbutton = document.getElementById("inputbutton");
const city = document.getElementById("city");
inputbutton.addEventListener("click",function showData(){
   
    
    if(!(/^[A-Za-z]+$/.test(city.value)) || city.value ==""){
        alert("Enter correct city name");
        return;
    }
    const citys=city.value;
    //const key='02cee0609024e20db19067082c030dce';
    const url= `https://api.openweathermap.org/data/2.5/weather?q=${citys}&APPID=02cee0609024e20db19067082c030dce`;
    const forecaturl = `https://api.openweathermap.org/data/2.5/forecast?q=${citys}&APPID=02cee0609024e20db19067082c030dce`;
    fetch(url).then(response=>response.json()).then(response=> {displayWeather(response)}).catch(error=>console.log(error));
    fetch(forecaturl).then(response=>response.json()).then(response=> {forecastWeather(response)}).catch(error=>console.log(error));
})

function displayWeather(response){
    const temp = document.getElementById("tempinfo");
    const weatherinfo = document.getElementById("weatherinfo");
    const weathericon = document.getElementById("weathericon");
    const hum = document.getElementById("humidity");
    const wi =document.getElementById("wind");
    temp.innerHTML="";
    weatherinfo.innerHTML="";

    if(response.cod === "404"){
             weatherinfo.innerHTML=`<p class="text-3xl">${response.message}</p><img src="" alt="not found"> `;
    }
    else{
        const cityName= response.name;
        const temperature =Math.round(response.main.temp-273.15);
        setTemp(temperature);
        const des= response.weather[0].description;
        const humidity= response.main.humidity;
        const wind =response.wind.speed;
        const iconcode= response.weather[0].icon;
        const iconurl = `https://openweathermap.org/img/wn/${iconcode}@4x.png`;
        const todaydate= response.dt;
        const date= new Date(todaydate * 1000);


      if(temperature>=40){alert("High temperature");}
     temp.innerHTML = `<p class="text-3xl">${temperature}°C</p>`;
      weatherinfo.innerHTML = `<p class="text-3xl">${cityName}</p><p class="text-xl">${date.toDateString()}</p><p class="text-xl">${des}</p>`;
      weathericon.src= iconurl;
      weathericon.alt= des;
      hum.innerHTML = `<img src="humidity.gif" alt="humidity" class="w-20 h-20"><p class="text-2xl">Humidity: ${humidity}</p>`;
      wi.innerHTML = `<img src="wind.png" class="w-20 h-20"><p class="text-2xl">Wind: ${wind}</p>`;



    }
}
function setTemp(temp) {
  tempInCelsius = temp;
  isCelsius = true; // Reset to Celsius by default
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
    temp.innerHTML = `<p class="text-3xl">${tempInCelsius.toFixed(1)} °C</p>`;
    changetemp.textContent = "Switch to °F";
  } else {
    const tempF = (tempInCelsius * 9/5) + 32;
    temp.innerHTML = `<p class="text-3xl">${tempF.toFixed(1)} °F</p>`;
    changetemp.textContent = "Switch to °C";
  }

}

function forecastWeather(response){
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
    const temp = forecast.main.temp;
    const desc = forecast.weather[0].description;
     const iconcode = forecast.weather[0].icon;
     const iconurl=`https://openweathermap.org/img/wn/${iconcode}@2x.png`
    const fore = document.getElementById("forecast");
    
     fore.innerHTML+= `<div class="flex flex-col border-2 rounded-lg bg-black m-7 p-2"><img src=${iconurl} alt="icon"><p>${date}</p><p>${temp}°C</p><p>${desc}</p></div>`;
     
    console.log(`${date}: ${temp}°C, ${desc}`);
    });
   
}
