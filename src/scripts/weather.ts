interface WeatherData {
  current: {
    temperature_2m: number;
    rain: boolean;
    is_day: number;
  };
  current_units: {
    temperature_2m: string;
  };
}

interface StoredWeather {
  at: number;
  temperature: {
    temp: string;
    icon: string;
  };
}

const temperature = document.getElementById('temperature') as HTMLElement;
const weather_previously_fetched = localStorage.getItem('neutrabize_WEATHER');
const weatherIcon = document.getElementById('weather-icon') as HTMLImageElement;

export function update_weather(): void {
  if (weather_previously_fetched) {
    const { temperature: old, at } = JSON.parse(
      weather_previously_fetched
    ) as StoredWeather;

    if (Date.now() > at + 1000 * 60 * 60) {
      do_da_weather_thing();
    } else {
      temperature.textContent = `${old.temp}`;
      weatherIcon.src = `./imgs/icons/${old.icon}.svg`;
      weatherIcon.dataset.good = 'true';
    }
  } else {
    localStorage.removeItem('neutrabize_WEATHER');
    do_da_weather_thing();
  }
}

function do_da_weather_thing(): void {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lati = position.coords.latitude;
      const long = position.coords.longitude;

      const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain,is_day`;

      try {
        const choosni = await fetch(WEATHER_API);

        if (choosni.ok) {
          const khbr = (await choosni.json()) as WeatherData;
          const icon = khbr.current.rain
            ? 'rainy'
            : khbr.current.is_day
              ? 'sunny'
              : 'night';

          weatherIcon.src = `./imgs/icons/${icon}.svg`;
          weatherIcon.dataset.good = 'true';
          temperature.textContent = `${khbr.current.temperature_2m} ${khbr.current_units.temperature_2m}`;

          localStorage.setItem(
            'neutrabize_WEATHER',
            JSON.stringify({
              at: Date.now(),
              temperature: {
                temp: temperature.textContent,
                icon,
              },
            })
          );
        } else {
          throw new Error(`Couldn't get the temperature`);
        }
      } catch (probably_the_network_thing) {
        reset_weather_to_previous_or_empty();
      }
    }, reset_weather_to_previous_or_empty);
  } else {
    temperature.textContent = '';
  }
}

function reset_weather_to_previous_or_empty(): void {
  if (weather_previously_fetched) {
    const { temperature: old } = JSON.parse(
      weather_previously_fetched
    ) as StoredWeather;
    temperature.textContent = old.temp;
    weatherIcon.src = `./imgs/icons/${old.icon}.svg`;
    weatherIcon.dataset.good = 'true';
  } else {
    temperature.textContent = '';
  }
}
