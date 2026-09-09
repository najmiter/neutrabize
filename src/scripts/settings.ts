import { quote, shortcuts } from './globals';
import { toggleDownloads } from './downloads';

const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
const settingsWrapper = document.getElementById('settings-wrapper') as HTMLElement;
const settingsContent = document.getElementById('settings-content') as HTMLElement;
const themeStrip = document.getElementById('themes') as HTMLElement | null;
const switches = document.querySelectorAll<HTMLButtonElement>('.setting-switch');

const STORAGE_KEYS: Record<string, string> = {
  quote: 'neutrabize_SHOULDSHOWQUOTE',
  shortcuts: 'neutrabize_SHOULDSHOWSHORTCUTS',
  downloads: 'neutrabize_SHOULDSHOWDOWNLOADS',
};

export function isSettingsOpen(): boolean {
  return settingsBtn.getAttribute('aria-expanded') === 'true';
}

export function showSettings(): void {
  const themes = document.querySelectorAll<HTMLElement>('#themes > div');
  themes.forEach((theme) => {
    theme.classList.remove('animate-come-out');
    theme.style.opacity = '0';
    setTimeout(() => theme.classList.add('animate-come-in'), 130);
  });

  settingsContent.style.display = 'grid';
  settingsWrapper.style.padding = '16px';
  settingsWrapper.style.height = `${settingsContent.scrollHeight + 32}px`;
  settingsBtn.setAttribute('aria-expanded', 'true');
  document.body.dataset.settingsOpen = 'true';

  const activeTheme = document.querySelector('#themes div[data-active=true]');
  if (activeTheme) {
    setTimeout(() => activeTheme.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 400);
  }
}

export function hideSettings(): void {
  settingsWrapper.style.height = '0';
  settingsWrapper.style.padding = '0';
  settingsContent.style.display = 'none';
  settingsBtn.setAttribute('aria-expanded', 'false');
  delete document.body.dataset.settingsOpen;
}

function toggleSettings(): void {
  if (isSettingsOpen()) {
    document.querySelectorAll<HTMLElement>('#themes > div').forEach((theme) => {
      theme.classList.remove('animate-come-in');
      theme.classList.add('animate-come-out');
    });
    hideSettings();
  } else {
    showSettings();
  }
}

settingsBtn.addEventListener('click', toggleSettings);

document.addEventListener('click', (e: MouseEvent) => {
  if (!isSettingsOpen()) return;
  const settings = document.getElementById('settings');
  if (settings && !settings.contains(e.target as Node)) {
    hideSettings();
  }
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isSettingsOpen()) {
    hideSettings();
    settingsBtn.focus();
    return;
  }

  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const target = e.target as HTMLElement | null;
  const typing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '');
  if (typing) return;

  if ((e.key === 's' || e.key === 'S') && !isSettingsOpen()) {
    e.preventDefault();
    showSettings();
    settingsBtn.focus();
  }
});

function applySetting(name: string, on: boolean): void {
  if (name === 'quote') {
    quote.classList.toggle('animate-away', !on);
    setTimeout(
      () => {
        quote.style.display = on ? 'block' : 'none';
      },
      on ? 0 : 400
    );
    return;
  }

  if (name === 'shortcuts') {
    const shortcutsBar = document.getElementById('shortcuts-bar') as HTMLElement;
    shortcuts.classList.toggle('animate-away', !on);
    if (on) shortcutsBar.dataset.show = 'true';
    else setTimeout(() => (shortcutsBar.dataset.show = 'false'), 400);
    return;
  }

  if (name === 'downloads') {
    toggleDownloads(on);
  }
}

switches.forEach((button) => {
  const name = button.dataset.setting;
  if (!name) return;

  button.addEventListener('click', () => {
    const on = button.dataset.on !== 'true';
    setSwitch(button, on);
    applySetting(name, on);

    const key = STORAGE_KEYS[name];
    if (key) localStorage.setItem(key, on.toString());

    if (isSettingsOpen()) {
      settingsWrapper.style.height = `${settingsContent.scrollHeight + 32}px`;
    }
  });
});

export function setSwitch(button: HTMLElement, on: boolean): void {
  button.dataset.on = on.toString();
  button.setAttribute('aria-checked', on.toString());
}

if ('ResizeObserver' in window) {
  new ResizeObserver(() => {
    if (!isSettingsOpen()) return;
    settingsWrapper.style.height = `${settingsContent.scrollHeight + 32}px`;
  }).observe(settingsContent);
}

themeStrip?.addEventListener(
  'wheel',
  (e: WheelEvent) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    themeStrip.scrollLeft += e.deltaY;
  },
  { passive: false }
);
