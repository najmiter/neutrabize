import {
  date,
  quote,
  shortcuts,
  // batteryContainer,
  update_theme,
  CONTEXT,
} from './scripts/globals';
import { update_weather } from './scripts/weather';
import { initDownloads, toggleDownloads } from './scripts/downloads';
import './scripts/quote';
import './scripts/settings';
import './scripts/theme';
import './scripts/battery';
import './scripts/top-sites';
import './style.css';
import { render_themes } from './scripts/dom';
import { generate_clock, update_time } from './scripts/clock';

render_themes();

const shouldShowQuote = localStorage.getItem('neutrabize_SHOULDSHOWQUOTE');
const shouldShowShortcuts = localStorage.getItem('neutrabize_SHOULDSHOWSHORTCUTS');
const shouldShowDownloads = localStorage.getItem('neutrabize_SHOULDSHOWDOWNLOADS');
const activeTheme = localStorage.getItem('neutrabize_THEMEDATA');
// const shouldShowBattery = localStorage.getItem('neutrabize_SHOULDSHOWBATTERY');

if (activeTheme) {
  try {
    const theme = JSON.parse(activeTheme);
    CONTEXT.set('theme', theme);
    update_theme();
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

generate_clock();
update_time();
update_weather();

setInterval(update_time, 1000);
