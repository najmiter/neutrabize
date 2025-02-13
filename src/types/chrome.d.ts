/// <reference types="chrome"/>

declare namespace chrome.topSites {
  interface MostVisitedURL {
    url: string;
    title: string;
  }

  function get(callback: (data: MostVisitedURL[]) => void): void;
}
