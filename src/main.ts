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
import { renderThemes } from './scripts/dom';

renderThemes();

const shouldShowQuote = localStorage.getItem('neutrabize_SHOULDSHOWQUOTE');
const shouldShowShortcuts = localStorage.getItem('neutrabize_SHOULDSHOWSHORTCUTS');
const shouldShowDownloads = localStorage.getItem('neutrabize_SHOULDSHOWDOWNLOADS');
const activeTheme = localStorage.getItem('neutrabize_THEMEDATA');
// const shouldShowBattery = localStorage.getItem('neutrabize_SHOULDSHOWBATTERY');

if (activeTheme) {
  try {
    const theme = JSON.parse(activeTheme);
    updateTheme(theme);
  } catch {}
}

if (shouldShowQuote === 'true') {
  const toggle = document.getElementById('show-quote-toggle') as HTMLElement;

  toggle.dataset.on = 'true';
  quote.style.display = 'block';
  quote.classList.remove('animate-away');
}

if (shouldShowShortcuts === 'false') {
  const toggle = document.getElementById('show-shortcuts-toggle') as HTMLElement;
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

const downloadToggle = document.getElementById('show-downloads-toggle') as HTMLElement;
if (shouldShowDownloads === 'true') {
  downloadToggle.dataset.on = 'true';
  toggleDownloads(true);
} else {
  downloadToggle.dataset.on = 'false';
  toggleDownloads(false);
}

date.textContent = new Date().toLocaleDateString('en-us', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  weekday: 'short',
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

  if (now && time.textContent !== now) {
    time.textContent = now;
    time.classList.add('animate-time-update');
    setTimeout(() => {
      time.classList.remove('animate-time-update');
    }, 300);
  }
}

updateTime();
update_weather();

setInterval(updateTime, 1000);
