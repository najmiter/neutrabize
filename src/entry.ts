import { LocalStorage } from '@/utils/local-storage';
import { LocalStorageKeys, ThemeVersion } from '@/enums/local-storage';

const DEFAULT_VERSION = ThemeVersion.THREE_D;

const theme = LocalStorage.getItem(LocalStorageKeys.Version, DEFAULT_VERSION) as ThemeVersion;

import '@/style.css';
const threeDWrapper = document.querySelector<HTMLDivElement>('div[data-slot="3d"]');
const notThreeDWrapper = document.querySelector<HTMLDivElement>('div[data-slot="not-3d"]');

document.documentElement.dataset['theme'] = theme;

const is3d = theme === ThemeVersion.THREE_D;

if (threeDWrapper) {
  threeDWrapper.hidden = !is3d;
  threeDWrapper.style.display = is3d ? 'block' : 'none';
}
if (notThreeDWrapper) {
  notThreeDWrapper.hidden = is3d;
  notThreeDWrapper.style.display = is3d ? 'none' : 'block';
}

if (is3d) {
  import('./scripts/3d/main');
} else {
  import('./main');
}

const switchers = document.querySelectorAll<HTMLButtonElement>('div[data-slot="theme-selector"] button');

switchers.forEach((btn) => {
  const isActive = theme === btn.dataset['name'];
  btn.dataset['active'] = isActive.toString();
  btn.setAttribute('aria-pressed', isActive.toString());

  btn.addEventListener('click', () => {
    const selectedTheme = btn.dataset['name'];
    if (!selectedTheme || selectedTheme === theme) return;

    LocalStorage.setItem(LocalStorageKeys.Version, selectedTheme);

    window.location.reload();
  });
});
