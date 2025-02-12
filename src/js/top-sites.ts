function faviconURL(u: string) {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', u);
  url.searchParams.set('size', '64');
  return url.toString();
}

chrome.topSites.get((sites: chrome.topSites.MostVisitedURL[]) => {
  const shortcuts = document.querySelector('#shortcuts') as HTMLUListElement;
  shortcuts.innerHTML = '';
  return;
  sites.forEach((site, i) => {
    shortcuts.innerHTML += `
      <li class="cursor-pointer rounded-lg p-1.5 bg-stone-800 transition-all opacity-0 animate-get-in hover:bg-stone-600"
        style="animation-delay: ${i * 70}ms"
      >
        <a href=${site.url}
          ><img
            width="28"
            alt=${site.title}
            src=${faviconURL(site.url)}
        /></a>
      </li>
      `;
  });
});
