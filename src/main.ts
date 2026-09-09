import { date, quote, shortcuts, update_theme, CONTEXT } from '@/scripts/globals';
import { themesData } from '@/data/themes';
import { update_weather } from '@/scripts/weather';
import { initDownloads, toggleDownloads } from '@/scripts/downloads';
import { setSwitch } from '@/scripts/settings';
import '@/scripts/theme';
import '@/scripts/quote';
import '@/scripts/settings';
import '@/scripts/battery';
import '@/scripts/top-sites';
import '@/style.css';
import { render_themes, updateThemeThumbnail } from '@/scripts/dom';
import { generate_clock, update_time } from '@/scripts/clock';

const readTheme = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('neutrabize_THEMEDATA') ?? 'null');
    if (stored?.name && stored?.classes?.time && stored?.classes?.date) return stored;
  } catch {}
  return themesData.exoplanets;
};

CONTEXT.set('theme', readTheme());

const shouldShowQuote = localStorage.getItem('neutrabize_SHOULDSHOWQUOTE') === 'true';
const shouldShowShortcuts = localStorage.getItem('neutrabize_SHOULDSHOWSHORTCUTS') !== 'false';
const shouldShowDownloads = localStorage.getItem('neutrabize_SHOULDSHOWDOWNLOADS') === 'true';

const quoteToggle = document.getElementById('show-quote-toggle') as HTMLElement;
setSwitch(quoteToggle, shouldShowQuote);
if (shouldShowQuote) {
  quote.style.display = 'block';
  quote.classList.remove('animate-away');
}

const shortcutsToggle = document.getElementById('show-shortcuts-toggle') as HTMLElement;
const shortcutsBar = document.getElementById('shortcuts-bar') as HTMLElement;
setSwitch(shortcutsToggle, shouldShowShortcuts);
shortcutsBar.dataset.show = shouldShowShortcuts.toString();
if (shouldShowShortcuts) shortcuts.classList.remove('animate-away');

initDownloads();
const downloadToggle = document.getElementById('show-downloads-toggle') as HTMLElement;
setSwitch(downloadToggle, shouldShowDownloads);
toggleDownloads(shouldShowDownloads);

date.textContent = new Date().toLocaleDateString('en-us', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  weekday: 'short',
});

generate_clock();
update_time();
update_theme();
update_weather();

let clockTimer: ReturnType<typeof setTimeout>;
const tick = () => {
  update_time();
  clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000));
};
clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000));

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  update_time();
  date.textContent = new Date().toLocaleDateString('en-us', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    weekday: 'short',
  });
  clearTimeout(clockTimer);
  clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000));
});

render_themes().then(() => updateThemeThumbnail(CONTEXT.get('theme')?.name ?? ''));
