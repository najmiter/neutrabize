document.addEventListener('DOMContentLoaded', () => {
  chrome.topSites.get((topSites) => {
    displayTopSites(topSites);
  });
});

function displayTopSites(sites) {
  shortcuts.innerHTML = '';
  sites.forEach((site) => {
    const link = createSiteElement(site);
    shortcuts.appendChild(link);
  });
}

function createSiteElement(site) {
  const link = document.createElement('a');

  link.setAttribute('class', 'shortcuts__link group');

  link.href = site.url;

  link.innerHTML = `
    <li class="shortcuts__link-item">
        <img
            class="shortcuts__link-item-img"
            src=${yoChromeGiveMeSomeOfThatShit(site.url)}
            alt="favicon"
        />
    </li>
    <p class="shortcuts__link-item-title">
        ${site.title}
    </p>
    `;

  return link;
}

function yoChromeGiveMeSomeOfThatShit(u) {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', u);
  url.searchParams.set('size', '64');
  return url.toString();
}
