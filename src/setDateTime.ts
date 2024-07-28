import gsap from 'gsap';

export const setDateTime = () => {
  const dateTime = document.getElementById('date-time') as HTMLDivElement;
  const date = document.getElementById('date') as HTMLDivElement;
  const time = document.getElementById('time') as HTMLDivElement;

  date.textContent = `${new Date().toLocaleString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })}`;
  time.textContent = `${new Date().toLocaleString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true }).split(' ')[0]}`;

  gsap.fromTo(
    dateTime,
    { y: window.innerHeight / 3, opacity: 0, scale: 0 },
    {
      y: window.innerHeight / 9,
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: 1,
      ease: 'power3.inOut',
    }
  );

  // ////

  const shortcuts = document.getElementById('shortcuts') as HTMLDivElement;

  chrome.topSites.get((topSites) => {
    displayTopSites(topSites);
  });

  function displayTopSites(sites: Array<chrome.topSites.MostVisitedURL>) {
    shortcuts.innerHTML = '';
    sites.forEach((site) => {
      const link = createSiteElement(site);
      shortcuts.appendChild(link);
    });
  }

  function createSiteElement(site: chrome.topSites.MostVisitedURL) {
    const link = document.createElement('a');
    link.setAttribute('class', 'shortcut-item');
    link.href = site.url;

    link.innerHTML = `
        <li style="max-width: 24px">
            <img
                class="shortcut-icon"
                src=${yoChromeGiveMeSomeOfThatShit(site.url)}
                alt="favicon"
            />
        </li>
        <p
            class="shortcut-name"
        >
            ${site.title}
        </p>
    `;

    return link;
  }

  function yoChromeGiveMeSomeOfThatShit(u: string) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u);
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
    }
  );

  window.onresize = () =>
    (shortcuts.style.transform = `translate(-50%, ${window.innerHeight / 1.2}px)`);
};
