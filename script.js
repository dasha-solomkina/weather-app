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

async function getForcast(city) {
  const url =
    'http://api.weatherapi.com/v1/current.json?key=735a552fef314ecb892225301241302&q=' +
    String(city);

  const response = await fetch(url, { mode: 'cors' });
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
  render(forecast);
  //return forecast;
}

// getForcast(city);

// TODO: error handeling

// interactions

const form = document.querySelector('#myForm');

form.addEventListener('submit', (e) => {
  const input = document.querySelector('#search');
  e.preventDefault();
  city = input.value;
  console.log(city);
  getForcast(city);
  form.reset();
});

function render(obj) {
  const back = document.querySelector('body');
  const iconSpace = document.querySelector('#icon');
  const icon = document.createElement('img');
  iconSpace.appendChild(icon);

  if (obj.is_day === 1) {
    back.style.backgroundImage = "url('day2.jpg')";
    back.style.color = 'black';
    icon.src = `./day/${obj.condition_code}.png`;
  } else {
    back.style.backgroundImage = "url('night1.jpg')";
    back.style.color = 'white';
    icon.src = `./night/${obj.condition_code}.png`;
  }
}
