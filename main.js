const shouldShowQuote = localStorage.getItem('neutrabize_SHOULDSHOWQUOTE');
const shouldShowShortcuts = localStorage.getItem(
  'neutrabize_SHOULDSHOWSHORTCUTS'
);
const activeTheme = localStorage.getItem('neutrabize_THEMEDATA');
const shouldShowBattery = localStorage.getItem('neutrabize_SHOULDSHOWBATTERY');

if (activeTheme) {
  try {
    const theme = JSON.parse(activeTheme);
    updateTheme(theme);

    themes.forEach(
      (_theme) => (_theme.dataset.active = _theme.dataset.name === theme.name)
    );
  } catch {}
}

if (shouldShowQuote === 'true') {
  const toggle = document.getElementById('show-quote-toggle');

  toggle.dataset.on = 'true';
  quote.style.display = 'block';
  quote.classList.remove('animate-away');
}

if (shouldShowShortcuts === 'false') {
  const toggle = document.getElementById('show-shortcuts-toggle');
  const shortcutsBar = document.getElementById('shortcuts-bar');

  toggle.dataset.on = 'false';
  shortcutsBar.dataset.show = 'false';
} else shortcuts.classList.remove('animate-away');

if (shouldShowBattery === 'true') {
  const toggle = document.getElementById('show-battery-toggle');

  toggle.dataset.on = 'true';
  batteryContainer.dataset.show = 'true';
} else batteryContainer.classList.add('hidden');

date.textContent = new Date().toLocaleDateString('en-us', {
  weekday: 'long',
  month: 'long',
  day: '2-digit',
  year: 'numeric',
});

function updateTime() {
  const now = new Date()
    .toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .split(' ')
    .at(0);

  time.textContent = now;
}

updateTime();
update_weather();

setInterval(updateTime, 1 * 1000);
