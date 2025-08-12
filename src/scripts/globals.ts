import { ThemeData } from '../types';

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

let wallpaperFadeTimeout: NodeJS.Timeout | null = null;

export function updateTheme(theme: ThemeData): void {
  date.classList.add(...theme.classes.date);
  time.classList.add(...theme.classes.time);

  wallpaperFade.classList.add('animate-wallpaper-fade');

  if (wallpaperFadeTimeout) {
    clearTimeout(wallpaperFadeTimeout);
    wallpaperFadeTimeout = null;
  }
  wallpaperFadeTimeout = setTimeout(() => {
    wallpaperFade.classList.remove('animate-wallpaper-fade');
  }, 300);

  if (theme?.name == 'beach') {
    video.style.transform = 'scaleX(-1)';
  } else {
    video.style.transform = 'scaleX(1)';
  }

  if (theme.kind === 'vid') {
    wallpaper.style.display = 'none';
    video.style.display = 'block';
    source.src = theme.bg;
    video.load();
    video.play();
  } else {
    wallpaper.src = theme.bg;
    wallpaper.style.display = 'block';
    video.style.display = 'none';
  }
}
