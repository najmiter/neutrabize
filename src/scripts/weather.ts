import { WMO_CODES } from '@/data/weather';
import type { IStoredWeather, IWeatherData } from '@/types';

const WEATHER_KEY = 'neutrabize_WEATHER';
const GEO_DENIED_KEY = 'neutrabize_GEODENIED';
const MAX_AGE = 1000 * 60 * 60;
const GEO_DENIED_BACKOFF = 1000 * 60 * 60 * 6;
const FALLBACK_ICON = './imgs/icons/weather/clear_day.svg';

const temperature = document.getElementById('temperature') as HTMLElement;
const weatherIcon = document.getElementById('weather-icon') as HTMLImageElement;

const stored = readStored();

function readStored(): IStoredWeather | null {
  const raw = localStorage.getItem(WEATHER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as IStoredWeather;
    if (!parsed?.temperature?.temp) throw new Error('malformed');
    return parsed;
  } catch {
    localStorage.removeItem(WEATHER_KEY);
    return null;
  }
}

function render(weather: IStoredWeather): void {
  temperature.textContent = weather.temperature.temp;
  weatherIcon.src = weather.temperature.icon;
  weatherIcon.alt = '';
  weatherIcon.dataset.good = 'true';
  set_title(weather.temperature.description, weather.at);
}

export function update_weather(): void {
  if (stored) render(stored);

  const isFresh = stored && Date.now() < stored.at + MAX_AGE;
  if (isFresh) return;

  const deniedAt = Number(localStorage.getItem(GEO_DENIED_KEY) ?? 0);
  if (deniedAt && Date.now() < deniedAt + GEO_DENIED_BACKOFF) {
    if (!stored) show_unavailable('Location access is off');
    return;
  }

  do_da_weather_thing();
}

function show_unavailable(reason: string): void {
  if (stored) return;
  temperature.textContent = '—';
  weatherIcon.dataset.good = 'false';
  set_title(reason);
}

function do_da_weather_thing(): void {
  if (!('geolocation' in navigator)) {
    show_unavailable('Weather unavailable');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      localStorage.removeItem(GEO_DENIED_KEY);

      const lati = position.coords.latitude;
      const long = position.coords.longitude;
      const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain,is_day,weather_code`;

      try {
        const response = await fetch(WEATHER_API, { signal: AbortSignal.timeout(8000) });
        if (!response.ok) throw new Error(`Couldn't get the temperature`);

        const khbr = (await response.json()) as IWeatherData;
        const weatherCode = khbr.current.weather_code.toString() as `${number}`;
        const isDay = khbr.current.is_day === 1;
        const iconData = WMO_CODES[weatherCode];
        const condition = iconData ? (isDay ? iconData.day : iconData.night) : null;

        const iconPath = condition?.image ?? FALLBACK_ICON;
        const description = condition?.description ?? '';
        const at = Date.now();
        const temp = `${Math.round(khbr.current.temperature_2m)} ${khbr.current_units.temperature_2m}`;

        const fresh: IStoredWeather = { at, temperature: { temp, icon: iconPath, description } };
        render(fresh);
        localStorage.setItem(WEATHER_KEY, JSON.stringify(fresh));
      } catch {
        show_unavailable('Weather unavailable');
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        localStorage.setItem(GEO_DENIED_KEY, Date.now().toString());
        show_unavailable('Location access is off');
      } else {
        show_unavailable('Weather unavailable');
      }
    },
    { timeout: 10000, maximumAge: MAX_AGE }
  );
}

function relative_time(at: number): string {
  const dist = Date.now() - at;
  const minutes = Math.floor(dist / 60000);
  const hours = Math.floor(dist / 3600000);
  const days = Math.floor(dist / 86400000);

  if (dist < 60000) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function set_title(description?: string, at?: number): void {
  const container = document.querySelector('.clock-weather') as HTMLDivElement | null;
  if (!container) return;

  const parts = [description, at ? `Updated ${relative_time(at)}` : ''].filter(Boolean);
  container.title = parts.join(' – ');
  weatherIcon.title = description ?? '';
}
