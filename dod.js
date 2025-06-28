
const body = document.getElementById("body")
const API_KEY = "62865af676954ac5bd6154006250706"

const weatherBlock = document.getElementById("weatherBlock")
const cityName = document.getElementById("cityName")
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const conditionText = document.getElementById("conditionText");
const temperature = document.getElementById("temperature");
const tempDetails = document.getElementById("tempDetails");
const humidity = document.getElementById("humidity");
const sunTimes = document.getElementById("sunTimes");
const locationDetails = document.getElementById("locationDetails");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

const todayBtn = document.getElementById("todayBtn");
const tomorrowBtn = document.getElementById("tomorrowBtn");
const days3Btn = document.getElementById("3days");

let currentCity = "Kyiv";
let currentForecastDay = 0; // 0 - сьогодні, 1 - завтра, 3 - 3 дні

weather(currentCity, currentForecastDay);

function weather(city, forecastDay) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      const conditionEn = data.current.condition.text;
      const conditionIcon = data.current.condition.icon;
      const conditionUk = translateConditionToUkr(conditionEn);

      cityName.textContent = `${data.location.name}, ${data.location.country}`;
      conditionText.textContent = `Стан: ${conditionUk}`;
      weatherIcon.innerHTML = `<img class="weather-icon" src="https:${conditionIcon}" alt="${conditionEn}">`;
      temperature.textContent = `Температура: ${data.current.temp_c}°C`;
      tempDetails.textContent = `Відчувається як: ${data.current.feelslike_c}°C`;
      humidity.textContent = `Вологість: ${data.current.humidity}%`;
      sunTimes.textContent = `Схід: ${data.forecast.forecastday[forecastDay].astro.sunrise}, Захід: ${data.forecast.forecastday[forecastDay].astro.sunset}`;
      locationDetails.textContent = `Оновлено: ${data.current.last_updated}`;
      updateBackground(conditionEn);
      renderHourlyForecast(data.forecast.forecastday[forecastDay].hour);
    })
    .catch(error => {
      console.error("Помилка при запиті");
      weatherBlock.innerHTML = "<p>Не вдалося завантажити дані. Перевір місто.</p>";
    });
}

function renderHourlyForecast(hours) {
  forecastContainer.innerHTML = '<h3>Прогноз погодинно:</h3><div class="hourly-scroll">';
  forecastContainer.innerHTML += hours.map(hour => `
    <div class="hour-block">
      <p>${hour.time.split(' ')[1]}</p>
      <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" width="48" height="48"/>
      <p>${hour.temp_c}°C</p>
    </div>
  `).join('') + "</div>";
}

function translateConditionToUkr(condition) {
  const translations = {
    "Sunny": "Сонячно", "Clear": "Ясно", "Partly cloudy": "Мінлива хмарність",
    "Cloudy": "Хмарно", "Overcast": "Похмуро", "Mist": "Туман",
    "Patchy rain possible": "Місцями можливий дощ", "Light rain": "Легкий дощ",
    "Moderate rain": "Помірний дощ", "Heavy rain": "Сильний дощ",
    "Snow": "Сніг", "Light snow": "Легкий сніг", "Moderate snow": "Помірний сніг",
    "Heavy snow": "Сильний сніг", "Thunderstorm": "Гроза",
    "Light rain shower": "Легкий дощ"
  };
  return translations[condition] || condition;
}

function updateBackground(condition) {
  const con = condition.toLowerCase();
  if (con.includes("sunny")) {
    body.className = "sun";
  } else if (con.includes("rain")) {
    body.className = "rain";
  } else if (con.includes("cloud")) {
    body.className = "cloud";
  } else if (con.includes("snow")) {
    body.className = "snow";
  }
}

function handleSearch() {
  let city = searchInput.value.trim();
  if (city) {
    currentCity = city;
    weather(currentCity, currentForecastDay);
  }
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

todayBtn.addEventListener("click", () => {
  currentForecastDay = 0;
  weather(currentCity, currentForecastDay);
});
tomorrowBtn.addEventListener("click", () => {
  currentForecastDay = 1;
  weather(currentCity, currentForecastDay);
});
days3Btn.addEventListener("click", () => {
  currentForecastDay = 2;
  weather(currentCity, currentForecastDay);
});
