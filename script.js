const API_KEY = "62865af676954ac5bd6154006250706";

const body = document.getElementById("body");
const weatherBlock = document.getElementById("weatherBlock");
const cityName = document.getElementById("cityName");
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsBox = document.getElementById("suggestions");

const conditionText = document.getElementById("conditionText");
const temperature = document.getElementById("temperature");
const tempDetails = document.getElementById("tempDetails");
const humidity = document.getElementById("humidity");
const sunTimes = document.getElementById("sunTimes");
const locationDetails = document.getElementById("locationDetails");
const weatherIcon = document.getElementById("weatherIcon");

const todayBtn = document.getElementById("todayBtn");
const tomorrowBtn = document.getElementById("tomorrowBtn");
const days3Btn = document.getElementById("3days");
const forecastContainer = document.getElementById("forecastContainer");

let currentCity = 'Kyiv';
let currentForecastDay = 0;

const cityMap = {
  "Київ": "Kyiv", "Львів": "Lviv", "Одеса": "Odesa", "Харків": "Kharkiv", "Дніпро": "Dnipro",
  "Житомир": "Zhytomyr","Луцьк": "Lutsk", "Полтава": "Poltava","Херсон": "Kherson",
  "Рівне": "Rivne", "Суми": "Sumy", "Тернопіль": "Ternopil", "Ужгород": "Uzhhorod",
 "Черкаси": "Cherkasy", "Чернівці": "Chernivtsi", "Чернігів": "Chernihiv","Луганськ":"Luhansk","Кіровоград":"Kirovohrad"
};

function translateCityName(ukrName) {
  return cityMap[ukrName] || ukrName;
}

function translateConditionToUkr(cond) {
  const t = {
    "Sunny": "Сонячно", "Clear": "Ясно", "Partly cloudy": "Мінлива хмарність",
    "Cloudy": "Хмарно", "Overcast": "Похмуро", "Mist": "Туман",
    "Patchy rain possible": "Місцями можливий дощ", "Light rain": "Легкий дощ",
    "Moderate rain": "Помірний дощ", "Heavy rain": "Сильний дощ", "Snow": "Сніг",
    "Light snow": "Легкий сніг", "Moderate snow": "Помірний сніг", "Heavy snow": "Сильний сніг",
    "Thunderstorm": "Гроза", "Light rain shower": "Легкий дощ", "Patchy rain nearby": "Поруч дощ"
  };
  return t[cond] || cond;
}

function updateBackground(condition) {
  const lc = condition.toLowerCase();
  body.className = '';
  if (lc.includes("sunny") || lc.includes("clear")) {
    body.classList.add("sun");
  } else if (lc.includes("cloud") || lc.includes("overcast")) {
    body.classList.add("cloud");
  } else if (lc.includes("rain") || lc.includes("drizzle")) {
    body.classList.add("rain");
  } else if (lc.includes("snow") || lc.includes("sleet") || lc.includes("blizzard")) {
    body.classList.add("snow");
  } else {
    body.style.backgroundColor = "#1e1e1e";
  }
}

function updateActiveButton(dayIndex) {
  [todayBtn, tomorrowBtn, days3Btn].forEach((btn, index) => {
    btn.classList.toggle("active", index === dayIndex);
  });
  currentForecastDay = dayIndex;
}

function weather(city, forecastDay) {
  currentCity = city;
  const translatedCity = translateCityName(city);
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${translatedCity}&days=3&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      updateActiveButton(forecastDay);
      updateBackground(data.current.condition.text);

      if (forecastDay < 2) {
        const current = data.current;
        const day = data.forecast.forecastday[forecastDay];
        cityName.textContent = `${data.location.name}, ${data.location.country}`;
        const cond = current.condition;
        conditionText.textContent = `Стан: ${translateConditionToUkr(cond.text)}`;
        weatherIcon.innerHTML = `<img class="weather-icon" src="https:${cond.icon}" alt="${cond.text}">`;
        temperature.textContent = `Температура: ${current.temp_c}°C`;
        tempDetails.textContent = `Відчувається як: ${current.feelslike_c}°C`;
        humidity.textContent = `Вологість: ${current.humidity}%`;
        sunTimes.textContent = `Схід: ${day.astro.sunrise}, Захід: ${day.astro.sunset}`;
        locationDetails.textContent = `Оновлено: ${current.last_updated}`;

        renderHourlyForecast(day.hour);
      } else {
        renderThreeDayBlocks(data.forecast.forecastday, data.location);
      }
    })
    .catch(() => {
      weatherBlock.innerHTML = "<p>Не вдалося завантажити дані. Перевір місто.</p>";
    });
}

function renderHourlyForecast(hourData) {
  forecastContainer.innerHTML = '<h3>Прогноз погодинно:</h3>';
  const scrollDiv = document.createElement("div");
  scrollDiv.className = "hourly-scroll";

  hourData.forEach(hour => {
    const time = hour.time.split(" ")[1];
    const temp = `${Math.round(hour.temp_c)}°C`;
    const wind = `${Math.round(hour.wind_kph)} км/год`;

    const block = document.createElement("div");
    block.className = "hour-block";
    block.innerHTML = `
      <p>${time}</p>
      <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
      <p>${temp}</p>
      <p style="font-size: 11px;">💨 ${wind}</p>
    `;
    scrollDiv.appendChild(block);
  });

  forecastContainer.appendChild(scrollDiv);
}

function renderThreeDayBlocks(forecastArray, location) {
  cityName.textContent = `${location.name}, ${location.country}`;
  conditionText.textContent = "";
  temperature.textContent = "";
  tempDetails.textContent = "";
  humidity.textContent = "";
  sunTimes.textContent = "";
  locationDetails.textContent = "";
  weatherIcon.innerHTML = "";
  forecastContainer.innerHTML = "";

  forecastArray.forEach(day => {
    const cond = day.day.condition;
    const block = document.createElement("div");
    block.className = "forecast-day-block";
    block.innerHTML = `
      <img src="https:${cond.icon}" alt="${cond.text}">
      <p>${translateConditionToUkr(cond.text)}</p>
      <p>Макс: ${day.day.maxtemp_c}°C / Мін: ${day.day.mintemp_c}°C</p>
      <p>Схід: ${day.astro.sunrise}, Захід: ${day.astro.sunset}</p>
    `;
    forecastContainer.appendChild(block);
  });
}

// Події
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) weather(city, currentForecastDay);
});

[todayBtn, tomorrowBtn, days3Btn].forEach((btn, index) => {
  btn.addEventListener("click", () => {
    weather(currentCity, index);
  });
});

searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  const matches = Object.keys(cityMap).filter(city => city.toLowerCase().startsWith(val));
  suggestionsBox.innerHTML = "";
  if (matches.length > 0 && val) {
    suggestionsBox.classList.add("show");
    matches.forEach(city => {
      const div = document.createElement("div");
      div.textContent = city;
      div.addEventListener("click", () => {
        searchInput.value = city;
        suggestionsBox.classList.remove("show");
        weather(city, currentForecastDay);
        currentCity = city;
      });
      suggestionsBox.appendChild(div);
    });
  } else {
    suggestionsBox.classList.remove("show");
  }
});



// Перехід на головну при кліку на "Погода"
document.getElementById("Weather").addEventListener("click", () => {
  currentCity = "Київ";
  searchInput.value = ""; // очищає поле пошуку
  weather("Київ", 0);
});



// Пошук по Enter
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      weather(city, currentForecastDay);
    }
  }
});




// Початкове завантаження
weather(currentCity, 0);









