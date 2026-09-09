import { themesData } from '@/data/themes';
import { ThemeData } from '@/types';
import { CONTEXT, themeContainer, update_theme } from '@/scripts/globals';
import { wallpaperManager } from '@/scripts/wallpaper-manager';

const themeNodes: HTMLDivElement[] = [];

export const render_themes = async () => {
  if (themeNodes.length > 0) return;

  const themes = Object.values(themesData);
  let activeTheme: ThemeData | null = null;
  try {
    activeTheme = JSON.parse(localStorage.getItem('neutrabize_THEMEDATA') ?? 'null');
  } catch {
    activeTheme = null;
  }

  const built = await Promise.all(
    themes.map(async (theme) => {
      const container = makeContainer(theme, activeTheme?.name === theme.name);
      const overlay = makeOverlay(theme.name, activeTheme?.name === theme.name);
      const { element, isCached } = await getElement(theme);
      if (!isCached) container.title = `${theme.displayName} — click to download`;
      container.append(element, overlay);
      container.dataset.isAvailable = isCached.toString();
      return container;
    })
  );

  themeNodes.push(...built);
  themeContainer.replaceChildren(...themeNodes);
};

const findNode = (themeName: string) =>
  themeNodes.find((node) => node.querySelector<HTMLDivElement>('div[data-name]')?.dataset.name === themeName);

const updateThemes = (activeThemeName: string) => {
  themeNodes.forEach(async (node) => {
    const overlay = node.querySelector<HTMLDivElement>('div[data-name]');
    const name = overlay?.dataset.name;
    if (!overlay || !name) return;

    const isActive = name === activeThemeName;
    overlay.dataset.active = isActive.toString();
    node.setAttribute('aria-selected', isActive.toString());

    if (!isActive) return;

    const src = await wallpaperManager.getCachedWallpaperUrl(name);
    if (!src) return;

    const img = node.querySelector<HTMLImageElement>('[data-kind="img"] img');
    if (img) img.src = src;

    const vid = node.querySelector<HTMLVideoElement>('[data-kind="vid"] video');
    if (vid) {
      vid.querySelector('source')!.src = src;
      vid.load();
      void vid.play().catch(() => {});
    }
  });
};

export const updateThemeThumbnail = async (themeName: string) => {
  const node = findNode(themeName);
  if (!node) return;

  if (!(await wallpaperManager.isWallpaperCached(themeName))) return;

  const src = await wallpaperManager.getCachedWallpaperUrl(themeName);
  if (!src) return;

  node.querySelector('#download-icon')?.remove();
  node.dataset.isAvailable = 'true';
  node.title = node.dataset.displayName ?? node.title;

  const img = node.querySelector<HTMLImageElement>('[data-kind="img"] img');
  if (img) {
    img.src = src;
    img.classList.remove('blur');
  }

  const vid = node.querySelector<HTMLVideoElement>('[data-kind="vid"] video');
  if (vid) {
    vid.querySelector('source')!.src = src;
    vid.load();
    void vid.play().catch(() => {});
    const thumbnail = vid.previousElementSibling as HTMLImageElement | null;
    if (thumbnail && thumbnail.tagName === 'IMG') {
      thumbnail.remove();
      vid.style.display = 'block';
    }
  }
};

const selectTheme = (name: string) => {
  const themeData = themesData[name];
  if (!themeData) return;

  const node = findNode(name);
  node?.setAttribute('aria-busy', 'true');
  showError(name, null);

  const onSuccess = () => {
    CONTEXT.set('theme', themeData);
    localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themeData));
    node?.removeAttribute('aria-busy');
    updateThemes(name);
  };

  const onError = (message: string) => {
    node?.removeAttribute('aria-busy');
    showError(name, message);
  };

  update_theme({ theme: themeData, onSuccess, onError });
};

const showError = (themeName: string, message: string | null) => {
  const node = findNode(themeName);
  if (!node) return;

  node.querySelector('[data-slot="theme-error"]')?.remove();
  if (!message) return;

  const error = document.createElement('p');
  error.dataset.slot = 'theme-error';
  error.setAttribute('role', 'status');
  error.className = 'text-[11px] text-red-300 text-center leading-tight';
  error.textContent = message;
  node.appendChild(error);
  setTimeout(() => error.remove(), 4000);
};

const makeContainer = (theme: ThemeData, isActive: boolean): HTMLDivElement => {
  const container = document.createElement('div');
  container.tabIndex = 0;
  container.title = theme.displayName;
  container.dataset.displayName = theme.displayName;
  container.setAttribute('role', 'option');
  container.setAttribute('aria-selected', isActive.toString());
  container.classList.add(
    ...'relative grid gap-2 cursor-pointer justify-items-center min-w-36 rounded-md p-2 hover:bg-stone-500/20 has-[div[data-active=true]]:bg-stone-400/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 aria-[busy=true]:opacity-60 aria-[busy=true]:pointer-events-none'.split(
      ' '
    )
  );

  container.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectTheme(theme.name);
      return;
    }

    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const sibling = (
      e.key === 'ArrowRight' ? container.nextElementSibling : container.previousElementSibling
    ) as HTMLElement | null;
    sibling?.focus();
    sibling?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });

  return container;
};

const makeOverlay = (themeName: string, isActive = false) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.setAttribute('role', 'presentation');
  overlayDiv.dataset.name = themeName;
  overlayDiv.dataset.active = isActive.toString();
  overlayDiv.classList.add(...'theme absolute top-0 left-0 w-full h-full bg-transparent'.split(' '));
  overlayDiv.addEventListener('click', () => selectTheme(themeName));
  return overlayDiv;
};

const getElement = async (theme: ThemeData): Promise<{ element: HTMLElement; isCached: boolean }> => {
  const isCached = await wallpaperManager.isWallpaperCached(theme.name);
  const cachedUrl = isCached ? await wallpaperManager.getCachedWallpaperUrl(theme.name) : null;

  const src = cachedUrl || theme.bg || theme.thumbnailUrl || '';

  const element =
    theme.kind === 'img' ? await makeImgElement(theme, src, isCached) : await makeVidElement(theme, src, isCached);
  if (!isCached && !theme.bg) {
    element.appendChild(downloadIcon());
  }

  return { element, isCached: isCached || !!theme.bg };
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
  container.appendChild(video);

  const h3 = document.createElement('h3');
  h3.className = 'text-sm text-center';
  h3.textContent = theme.displayName;
  container.appendChild(h3);
  container.appendChild(getLiveChip());

  if (src.startsWith('./') || src.startsWith('/')) {
    const thumbnail = document.createElement('img');
    thumbnail.src = src;
    thumbnail.alt = '';
    thumbnail.className = `${video.className} blur`;
    container.insertBefore(thumbnail, video);
    video.style.display = 'none';
    video.addEventListener(
      'loadeddata',
      () => {
        thumbnail.remove();
        video.style.display = 'block';
      },
      { once: true }
    );
  } else if (isCached) {
    source.src = src;
  } else {
    try {
      source.src = await wallpaperManager.getThumbnailSrc(src);
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
  img.className = 'w-32 h-32 aspect-square object-cover rounded-md bg-stone-700/40';
  img.alt = '';
  img.loading = 'lazy';
  container.appendChild(img);

  const h3 = document.createElement('h3');
  h3.className = 'text-sm text-center';
  h3.textContent = theme.displayName;
  container.appendChild(h3);

  if (src.startsWith('./') || src.startsWith('/')) {
    img.src = src;
    if (!src.includes('exoplanets')) img.classList.add('blur');
  } else if (isCached) {
    img.src = src;
    img.classList.remove('blur');
  } else {
    try {
      img.src = await wallpaperManager.getThumbnailSrc(src);
    } catch {
      img.src = src;
    }
  }

  return container;
};

const getLiveChip = (): HTMLDivElement => {
  const chip = document.createElement('div');
  chip.classList.add(
    ...'absolute top-2 right-2 bg-blue-500/50 backdrop-blur-2xl border border-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold select-none pointer-events-none'.split(
      ' '
    )
  );
  chip.textContent = 'Live';
  return chip;
};

const downloadIcon = () => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const paths = ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'];
  paths.forEach((d) => {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  });

  svg.setAttribute('id', 'download-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute(
    'class',
    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-75 pointer-events-none drop-shadow'
  );

  return svg;
};
