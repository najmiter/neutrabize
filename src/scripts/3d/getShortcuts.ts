import gsap from 'gsap';

const MAX_SHORTCUTS = 12;

export const getShortcuts = ({ onComplete }: { onComplete?: () => void } = {}) => {
  const shortcuts = document.getElementById('threed-shortcuts') as HTMLElement | null;
  if (!shortcuts) return;

  chrome?.topSites?.get((topSites) => {
    displayTopSites(topSites ?? []);
  });

  function displayTopSites(sites: Array<chrome.topSites.MostVisitedURL>) {
    shortcuts!.replaceChildren(...sites.slice(0, MAX_SHORTCUTS).map(createSiteElement));
  }

  function hostOf(url: string) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  function createSiteElement(site: chrome.topSites.MostVisitedURL) {
    const label = site.title?.trim() || hostOf(site.url);

    const item = document.createElement('li');

    const link = document.createElement('a');
    link.className = 'shortcut-item';
    link.href = site.url;
    link.setAttribute('aria-label', label);

    const img = document.createElement('img');
    img.className = 'shortcut-icon';
    img.src = faviconUrl(site.url);
    img.alt = '';
    img.width = 24;
    img.height = 24;
    img.loading = 'lazy';
    img.addEventListener(
      'error',
      () => {
        const fallback = document.createElement('span');
        fallback.className = 'shortcut-icon shortcut-fallback';
        fallback.textContent = label.charAt(0) || '?';
        fallback.setAttribute('aria-hidden', 'true');
        img.replaceWith(fallback);
      },
      { once: true }
    );
    link.appendChild(img);

    const name = document.createElement('p');
    name.className = 'shortcut-name';
    name.textContent = label;
    name.setAttribute('aria-hidden', 'true');
    link.appendChild(name);

    item.appendChild(link);
    return item;
  }

  function faviconUrl(pageUrl: string) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', pageUrl);
    url.searchParams.set('size', '24');
    return url.toString();
  }

  gsap.fromTo(
    shortcuts,
    { y: window.innerHeight / 2, opacity: 0, scale: 0, x: '-50%' },
    {
      y: window.innerHeight / 1.2,
      x: '-50%',
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: 1,
      ease: 'power3.inOut',
      onComplete,
    }
  );

  window.addEventListener('resize', () => {
    shortcuts.style.transform = `translate(-50%, ${window.innerHeight / 1.2}px)`;
  });
};
