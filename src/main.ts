import {
  date,
  time,
  quote,
  shortcuts,
  // batteryContainer,
  updateTheme,
} from './scripts/globals';
import { update_weather } from './scripts/weather';
import { initDownloads, toggleDownloads } from './scripts/downloads';
import './scripts/quote';
import './scripts/settings';
import './scripts/theme';
import './scripts/battery';
import './scripts/top-sites';
import './style.css';

const shouldShowQuote = localStorage.getItem('neutrabize_SHOULDSHOWQUOTE');
const shouldShowShortcuts = localStorage.getItem(
  'neutrabize_SHOULDSHOWSHORTCUTS'
);
const shouldShowDownloads = localStorage.getItem(
  'neutrabize_SHOULDSHOWDOWNLOADS'
);
const activeTheme = localStorage.getItem('neutrabize_THEMEDATA');
// const shouldShowBattery = localStorage.getItem('neutrabize_SHOULDSHOWBATTERY');

if (activeTheme) {
  try {
    const theme = JSON.parse(activeTheme);
    updateTheme(theme);

    const themes = document.querySelectorAll<HTMLElement>('.theme');
    themes.forEach(
      (_theme) =>
        (_theme.dataset.active = (
          _theme.dataset.name === theme.name
        ).toString())
    );
  } catch {}
}

if (shouldShowQuote === 'true') {
  const toggle = document.getElementById('show-quote-toggle') as HTMLElement;

  toggle.dataset.on = 'true';
  quote.style.display = 'block';
  quote.classList.remove('animate-away');
}

if (shouldShowShortcuts === 'false') {
  const toggle = document.getElementById(
    'show-shortcuts-toggle'
  ) as HTMLElement;
  const shortcutsBar = document.getElementById('shortcuts-bar') as HTMLElement;

  toggle.dataset.on = 'false';
  shortcutsBar.dataset.show = 'false';
} else shortcuts.classList.remove('animate-away');

// if (shouldShowBattery === 'true') {
//   const toggle = document.getElementById('show-battery-toggle') as HTMLElement;

//   toggle.dataset.on = 'true';
//   batteryContainer.dataset.show = 'true';
// } else {
//   batteryContainer.classList.add('hidden');
// }

// Initialize downloads functionality
initDownloads();

if (shouldShowDownloads === 'true') {
  const toggle = document.getElementById(
    'show-downloads-toggle'
  ) as HTMLElement;
  toggle.dataset.on = 'true';
  toggleDownloads(true);
}

date.textContent = new Date().toLocaleDateString('en-us', {
  month: 'numeric',
  day: '2-digit',
  year: 'numeric',
});

function updateTime(): void {
  const now = new Date()
    .toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .split(' ')
    .at(0);

  if (now) time.textContent = now;
}

updateTime();
update_weather();

setInterval(updateTime, 1000);
