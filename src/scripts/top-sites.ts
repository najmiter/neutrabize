import { shortcuts } from './globals';

interface Site {
  url: string;
  title: string;
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.topSites.get((topSites) => {
    displayTopSites(topSites);
  });
});

function displayTopSites(sites: chrome.topSites.MostVisitedURL[]): void {
  shortcuts.innerHTML = '';
  sites.forEach((site) => {
    const link = createSiteElement(site);
    shortcuts.appendChild(link);
  });
}

function createSiteElement(site: Site): HTMLAnchorElement {
  const link = document.createElement('a');

  link.setAttribute(
    'class',
    'flex flex-col items-center gap-3 hover:text-blue-400 group relative animate-enter origin-bottom'
  );

  link.href = site.url;

  link.innerHTML = `
    <li class="max-w-[40px]">
      <img
        class="hover:bg-slate-800/50 hover:backdrop-blur-sm rounded-md p-2 min-w-[40px]"
        src=${yoChromeGiveMeSomeOfThatShit(site.url)}
        alt="favicon"
      />
    </li>
    <p
      class="text-xs text-violet-100 bg-stone-800 border border-stone-500 py-1 px-3 rounded hidden group-hover:block absolute left-1/2 -translate-x-1/2 -top-9 overflow-hidden max-w-40 whitespace-nowrap overflow-ellipsis"
    >
      ${site.title}
    </p>
  `;

  return link;
}

function yoChromeGiveMeSomeOfThatShit(u: string): string {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', u);
  url.searchParams.set('size', '64');
  return url.toString();
}
