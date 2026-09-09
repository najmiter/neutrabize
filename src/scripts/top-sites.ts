import { shortcuts } from './globals';

const MAX_SHORTCUTS = 12;

chrome?.topSites?.get((topSites) => {
  displayTopSites(topSites ?? []);
});

function displayTopSites(sites: chrome.topSites.MostVisitedURL[]): void {
  shortcuts.replaceChildren();
  sites.slice(0, MAX_SHORTCUTS).forEach((site) => {
    shortcuts.appendChild(createSiteElement(site));
  });
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function createSiteElement(site: chrome.topSites.MostVisitedURL): HTMLLIElement {
  const label = site.title?.trim() || hostOf(site.url);

  const item = document.createElement('li');
  item.className = 'max-w-10 list-none';

  const link = document.createElement('a');
  link.className =
    'flex flex-col items-center gap-3 hover:text-blue-400 group relative animate-enter origin-bottom rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400';
  link.href = site.url;
  link.setAttribute('aria-label', label);

  const img = document.createElement('img');
  img.className = 'hover:bg-slate-800/50 hover:backdrop-blur-sm rounded-md p-2 min-w-10';
  img.src = faviconUrl(site.url);
  img.alt = '';
  img.width = 40;
  img.height = 40;
  img.loading = 'lazy';
  img.addEventListener(
    'error',
    () => {
      img.replaceWith(letterFallback(label));
    },
    { once: true }
  );
  link.appendChild(img);

  const tooltip = document.createElement('p');
  tooltip.className =
    'text-xs text-violet-100 bg-stone-800 border border-stone-500 py-1 px-3 rounded hidden group-hover:block group-focus-visible:block absolute left-1/2 -translate-x-1/2 -top-9 overflow-hidden max-w-40 whitespace-nowrap text-ellipsis pointer-events-none';
  tooltip.textContent = label;
  tooltip.setAttribute('aria-hidden', 'true');
  link.appendChild(tooltip);

  item.appendChild(link);
  return item;
}

function letterFallback(label: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className =
    'grid place-content-center min-w-10 h-10 rounded-md bg-slate-800/60 text-violet-100 text-sm font-semibold uppercase';
  span.textContent = label.charAt(0) || '?';
  span.setAttribute('aria-hidden', 'true');
  return span;
}

function faviconUrl(pageUrl: string): string {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', pageUrl);
  url.searchParams.set('size', '64');
  return url.toString();
}
