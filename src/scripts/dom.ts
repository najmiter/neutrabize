import { themesData } from '@/data/themes';
import { ThemeData } from '@/types';
import { CONTEXT, themeContainer, update_theme } from '@/scripts/globals';
import { wallpaperManager } from '@/scripts/wallpaper-manager';

const themeNodes: HTMLDivElement[] = [];

export const render_themes = async () => {
  // should only do it the first time
  if (themeNodes.length > 0) return;

  themeContainer.innerHTML = '';
  const themes = Object.values(themesData);
  // must be there at this point
  const activeTheme = JSON.parse(localStorage.getItem('neutrabize_THEMEDATA') ?? '{}');

  for (const theme of themes) {
    const container = makeContainer(theme.displayName);
    const overlay = makeOverlay(theme.name, activeTheme?.name === theme.name);
    const element = await getElement(theme);
    container.appendChild(element);
    container.append(overlay);
    themeNodes.push(container);
  }

  themeContainer.append(...themeNodes);
};

const updateThemes = (activeThemeName: string) => {
  themeNodes.forEach(async (node) => {
    const overlay = node.querySelector('div[data-name]') as HTMLDivElement | null;
    if (!overlay) return;

    const name = overlay.dataset.name;
    if (!name) return;

    overlay.dataset.active = name === activeThemeName ? 'true' : 'false';
    if (name === activeThemeName) {
      const src = await wallpaperManager.getCachedWallpaperUrl(name);
      if (src) {
        const img = node.querySelector('[data-kind="img"] img') as HTMLImageElement | null;
        console.log('img', img);
        if (img) {
          img.src = src;
        }
        const vidSrc = node.querySelector('[data-kind="vid"] video') as HTMLVideoElement | null;
        console.log('vidSrc', vidSrc);
        if (vidSrc) {
          vidSrc.querySelector('source')!.src = src;
          vidSrc.load();
          vidSrc.play();
        }
      }
    }
  });
};

export const updateThemeThumbnail = async (themeName: string) => {
  const node = themeNodes.find((node) => {
    const overlay = node.querySelector('div[data-name]') as HTMLDivElement | null;
    return overlay?.dataset.name === themeName;
  });
  if (!node) return;

  const isCached = await wallpaperManager.isWallpaperCached(themeName);
  if (!isCached) return;

  const src = await wallpaperManager.getCachedWallpaperUrl(themeName);
  if (!src) return;

  const img = node.querySelector('[data-kind="img"] img') as HTMLImageElement | null;
  if (img) {
    img.src = src;
    img.classList.remove('blur');
  }

  const vidSrc = node.querySelector('[data-kind="vid"] video') as HTMLVideoElement | null;
  if (vidSrc) {
    vidSrc.querySelector('source')!.src = src;
    vidSrc.load();
    vidSrc.play();
    const thumbnail = vidSrc.previousElementSibling as HTMLImageElement | null;
    if (thumbnail && thumbnail.tagName === 'IMG') {
      thumbnail.remove();
      vidSrc.style.display = 'block';
    }
  }
};

const makeContainer = (name: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.title = name;
  container.classList.add(
    ...'relative grid gap-2 cursor-pointer justify-items-center min-w-36 rounded-md p-2 hover:bg-stone-500/20 has-[div[data-active=true]]:bg-stone-400/30'.split(
      ' '
    )
  );
  return container;
};

const makeOverlay = (themeName: string, isActive = false) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.setAttribute('role', 'presentation');
  overlayDiv.dataset.name = themeName;
  overlayDiv.dataset.active = isActive.toString();

  overlayDiv.classList.add(...'theme absolute top-0 left-0 w-full h-full bg-transparent'.split(' '));

  overlayDiv.addEventListener('click', ({ target }) => {
    const element = target as HTMLElement;
    const name = element.dataset.name;

    if (!name || !themesData[name]) return;

    CONTEXT.set('theme', themesData[name]);
    localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData[name]));
    update_theme();

    updateThemes(name);
  });
  return overlayDiv;
};

const getElement = async (theme: ThemeData): Promise<HTMLElement> => {
  const isCached = await wallpaperManager.isWallpaperCached(theme.name);
  const cachedUrl = isCached ? await wallpaperManager.getCachedWallpaperUrl(theme.name) : null;

  const src = cachedUrl || theme.bg || theme.thumbnailUrl || '';

  if (theme.kind === 'img') {
    return await makeImgElement(theme, src, isCached);
  } else {
    return await makeVidElement(theme, src, isCached);
  }
};

const makeVidElement = async (theme: ThemeData, src: string, isCached: boolean = false): Promise<HTMLElement> => {
  const container = document.createElement('div');
  container.className = 'relative grid gap-2';
  container.dataset.kind = 'vid';
  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.style.pointerEvents = 'none';
  video.className = 'w-32 h-32 object-cover rounded-md';
  const source = document.createElement('source');
  source.type = 'video/mp4';
  video.appendChild(source);
  const fallback = document.createTextNode('Your browser does not support the video tag.');
  video.appendChild(fallback);
  container.appendChild(video);
  const h3 = document.createElement('h3');
  h3.className = 'text-sm text-center';
  h3.textContent = theme.displayName;
  container.appendChild(h3);
  container.appendChild(getLiveChip());

  if (src.startsWith('./') || src.startsWith('/')) {
    const thumbnail = document.createElement('img');
    thumbnail.src = src;
    thumbnail.className = video.className;
    thumbnail.classList.add('blur');
    container.insertBefore(thumbnail, video);
    video.style.display = 'none';
    video.addEventListener('loadeddata', () => {
      thumbnail.remove();
      video.style.display = 'block';
    });
  } else if (isCached) {
    source.src = src;
  } else {
    try {
      const cachedSrc = await wallpaperManager.getThumbnailSrc(src);
      source.src = cachedSrc;
    } catch {
      source.src = src;
    }
  }
  return container;
};

const makeImgElement = async (theme: ThemeData, src: string, isCached: boolean = false): Promise<HTMLElement> => {
  const container = document.createElement('div');
  container.className = 'relative grid gap-2';
  container.dataset.kind = 'img';
  const img = document.createElement('img');
  img.className = 'w-32 h-32 aspect-square object-cover rounded-md';
  img.alt = theme.displayName;
  container.appendChild(img);
  const h3 = document.createElement('h3');
  h3.className = 'text-sm text-center';
  h3.textContent = theme.displayName;
  container.appendChild(h3);

  if (src.startsWith('./') || src.startsWith('/')) {
    img.src = src;
    img.classList.add('blur');
  } else if (isCached) {
    img.src = src;
    img.classList.remove('blur');
  } else {
    try {
      const cachedSrc = await wallpaperManager.getThumbnailSrc(src);
      img.src = cachedSrc;
    } catch {
      img.src = src;
    }
  }
  return container;
};

const getLiveChip = (): HTMLDivElement => {
  const chip = document.createElement('div');
  chip.classList.add(
    ...'absolute top-2 right-2 bg-blue-500/50 backdrop-blur-2xl border border-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold select-none'.split(
      ' '
    )
  );
  chip.textContent = 'Live';
  return chip;
};
