import { downloadsPanel } from './globals';

const downloadsList = document.getElementById('downloads-list') as HTMLElement;

export function initDownloads(): void {
  if (!chrome) return;
  loadRecentDownloads();

  if (chrome.downloads) {
    chrome.downloads.onCreated.addListener(() => {
      if (downloadsPanel.classList.contains('hidden')) return;
      loadRecentDownloads();
    });
  }
}

export function toggleDownloads(show: boolean): void {
  if (show) {
    loadRecentDownloads();
    downloadsPanel.classList.remove('hidden');
    downloadsPanel.classList.remove('animate-away');
  } else {
    downloadsPanel.classList.add('animate-away');
    setTimeout(() => {
      downloadsPanel.classList.add('hidden');
    }, 400);
  }
}

function loadRecentDownloads(): void {
  if (!chrome.downloads) return;

  chrome.downloads.search(
    {
      limit: 30,
      orderBy: ['-startTime'],
    },
    (downloads) => {
      displayDownloads(downloads);
    }
  );
}

function displayDownloads(downloads: chrome.downloads.DownloadItem[]): void {
  if (!downloadsList) return;

  downloadsList.innerHTML = '';

  if (downloads.length === 0) {
    downloadsList.innerHTML = '<p class="text-gray-400">No recent downloads</p>';
    return;
  }

  downloads.forEach((download, i) => {
    const downloadItem = createDownloadElement(download, i);
    downloadsList.appendChild(downloadItem);
  });
}

function createDownloadElement(download: chrome.downloads.DownloadItem, index: number): HTMLDivElement {
  const item = document.createElement('div');
  item.className = 'flex items-center gap-3 p-2 download-item rounded-md hover:bg-slate-700/30';
  item.style.setProperty('--item-delay', `${index * 50}ms`);

  const fileName = download.filename.split('/').pop() || 'Unknown file';
  const fileExt = fileName.split('.').pop() || 'file';

  const date = new Date(download.startTime);
  const formattedDate = date.toLocaleDateString('en-us', {
    month: 'short',
    day: 'numeric',
  });

  let statusHtml = '';
  if (!download.exists) {
    statusHtml = `<span class="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Deleted</span>`;
  } else if (download.state === 'complete') {
    statusHtml = `<span class="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Complete</span>`;
  } else if (download.state === 'in_progress') {
    const progress = Math.round((download.bytesReceived / download.totalBytes) * 100) || 0;
    statusHtml = `<span class="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">${progress}%</span>`;
  } else {
    statusHtml = `<span class="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">${download.state}</span>`;
  }

  item.innerHTML = `
    <div class="min-w-[40px] h-10 flex items-center justify-center bg-slate-800/50 rounded">
      <span class="uppercase text-xs font-semibold">${fileExt.slice(0, 3) || '📁'}</span>
    </div>
    <div class="flex flex-col overflow-hidden flex-1">
      <p class="text-sm text-violet-100 truncate" title="${fileName}">${fileName}</p>
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>${formattedDate}</span>
        ${statusHtml}
      </div>
    </div>
  `;

  if (download.state === 'complete') {
    item.addEventListener('click', () => {
      if (chrome.downloads && download.id) {
        chrome.downloads.open(download.id);
      }
    });
    item.ariaDisabled = 'false';
    item.style.cursor = 'pointer';
    item.title = 'Click to open file';
  } else {
    item.ariaDisabled = 'true';
    item.style.cursor = 'not-allowed';
  }

  return item;
}
