export const date = document.querySelector('div[data-slot="not-3d"] #date') as HTMLElement;
export const time = document.querySelector('div[data-slot="not-3d"] #time') as HTMLElement;
export const wallpaper = document.getElementById('wallpaper') as HTMLImageElement;
export const quote = document.getElementById('quote') as HTMLElement;
export const shortcuts = document.querySelector('div[data-slot="not-3d"] #shortcuts') as HTMLElement;
export const themes = document.querySelectorAll('.theme');
export const batteryContainer = document.getElementById('battery-container') as HTMLElement;
export const video = document.getElementById('live-wallpaper-vid') as HTMLVideoElement;
export const source = document.getElementById('live-wallpaper-src') as HTMLSourceElement;
export const downloadsPanel = document.getElementById('downloads-panel') as HTMLElement;
export const themeContainer = document.getElementById('themes') as HTMLDivElement;
export const wallpaperFade = document.getElementById('wallpaper-fade') as HTMLDivElement;
export const wallpaperContainer = document.getElementById('wallpaper-container') as HTMLDivElement;

import { themesData } from '@/data/themes';
import { wallpaperManager } from '@/scripts/wallpaper-manager';
import { updateThemeThumbnail } from '@/scripts/dom';

export const CONTEXT = new Map<string, any>();

let wallpaperFadeTimeout: NodeJS.Timeout | null = null;

const wallpaperLoading = document.createElement('div');
wallpaperLoading.className =
  'fixed pointer-events-none inset-0 flex items-center justify-center bg-black/70 z-10 opacity-0 transition-opacity pointer-events-none';
// wallpaperLoading.innerHTML =
//   '<div class="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>';
wallpaperContainer.appendChild(wallpaperLoading);
wallpaperContainer.style.position = 'relative';

export function update_theme({ theme, onSuccess }: { theme?: any; onSuccess?: () => void } = {}): void {
  const currentTheme = theme || CONTEXT.get('theme');

  if (!currentTheme) {
    console.assert(false, 'Theme not in the context for whatever reason!');
    return;
  }

  const themeToUse = currentTheme;
  // legacy
  if (themeToUse?.bg?.startsWith('./') && !themeToUse.bg.includes('exoplanets')) {
    const onSuccessLegacy = () => {
      CONTEXT.set('theme', themesData.exoplanets);
      localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData.exoplanets));
      onSuccess?.();
    };
    return update_theme({ theme: themesData.exoplanets, onSuccess: onSuccessLegacy });
  }

  const afterEffect = () => {
    const time = document.querySelector('div[data-slot="not-3d"] #time') as HTMLElement;
    date.setAttribute('class', themeToUse.classes.date.join(' '));
    date.classList.toggle('animate-bottom-item-1', true);
    time.setAttribute('class', themeToUse.classes.time.join(' '));
    const digits = document.querySelectorAll('.digits-container div');
    digits.forEach((deez) => deez.setAttribute('class', themeToUse.classes.time.join(' ')));
  };
  wallpaperFade.classList.add('animate-wallpaper-fade');

  if (wallpaperFadeTimeout) {
    clearTimeout(wallpaperFadeTimeout);
    wallpaperFadeTimeout = null;
  }
  wallpaperFadeTimeout = setTimeout(() => {
    wallpaperFade.classList.remove('animate-wallpaper-fade');
  }, 300);

  if (themeToUse.kind === 'vid') {
    try {
      const src = themeToUse.bg || themeToUse.fullUrl;
      if (src) {
        if (src.startsWith('./') || src.startsWith('/')) {
          source.src = src.includes('exoplanets') ? src : './imgs/bg/exoplanets.jpeg';
          video.load();
          video.play();
          updateThemeThumbnail(themeToUse.name);
          onSuccess?.();
          afterEffect();
        } else {
          wallpaperLoading.style.opacity = '1';
          wallpaperLoading.style.pointerEvents = 'auto';
          wallpaperManager
            .getWallpaperSrc(themeToUse.name, src)
            .then((blobUrl: string | null) => {
              if (blobUrl) {
                source.src = blobUrl;
                video.load();
                video.play();
                wallpaperLoading.style.opacity = '0';
                wallpaperLoading.style.pointerEvents = 'none';
                wallpaper.style.display = 'none';
                video.style.display = 'block';
                updateThemeThumbnail(themeToUse.name);
                onSuccess?.();
                afterEffect();
              } else {
                wallpaperLoading.style.opacity = '0';
                wallpaperLoading.style.pointerEvents = 'none';
              }
            })
            .catch(() => {
              source.src = src;
              video.load();
              video.play();
              wallpaper.style.display = 'none';
              video.style.display = 'block';
              wallpaperLoading.style.opacity = '0';
              wallpaperLoading.style.pointerEvents = 'none';
            });
        }
      }
    } catch {}
  } else {
    const src = themeToUse.bg || themeToUse.fullUrl;
    if (src) {
      if (src.startsWith('./') || src.startsWith('/')) {
        wallpaper.src = src.includes('exoplanets') ? src : './imgs/bg/exoplanets.jpeg';
        updateThemeThumbnail(themeToUse.name);
        onSuccess?.();
        afterEffect();
      } else {
        wallpaperLoading.style.opacity = '1';
        wallpaperLoading.style.pointerEvents = 'auto';
        wallpaperManager
          .getWallpaperSrc(themeToUse.name, src)
          .then((blobUrl: string | null) => {
            if (blobUrl) {
              wallpaper.src = blobUrl;
              wallpaperLoading.style.opacity = '0';
              wallpaperLoading.style.pointerEvents = 'none';
              updateThemeThumbnail(themeToUse.name);
              onSuccess?.();
              afterEffect();
            } else {
              wallpaperLoading.style.opacity = '0';
              wallpaperLoading.style.pointerEvents = 'none';
            }
          })
          .catch(() => {
            wallpaper.src = src;
            wallpaperLoading.style.opacity = '0';
            wallpaperLoading.style.pointerEvents = 'none';
          });
      }
    }
    wallpaper.style.display = 'block';
    video.style.display = 'none';
  }
}
