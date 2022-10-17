import './style.css'

// async function getImg(search){
//   const background = document.getElementById('background')
//   try {
//     const getImg = await fetch(`https://api.pexels.com/v1/search?query=${search}`,{
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         Authorization: "563492ad6f91700001000001732e787916124d24b441238a3aa6a260"
//       }
//     });
//     const img = await getImg.json();
//     if(img.staus != '429' && img){
//       let finalImage = img.photos[1]['src']['landscape']
//       background.style.backgroundImage = `url('${finalImage}')`
//     }
//   } catch(error) {
//     console.log(error)
//   }
// }

const getWeather = async (zip=null, position=null) => {
  let loader = document.getElementById('load')
  let cityName;
  let coordinates;
  try{
    if(zip){
      coordinates = await getCoordinates(zip)
      console.log(coordinates)
      cityName = coordinates.name
    }else{
      coordinates = position.coords
      coordinates.lat = coordinates["latitude"]
      coordinates.lon = coordinates["longitude"]
    }
    let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=ca25a80f5f1cc027112c19efbc24010a&units=imperial`, {mode: 'cors'});
    let result = await data.json();
    cityName = result.name
    return Promise.all([result, cityName])
  } catch(err){
    console.log(err)
  }

  async function getCoordinates(zip) {
    let coord = await fetch (`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},us&appid=ca25a80f5f1cc027112c19efbc24010a`, {mode: 'cors'});
    return await coord.json()
  }
}

const displayWeather = (weather, info, city) => {
  let weatherSection = document.getElementById('weatherInfo')
  let cityTitle = document.createElement('div')
  let cityContent = document.createElement('div')
  cityContent.className = 'rows'
  console.log(cityTitle)
  weatherSection.style.display = 'flex';
  let cityE = document.createElement('h2')
  cityE.className = 'weather-item-city'
  cityE.innerHTML = city
  cityTitle.appendChild(cityE)
  info.appendChild(cityTitle)

  let element = document.createElement('div')
  element.className = 'itemContainer'
  let elementT = document.createElement('h3')
  elementT.className = 'weather-item'
  elementT.innerHTML = `current condition`
  let elementD = document.createElement('div')
  elementD.innerHTML = `${weather['weather'][0]['description']}`
  cityContent.appendChild(elementT)
  element.appendChild(elementT)
  element.appendChild(elementD)
  cityContent.appendChild(element)

  for (const item in weather['main']){
    let modified = modifyData(item, weather['main'])
    if(modified){
      let element = document.createElement('div')
      element.className = 'itemContainer'
      let elementT = document.createElement('h3')
      elementT.className = 'weather-item'
      elementT.innerHTML = modified[0]
      let elementD = document.createElement('div')
      elementD.innerHTML = modified[1]
      element.appendChild(elementT)
      element.appendChild(elementD)
      cityContent.appendChild(element)
    }
  }
  info.appendChild(cityContent);
    // getImg(weather['weather'][0]['description']);

  function modifyData(key, object){
    if(key == 'temp'){
      return [`Tempurature`, `${object[key]}<sup>\u00B0F</sup>`]
    }
    if(key == 'feels_like'){
      return [`Feels Like`, `${object[key]}<sup>\u00B0F</sup>`]
    }
    if(key == 'temp_min'){
      return [`Low`, `${object[key]}<sup>\u00B0F</sup>`]
    }
    if(key == 'temp_max}'){
      return [`High`, `${object[key]}<sup>\u00B0F<sup>`]
    }
    if(key == 'humidity'){
      return [`Humidity`, `${object[key]}<sup>%</sup>`]
    }
    if(key == 'pressure'){
      return [`Pressure`, `${object[key]}<sup>hPa</sup>`]
    }
  }

  
  // async function changeBackground(search){
  //   let data = await fetch(``)
  // }
};

const listen = (() => {
  let location = document.getElementById('location')
  let loader = document.getElementById('load')
  let input = document.forms['zipCodeForm']
  let info = document.getElementById('weatherInfo')
  input.addEventListener('submit', async(e) => {
    e.preventDefault();
    info.style.display = 'none';
    loader.style.display = 'block';
    info.innerHTML = ''
    let zipcode = input['zipCode'].value
    let [weather, city] = await getWeather(zipcode);
    if(weather.cod == '400'){
      return info.innerHTML = 'invalid zip code :(';
    }else{
      displayWeather(weather, info, city)
    }
    loader.style.display = 'none';
    input['zipCode'].value = ''
  });


  location.addEventListener('click', async() => {
    loader.style.display = 'block'
    info.style.display = 'none';
    info.innerHTML = ''
    navigator.geolocation.getCurrentPosition(resolve, reject)
    async function resolve(position) {
      let [weather, city] = await getWeather(null, position);
      displayWeather(weather, info, city);
      loader.style.display = 'none'
      info.style.display = 'flex'
    }
    function reject(error) {
      console.log(error)
      loader.style.display = 'none'
    }
  })
})();
