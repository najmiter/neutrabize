import { fetchWeatherApi } from 'openmeteo';

const weatherIcon = document.querySelector('#weather-icon') as HTMLImageElement;
const temperature = document.querySelector(
  '#temperature'
) as HTMLParagraphElement;

type WeatherData = {
  current: { rain: number; temperature2m: number; dayNight: 'day' | 'night' };
};

type Icons = {
  [key in WeatherData['current']['dayNight']]: { [x: number]: string };
};

const icons: Icons = {
  day: {
    0: '/weather/clear-day.gif',
    1: '/weather/rainy-day.gif',
  },
  night: {
    0: '/weather/clear-night.gif',
    1: '/weather/rainy-night.gif',
  },
};

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      const params = {
        latitude,
        longitude,
        current: ['temperature_2m', 'is_day', 'rain', 'weather_code'],
      };
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, params);
      const current = responses[0].current()!;

      const weatherData: WeatherData = {
        current: {
          rain: current.variables(2)!.value(),
          temperature2m: current.variables(0)!.value(),
          dayNight: current.variables(1)!.value() ? 'day' : 'night',
        },
      };
      const celsius = Math.trunc(weatherData.current.temperature2m);

      weatherIcon.src =
        icons[weatherData.current.dayNight][weatherData.current.rain];
      temperature.innerHTML = `${celsius}<sup>ºC</sup>`;
    },
    (error) => {
      console.error('Error getting location:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// const day = new Date().toLocaleDateString('en-us', { weekday: 'long' });
//<span style="font-size: 14px; opacity: 0.7;">${day}</span>
