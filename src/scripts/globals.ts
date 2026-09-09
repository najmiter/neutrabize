export const date = document.querySelector('div[data-slot="not-3d"] #date') as HTMLElement;
export const time = document.querySelector('div[data-slot="not-3d"] #time') as HTMLElement;
export const wallpaper = document.getElementById('wallpaper') as HTMLImageElement;
export const quote = document.getElementById('quote') as HTMLElement;
export const shortcuts = document.querySelector('div[data-slot="not-3d"] #shortcuts') as HTMLElement;
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

let wallpaperFadeTimeout: ReturnType<typeof setTimeout> | null = null;
let activeBlobUrl: string | null = null;

const wallpaperLoading = document.createElement('div');
wallpaperLoading.className =
  'fixed pointer-events-none inset-0 flex items-center justify-center bg-black/70 z-10 opacity-0 transition-opacity';
wallpaperLoading.setAttribute('aria-hidden', 'true');
wallpaperLoading.innerHTML =
  '<div class="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>';
wallpaperContainer.appendChild(wallpaperLoading);
wallpaperContainer.style.position = 'relative';

function setLoading(on: boolean): void {
  wallpaperLoading.style.opacity = on ? '1' : '0';
  document.body.dataset.wallpaperLoading = on ? 'true' : 'false';
}

function trackBlobUrl(url: string): string {
  if (activeBlobUrl && activeBlobUrl !== url) URL.revokeObjectURL(activeBlobUrl);
  activeBlobUrl = url.startsWith('blob:') ? url : null;
  return url;
}

export function update_theme({
  theme,
  onSuccess,
  onError,
}: { theme?: any; onSuccess?: () => void; onError?: (message: string) => void } = {}): void {
  const currentTheme = theme || CONTEXT.get('theme');

  if (!currentTheme) return;


  const themeToUse = currentTheme;
  if (themeToUse?.bg?.startsWith('./') && !themeToUse.bg.includes('exoplanets')) {
    const onSuccessLegacy = () => {
      CONTEXT.set('theme', themesData.exoplanets);
      localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData.exoplanets));
      onSuccess?.();
    };
    return update_theme({ theme: themesData.exoplanets, onSuccess: onSuccessLegacy, onError });
  }

  const afterEffect = () => {
    const timeEl = document.querySelector('div[data-slot="not-3d"] #time') as HTMLElement | null;
    const classes = themeToUse?.classes;
    if (!classes?.date || !classes?.time) return;

    date.setAttribute('class', classes.date.join(' '));
    date.classList.toggle('animate-bottom-item-1', true);
    timeEl?.setAttribute('class', classes.time.join(' '));

    document.querySelectorAll('.digits-container div, .time-colon').forEach((node) => {
      const keep = node.classList.contains('time-colon') ? ['time-colon'] : [];
      node.setAttribute('class', [...keep, ...classes.time].join(' '));
    });
  };

  wallpaperFade.classList.add('animate-wallpaper-fade');

  if (wallpaperFadeTimeout) clearTimeout(wallpaperFadeTimeout);
  wallpaperFadeTimeout = setTimeout(() => {
    wallpaperFade.classList.remove('animate-wallpaper-fade');
  }, 300);

  const src = themeToUse.bg || themeToUse.fullUrl;
  if (!src) {
    onError?.('This theme has no wallpaper');
    return;
  }

  const isLocal = src.startsWith('./') || src.startsWith('/');
  const localSrc = src.includes('exoplanets') ? src : './imgs/bg/exoplanets.jpeg';

  const showVideo = () => {
    wallpaper.style.display = 'none';
    video.style.display = 'block';
  };
  const showImage = () => {
    wallpaper.style.display = 'block';
    video.style.display = 'none';
  };

  if (themeToUse.kind === 'vid') {
    if (isLocal) {
      source.src = localSrc;
      video.load();
      void video.play().catch(() => {});
      showVideo();
      updateThemeThumbnail(themeToUse.name);
      onSuccess?.();
      afterEffect();
      return;
    }

    setLoading(true);
    wallpaperManager
      .getWallpaperSrc(themeToUse.name, src)
      .then((blobUrl) => {
        if (!blobUrl) {
          onError?.(navigator.onLine ? 'Download failed' : 'You are offline');
          return;
        }
        source.src = trackBlobUrl(blobUrl);
        video.load();
        void video.play().catch(() => {});
        showVideo();
        updateThemeThumbnail(themeToUse.name);
        onSuccess?.();
        afterEffect();
      })
      .catch(() => onError?.('Download failed'))
      .finally(() => setLoading(false));
    return;
  }

  showImage();

  if (isLocal) {
    wallpaper.src = localSrc;
    updateThemeThumbnail(themeToUse.name);
    onSuccess?.();
    afterEffect();
    return;
  }

  setLoading(true);
  wallpaperManager
    .getWallpaperSrc(themeToUse.name, src)
    .then((blobUrl) => {
      if (!blobUrl) {
        onError?.(navigator.onLine ? 'Download failed' : 'You are offline');
        return;
      }
      wallpaper.src = trackBlobUrl(blobUrl);
      updateThemeThumbnail(themeToUse.name);
      onSuccess?.();
      afterEffect();
    })
    .catch(() => onError?.('Download failed'))
    .finally(() => setLoading(false));
}
