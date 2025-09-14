import { WMO_CODES } from '../data/weather';

interface WeatherData {
  current: {
    temperature_2m: number;
    rain: boolean;
    is_day: number;
    weather_code: number;
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
    description?: string;
  };
}

const temperature = document.getElementById('temperature') as HTMLElement;
const weather_previously_fetched = localStorage.getItem('neutrabize_WEATHER');
const weatherIcon = document.getElementById('weather-icon') as HTMLImageElement;

export function update_weather(): void {
  if (weather_previously_fetched) {
    const { temperature: old, at } = JSON.parse(weather_previously_fetched) as StoredWeather;

    if (Date.now() > at + 1000 * 60 * 60) {
      do_da_weather_thing();
    } else {
      temperature.textContent = `${old.temp}`;
      weatherIcon.src = old.icon;
      weatherIcon.alt = old.description || 'Weather Icon';
      weatherIcon.title = old.description || '';
      set_title(old.description, at);
      weatherIcon.dataset.good = 'true';
    }
  } else {
    localStorage.removeItem('neutrabize_WEATHER');
    do_da_weather_thing();
  }
}

function do_da_weather_thing(): void {
  if (!('geolocation' in navigator)) return (temperature.textContent = ''), void 0;

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lati = position.coords.latitude;
    const long = position.coords.longitude;

    const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain,is_day,weather_code`;

    try {
      const choosni = await fetch(WEATHER_API);

      if (choosni.ok) {
        const khbr = (await choosni.json()) as WeatherData;
        const weatherCode = khbr.current.weather_code.toString() as `${number}`;
        const isDay = khbr.current.is_day === 1;
        const iconData = WMO_CODES[weatherCode];

        let iconPath = './imgs/icons/clear_day.svg';
        if (iconData) {
          iconPath = isDay ? iconData.day.image : iconData.night.image;
        }

        weatherIcon.src = iconPath;
        weatherIcon.alt = iconData ? (isDay ? iconData.day.description : iconData.night.description) : 'Weather Icon';
        const description = iconData ? (isDay ? iconData.day.description : iconData.night.description) : '';
        const at = Date.now();
        set_title(description, at);
        weatherIcon.title = description;
        weatherIcon.dataset.good = 'true';
        temperature.textContent = `${khbr.current.temperature_2m} ${khbr.current_units.temperature_2m}`;

        localStorage.setItem(
          'neutrabize_WEATHER',
          JSON.stringify({
            at,
            temperature: {
              temp: temperature.textContent,
              icon: iconPath,
              description,
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
}

function reset_weather_to_previous_or_empty(): void {
  if (weather_previously_fetched) {
    const { temperature: old, at } = JSON.parse(weather_previously_fetched) as StoredWeather;
    temperature.textContent = old.temp;
    weatherIcon.src = old.icon;
    set_title(old?.description, at);
    weatherIcon.dataset.good = 'true';
  } else {
    temperature.textContent = '';
  }
}

function set_title(description?: string, at?: number): void {
  if (!description) return;
  const container = document.querySelector('.clock-weather') as HTMLDivElement;
  if (container) {
    function get_msg() {
      const dist = Date.now() - (at || 0);
      if (dist < 60000) return 'Just now';
      if (dist < 3600000) return `${Math.floor(dist / 60000)} minute${Math.floor(dist / 60000) === 1 ? '' : 's'} ago`;
      if (dist < 86400000)
        return `${Math.floor(dist / 3600000)} hour${Math.floor(dist / 3600000) === 1 ? '' : 's'} ago`;
      return `${Math.floor(dist / 86400000)} day${Math.floor(dist / 86400000) === 1 ? '' : 's'} ago`;
    }
    container.title = `${description || ''}${at ? ` – Updated ${get_msg()}` : ''}`;
  }
}
