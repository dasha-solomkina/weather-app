class Forecast {
  constructor(
    city,
    country,
    temp_c,
    temp_f,
    feelslike_c,
    feelslike_f,
    wind_kph,
    wind_mph,
    humidity,
    is_day,
    condition_code
  ) {
    this.city = city;
    this.country = country;
    this.temp_c = temp_c;
    this.temp_f = temp_f;
    this.feelslike_c = feelslike_c;
    this.feelslike_f = feelslike_f;
    this.wind_kph = wind_kph;
    this.wind_mph = wind_mph;
    this.humidity = humidity;
    this.is_day = is_day;
    this.condition_code = condition_code;
  }
}

let city = 'Florianopolis';
let cityData = {};

async function getForcast(city) {
  try {
    const url =
      'http://api.weatherapi.com/v1/current.json?key=735a552fef314ecb892225301241302&q=' +
      String(city);

    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
      throw new Error('City not found or API request failed');
    }
    const data = await response.json();
    const w = data.current;
    const forecast = new Forecast(
      data.location.name,
      data.location.country,
      w.temp_c,
      w.temp_f,
      w.feelslike_c,
      w.feelslike_f,
      w.wind_kph,
      w.wind_mph,
      w.humidity,
      w.is_day,
      w.condition.code
    );
    return forecast;
  } catch (err) {
    console.log(err);
    showError(err);
    return null;
  }
}

async function showError(error) {
  const message = document.querySelector('.error');
  message.textContent = error;
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  message.textContent = '';
}

setTimeout(function () {
  console.log('This message will appear after 2 seconds.');
}, 2000);

// interactions
const form = document.querySelector('#myForm');

form.addEventListener('submit', (e) => {
  const input = document.querySelector('#search');
  e.preventDefault();
  city = input.value;
  getForcast(city)
    .then((forecast) => {
      cityData = forecast;
      render(cityData);
    })
    .catch((err) => console.log(err));
  form.reset();
});

let metrics = 0; // by default C and KM

const switcher = document.querySelector('.switcher');
const c = document.querySelector('#c');
const f = document.querySelector('#f');

switcher.addEventListener('click', () => {
  if (c.classList.contains('hidden')) {
    c.classList.remove('hidden');
    f.classList.add('hidden');
    metrics = 0;
    render(cityData);
  } else {
    f.classList.remove('hidden');
    c.classList.add('hidden');
    metrics = 1;
    render(cityData);
  }
});

function render(obj) {
  const back = document.querySelector('body');
  const icon = document.querySelector('#icon');
  const link = document.querySelector('a');

  if (obj.is_day === 1) {
    back.style.backgroundImage = "url('day2.jpg')";
    back.style.color = 'black';
    icon.src = `./day/${obj.condition_code}.png`;
    link.style.color = 'black';
  } else if (obj.is_day === 0) {
    back.style.backgroundImage = "url('night1.jpg')";
    back.style.color = 'white';
    icon.src = `./night/${obj.condition_code}.png`;
    link.style.color = 'white';
  }

  const city = document.querySelector('#city');
  const country = document.querySelector('#country');
  city.textContent = obj.city;
  country.textContent = obj.country;

  const temp = document.querySelector('#temp');
  const degree = document.querySelectorAll('.degree');
  const feels = document.querySelector('#tempFeels');
  const wind = document.querySelector('#wind');
  const wmeasure = document.querySelector('#measure');

  if (metrics === 0) {
    temp.textContent = obj.temp_c;
    feels.textContent = obj.feelslike_c;
    wind.textContent = obj.wind_kph;
    wmeasure.textContent = 'kph';
    degree.forEach((one) => (one.textContent = '°C'));
  } else if (metrics === 1) {
    temp.textContent = obj.temp_f;
    feels.textContent = obj.feelslike_f;
    wind.textContent = obj.wind_mph;
    wmeasure.textContent = 'mph';
    degree.forEach((one) => (one.textContent = '°F'));
  }

  const humidity = document.querySelector('#humidity');
  humidity.textContent = obj.humidity;
}

// default city
getForcast(city)
  .then((forecast) => {
    cityData = forecast;
    render(cityData);
  })
  .catch((err) => console.log(err));
