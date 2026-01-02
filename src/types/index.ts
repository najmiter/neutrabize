export interface ThemeData {
  name: string;
  classes: {
    date: string[];
    time: string[];
  };
  bg?: string;
  thumbnailUrl?: string;
  fullUrl?: string;
  kind: 'img' | 'vid';
  displayName: string;
}

export interface ThemesData {
  [key: string]: ThemeData;
}

export interface IWeatherData {
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

export interface IStoredWeather {
  at: number;
  temperature: {
    temp: string;
    icon: string;
    description?: string;
  };
}
