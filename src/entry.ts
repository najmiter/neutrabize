import { LocalStorage } from '@/utils/local-storage';
import { LocalStorageKeys, ThemeVersion } from '@/enums/local-storage';

const theme = LocalStorage.getItem(LocalStorageKeys.Version, ThemeVersion.THREE_D);

import '@/style.css';
const threeDWrapper = document.querySelector<HTMLDivElement>('div[data-slot="3d"]');
const notThreeDWrapper = document.querySelector<HTMLDivElement>('div[data-slot="not-3d"]');

document.documentElement.dataset['theme'] = theme ?? undefined;

if (theme === ThemeVersion.THREE_D) {
  import('./scripts/3d/main');
  threeDWrapper!.style.display = 'block';
  notThreeDWrapper!.style.display = 'none';
} else {
  import('./main');
  threeDWrapper!.style.display = 'none';
  notThreeDWrapper!.style.display = 'block';
}

const switchers = document.querySelectorAll<HTMLButtonElement>('div[data-slot="theme-selector"] button');

switchers.forEach((btn) => {
  btn.dataset['active'] =
    (LocalStorage.getItem(LocalStorageKeys.Version) ?? ThemeVersion.NOT_THREE_D) === btn.dataset['name']
      ? 'true'
      : 'false';
  btn.addEventListener('click', () => {
    const selectedTheme = btn.dataset['name'];
    if (!selectedTheme) return;

    LocalStorage.setItem(LocalStorageKeys.Version, selectedTheme);

    window.location.reload();
  });
});
