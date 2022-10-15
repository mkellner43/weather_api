import './style.css'

async function getImg(search){
  const background = document.getElementById('background')
  try {
    const getImg = await fetch(`https://api.pexels.com/v1/search?query=${search}`,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: "563492ad6f91700001000001732e787916124d24b441238a3aa6a260"
      }
    });
    const img = await getImg.json();
    if(img.staus != '429' && img){
      let finalImage = img.photos[1]['src']['landscape']
      background.style.backgroundImage = `url('${finalImage}')`
    }
  } catch(error) {
    console.log(error)
  }
}

const getWeather = async (zip=76179) => {
  let loader = document.getElementById('load')
  loader.style.display = 'block'
  try{
    let coord = await fetch (`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},us&appid=ca25a80f5f1cc027112c19efbc24010a`, {mode: 'cors'});
  let coordinates = await coord.json()
  let cityName = coordinates.name
  let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=ca25a80f5f1cc027112c19efbc24010a&units=imperial`, {mode: 'cors'});
  let result = await data.json();
  loader.style.display = 'none'
  return Promise.all([result, cityName])
  } catch {
    loader.style.display = 'none'
    console.log(err)
  }
}

const displayWeather = (weather, info, city) => {
  let cityE = document.createElement('div')
  cityE.className = 'weather-item-city'
  cityE.innerHTML = city
  info.appendChild(cityE)
  for (const item in weather['main']){
    let modified = modifyData(item, weather['main'])
    if(modified){
      let element = document.createElement('div')
      element.className = 'weather-item'
      element.innerHTML = modified
      info.appendChild(element)
    }
  }
  let element = document.createElement('div')
    element.className = 'weather-item'
    element.innerHTML = `current condition: ${weather['weather'][0]['description']}`
    info.appendChild(element);
    getImg(weather['weather'][0]['description']);

  function modifyData(key, object){
    if(key == 'temp'){
      return `tempurature: ${object[key]}\u00B0F`
    }
    if(key == 'feels_like'){
      return `feels like: ${object[key]}\u00B0F`
    }
    if(key == 'temp_min'){
      return `low: ${object[key]}\u00B0F`
    }
    if(key == 'temp_max}'){
      return `high: ${object[key]}\u00B0F`
    }
    if(key == 'humidity'){
      return `humidity: ${object[key]}%`
    }
    if(key == 'pressure'){
      return `pressure: ${object[key]}hPa`
    }
  }

  async function changeBackground(search){
    let data = await fetch(``)
  }
};

const listen = (() => {
  let input = document.forms['zipCodeForm']
  let info = document.getElementById('weatherInfo')
  input.addEventListener('submit', async(e) => {
    e.preventDefault();
    info.innerHTML = ''
    let zipcode = input['zipCode'].value
    let [weather, city] = await getWeather(zipcode);
    if(weather.cod == '400'){
      return info.innerHTML = 'invalid zip code :(';
    }else{
      displayWeather(weather, info, city)
    }
    input['zipCode'].value = ''
  });
})();