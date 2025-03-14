/// <reference types="chrome"/>

declare namespace chrome.topSites {
  interface MostVisitedURL {
    url: string;
    title: string;
  }

  function get(callback: (data: MostVisitedURL[]) => void): void;
}

declare namespace chrome.downloads {
  interface DownloadItem {
    id: number;
    url: string;
    filename: string;
    state: 'in_progress' | 'interrupted' | 'complete';
    bytesReceived: number;
    totalBytes: number;
    fileSize: number;
    startTime: string;
    error?: string;
    mime?: string;
  }

  function search(
    query: {
      query?: string[];
      limit?: number;
      orderBy?: string[];
      url?: string;
      filename?: string;
      state?: string;
    },
    callback: (results: DownloadItem[]) => void
  ): void;

  function open(downloadId: number): void;

  function show(downloadId: number): void;

  interface DownloadCreateEvent
    extends chrome.events.Event<(downloadItem: DownloadItem) => void> {}

  const onCreated: DownloadCreateEvent;
}
