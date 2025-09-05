interface WeatherCondition {
  description: string;
  image: string;
}

interface WeatherIcon {
  day: WeatherCondition;
  night: WeatherCondition;
}

export const WMO_CODES: Record<`${number}`, WeatherIcon> = {
  '0': {
    day: {
      description: 'Sunny',
      image: './imgs/icons/weather/clear_day.svg',
    },
    night: {
      description: 'Clear',
      image: './imgs/icons/weather/clear_night.svg',
    },
  },
  '1': {
    day: {
      description: 'Mainly Sunny',
      image: './imgs/icons/weather/mostly_clear_day.svg',
    },
    night: {
      description: 'Mainly Clear',
      image: './imgs/icons/weather/mostly_clear_night.svg',
    },
  },
  '2': {
    day: {
      description: 'Partly Cloudy',
      image: './imgs/icons/weather/partly_cloudy_day.svg',
    },
    night: {
      description: 'Partly Cloudy',
      image: './imgs/icons/weather/partly_cloudy_night.svg',
    },
  },
  '3': {
    day: {
      description: 'Cloudy',
      image: './imgs/icons/weather/cloudy.svg',
    },
    night: {
      description: 'Cloudy',
      image: './imgs/icons/weather/cloudy.svg',
    },
  },
  '45': {
    day: {
      description: 'Foggy',
      image: './imgs/icons/weather/haze_fog_dust_smoke.svg',
    },
    night: {
      description: 'Foggy',
      image: './imgs/icons/weather/haze_fog_dust_smoke.svg',
    },
  },
  '48': {
    day: {
      description: 'Rime Fog',
      image: './imgs/icons/weather/haze_fog_dust_smoke.svg',
    },
    night: {
      description: 'Rime Fog',
      image: './imgs/icons/weather/haze_fog_dust_smoke.svg',
    },
  },
  '51': {
    day: {
      description: 'Light Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
    night: {
      description: 'Light Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
  },
  '53': {
    day: {
      description: 'Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
    night: {
      description: 'Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
  },
  '55': {
    day: {
      description: 'Heavy Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
    night: {
      description: 'Heavy Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
  },
  '56': {
    day: {
      description: 'Light Freezing Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
    night: {
      description: 'Light Freezing Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
  },
  '57': {
    day: {
      description: 'Freezing Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
    night: {
      description: 'Freezing Drizzle',
      image: './imgs/icons/weather/drizzle.svg',
    },
  },
  '61': {
    day: {
      description: 'Light Rain',
      image: './imgs/icons/weather/cloudy_with_rain_light.svg',
    },
    night: {
      description: 'Light Rain',
      image: './imgs/icons/weather/cloudy_with_rain_light.svg',
    },
  },
  '63': {
    day: {
      description: 'Rain',
      image: './imgs/icons/weather/cloudy_with_rain_dark.svg',
    },
    night: {
      description: 'Rain',
      image: './imgs/icons/weather/cloudy_with_rain_dark.svg',
    },
  },
  '65': {
    day: {
      description: 'Heavy Rain',
      image: './imgs/icons/weather/heavy_rain.svg',
    },
    night: {
      description: 'Heavy Rain',
      image: './imgs/icons/weather/heavy_rain.svg',
    },
  },
  '66': {
    day: {
      description: 'Light Freezing Rain',
      image: './imgs/icons/weather/cloudy_with_rain_light.svg',
    },
    night: {
      description: 'Light Freezing Rain',
      image: './imgs/icons/weather/cloudy_with_rain_light.svg',
    },
  },
  '67': {
    day: {
      description: 'Freezing Rain',
      image: './imgs/icons/weather/cloudy_with_rain_dark.svg',
    },
    night: {
      description: 'Freezing Rain',
      image: './imgs/icons/weather/cloudy_with_rain_dark.svg',
    },
  },
  '71': {
    day: {
      description: 'Light Snow',
      image: './imgs/icons/weather/snow_with_cloudy_light.svg',
    },
    night: {
      description: 'Light Snow',
      image: './imgs/icons/weather/snow_with_cloudy_light.svg',
    },
  },
  '73': {
    day: {
      description: 'Snow',
      image: './imgs/icons/weather/snow_with_cloudy_dark.svg',
    },
    night: {
      description: 'Snow',
      image: './imgs/icons/weather/snow_with_cloudy_dark.svg',
    },
  },
  '75': {
    day: {
      description: 'Heavy Snow',
      image: './imgs/icons/weather/heavy_snow.svg',
    },
    night: {
      description: 'Heavy Snow',
      image: './imgs/icons/weather/heavy_snow.svg',
    },
  },
  '77': {
    day: {
      description: 'Snow Grains',
      image: './imgs/icons/weather/snow_with_cloudy_light.svg',
    },
    night: {
      description: 'Snow Grains',
      image: './imgs/icons/weather/snow_with_cloudy_light.svg',
    },
  },
  '80': {
    day: {
      description: 'Light Showers',
      image: './imgs/icons/weather/scattered_showers_day.svg',
    },
    night: {
      description: 'Light Showers',
      image: './imgs/icons/weather/scattered_showers_night.svg',
    },
  },
  '81': {
    day: {
      description: 'Showers',
      image: './imgs/icons/weather/showers_rain.svg',
    },
    night: {
      description: 'Showers',
      image: './imgs/icons/weather/showers_rain.svg',
    },
  },
  '82': {
    day: {
      description: 'Heavy Showers',
      image: './imgs/icons/weather/heavy_rain.svg',
    },
    night: {
      description: 'Heavy Showers',
      image: './imgs/icons/weather/heavy_rain.svg',
    },
  },
  '85': {
    day: {
      description: 'Light Snow Showers',
      image: './imgs/icons/weather/scattered_snow_showers_day.svg',
    },
    night: {
      description: 'Light Snow Showers',
      image: './imgs/icons/weather/scattered_snow_showers_night.svg',
    },
  },
  '86': {
    day: {
      description: 'Snow Showers',
      image: './imgs/icons/weather/showers_snow.svg',
    },
    night: {
      description: 'Snow Showers',
      image: './imgs/icons/weather/showers_snow.svg',
    },
  },
  '95': {
    day: {
      description: 'Thunderstorm',
      image: './imgs/icons/weather/isolated_thunderstorms.svg',
    },
    night: {
      description: 'Thunderstorm',
      image: './imgs/icons/weather/isolated_thunderstorms.svg',
    },
  },
  '96': {
    day: {
      description: 'Light Thunderstorms With Hail',
      image: './imgs/icons/weather/isolated_scattered_thunderstorms_day.svg',
    },
    night: {
      description: 'Light Thunderstorms With Hail',
      image: './imgs/icons/weather/isolated_scattered_thunderstorms_night.svg',
    },
  },
  '99': {
    day: {
      description: 'Thunderstorm With Hail',
      image: './imgs/icons/weather/strong_thunderstorms.svg',
    },
    night: {
      description: 'Thunderstorm With Hail',
      image: './imgs/icons/weather/strong_thunderstorms.svg',
    },
  },
};
