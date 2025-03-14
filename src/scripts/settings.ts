import { quote, shortcuts } from './globals';
import { toggleDownloads } from './downloads';

const settingsBtn = document.getElementById(
  'settings-btn'
) as HTMLButtonElement;
const settingsWrapper = document.getElementById(
  'settings-wrapper'
) as HTMLElement;
const settingsContent = document.getElementById(
  'settings-content'
) as HTMLElement;
const toggleQuote = document.getElementById('toggle-quote') as HTMLElement;
const toggleShortcuts = document.getElementById(
  'toggle-shortcuts'
) as HTMLElement;
const toggleDownloadsBtn = document.getElementById(
  'toggle-downloads'
) as HTMLElement;
// const toggleBattery = document.getElementById('toggle-battery') as HTMLElement;

document.addEventListener('click', (e: MouseEvent) => {
  const settings = document.getElementById('settings');
  if (settings && !settings.contains(e.target as Node)) {
    hideSettings();
  }
});

settingsBtn.addEventListener('click', () => {
  const themes = document.querySelectorAll<HTMLElement>('#themes>div');

  if (window.getComputedStyle(settingsWrapper).height !== '0px') {
    themes.forEach((theme) => {
      theme.classList.remove('animate-come-in');
      theme.classList.add('animate-come-out');
    });
    hideSettings();
  } else {
    themes.forEach((theme) => {
      theme.classList.remove('animate-come-out');
      theme.style.opacity = '0';
      setTimeout(() => theme.classList.add('animate-come-in'), 130);
    });
    settingsWrapper.style.height = '431px';
    settingsWrapper.style.padding = '16px';
    settingsContent.style.display = 'grid';
  }
});

toggleQuote.addEventListener('click', () => {
  const toggle = document.getElementById('show-quote-toggle') as HTMLElement;
  const newState = toggle.dataset.on === 'false';
  toggle.dataset.on = newState.toString();

  quote.classList.toggle('animate-away');
  setTimeout(
    () => {
      quote.style.display = newState ? 'block' : 'none';
    },
    quote.classList.contains('animate-away') ? 400 : 0
  );

  localStorage.setItem('neutrabize_SHOULDSHOWQUOTE', newState.toString());
});

toggleShortcuts.addEventListener('click', () => {
  const toggle = document.getElementById(
    'show-shortcuts-toggle'
  ) as HTMLElement;
  const shortcutsBar = document.getElementById('shortcuts-bar') as HTMLElement;
  const newState = toggle.dataset.on === 'false';
  toggle.dataset.on = newState.toString();

  shortcuts.classList.toggle('animate-away');
  setTimeout(
    () => {
      shortcutsBar.dataset.show = newState.toString();
    },
    shortcuts.classList.contains('animate-away') ? 400 : 0
  );

  localStorage.setItem('neutrabize_SHOULDSHOWSHORTCUTS', newState.toString());
});

toggleDownloadsBtn.addEventListener('click', () => {
  const toggle = document.getElementById(
    'show-downloads-toggle'
  ) as HTMLElement;
  const newState = toggle.dataset.on === 'false';
  toggle.dataset.on = newState.toString();

  toggleDownloads(newState);

  localStorage.setItem('neutrabize_SHOULDSHOWDOWNLOADS', newState.toString());
});

// toggleBattery.addEventListener('click', () => {
//   const toggle = document.getElementById('show-battery-toggle') as HTMLElement;
//   batteryContainer.classList.remove('hidden');

//   const newState = toggle.dataset.on === 'false';
//   toggle.dataset.on = newState.toString();
//   batteryContainer.dataset.show = newState.toString();

//   localStorage.setItem('neutrabize_SHOULDSHOWBATTERY', newState.toString());
// });

function hideSettings(): void {
  settingsWrapper.style.height = '0';
  settingsWrapper.style.padding = '0';
  settingsContent.style.display = 'none';
}
