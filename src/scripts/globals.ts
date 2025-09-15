export const date = document.getElementById('date') as HTMLElement;
export const time = document.getElementById('time') as HTMLElement;
export const wallpaper = document.getElementById('wallpaper') as HTMLImageElement;
export const quote = document.getElementById('quote') as HTMLElement;
export const shortcuts = document.getElementById('shortcuts') as HTMLElement;
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
wallpaperLoading.innerHTML =
  '<div class="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>';
wallpaperContainer.appendChild(wallpaperLoading);
wallpaperContainer.style.position = 'relative';

export function update_theme(): void {
  if (!CONTEXT.has('theme')) {
    console.assert(false, 'Theme not in the context for whatever reason!');
    return;
  }

  const theme = CONTEXT.get('theme');
  // legacy
  if (theme?.bg?.startsWith('./') && !theme.bg.includes('exoplanets')) {
    CONTEXT.set('theme', themesData.exoplanets);
    localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData.exoplanets));
    return update_theme();
  }

  const time = document.getElementById('time') as HTMLElement;
  date.setAttribute('class', theme.classes.date.join(' '));
  date.classList.toggle('animate-bottom-item-1', true);
  time.setAttribute('class', theme.classes.time.join(' '));
  const digits = document.querySelectorAll('.digits-container div');
  digits.forEach((deez) => deez.setAttribute('class', theme.classes.time.join(' ')));

  wallpaperFade.classList.add('animate-wallpaper-fade');

  if (wallpaperFadeTimeout) {
    clearTimeout(wallpaperFadeTimeout);
    wallpaperFadeTimeout = null;
  }
  wallpaperFadeTimeout = setTimeout(() => {
    wallpaperFade.classList.remove('animate-wallpaper-fade');
  }, 300);

  if (theme.kind === 'vid') {
    try {
      const src = theme.bg || theme.fullUrl;
      if (src) {
        if (src.startsWith('./') || src.startsWith('/')) {
          source.src = src.includes('exoplanets') ? src : './imgs/bg/exoplanets.jpeg';
          video.load();
          video.play();
        } else {
          wallpaperLoading.style.opacity = '1';
          wallpaperLoading.style.pointerEvents = 'auto';
          wallpaperManager
            .getWallpaperSrc(theme.name, src)
            .then((blobUrl: string | null) => {
              source.src = blobUrl || src;
              video.load();
              video.play();
              wallpaperLoading.style.opacity = '0';
              wallpaperLoading.style.pointerEvents = 'none';
              wallpaper.style.display = 'none';
              video.style.display = 'block';
              updateThemeThumbnail(theme.name);
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
    const src = theme.bg || theme.fullUrl;
    if (src) {
      if (src.startsWith('./') || src.startsWith('/')) {
        wallpaper.src = src.includes('exoplanets') ? src : './imgs/bg/exoplanets.jpeg';
      } else {
        wallpaperLoading.style.opacity = '1';
        wallpaperLoading.style.pointerEvents = 'auto';
        wallpaperManager
          .getWallpaperSrc(theme.name, src)
          .then((blobUrl: string | null) => {
            wallpaper.src = blobUrl || src;
            wallpaperLoading.style.opacity = '0';
            wallpaperLoading.style.pointerEvents = 'none';
            updateThemeThumbnail(theme.name);
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
