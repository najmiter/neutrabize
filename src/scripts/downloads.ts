import { downloadsPanel } from './globals';

const downloadsList = document.getElementById('downloads-list') as HTMLElement;
const refreshBtn = document.getElementById('downloads-refresh') as HTMLButtonElement | null;

let visible = false;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function initDownloads(): void {
  if (typeof chrome === 'undefined' || !chrome.downloads) return;

  chrome.downloads.onCreated.addListener(scheduleRefresh);
  chrome.downloads.onChanged?.addListener(scheduleRefresh);

  refreshBtn?.addEventListener('click', () => loadRecentDownloads());
}

function scheduleRefresh(): void {
  if (!visible) return;
  if (refreshTimer) return;
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    loadRecentDownloads();
  }, 400);
}

export function toggleDownloads(show: boolean): void {
  visible = show;
  downloadsPanel.dataset.on = show.toString();

  if (show) {
    loadRecentDownloads();
    downloadsPanel.classList.remove('hidden');
    downloadsPanel.classList.remove('animate-away');
  } else {
    downloadsPanel.classList.add('animate-away');
    setTimeout(() => {
      if (!visible) downloadsPanel.classList.add('hidden');
    }, 400);
  }
}

function loadRecentDownloads(): void {
  if (typeof chrome === 'undefined' || !chrome.downloads) return;

  chrome.downloads.search({ limit: 30, orderBy: ['-startTime'] }, (downloads) => {
    displayDownloads(downloads ?? []);
  });
}

function displayDownloads(downloads: chrome.downloads.DownloadItem[]): void {
  if (!downloadsList) return;

  if (downloads.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-gray-400 text-sm';
    empty.textContent = 'No recent downloads';
    downloadsList.replaceChildren(empty);
    return;
  }

  downloadsList.replaceChildren(...downloads.map((download, i) => createDownloadElement(download, i)));
}

function baseName(path: string): string {
  return path.split(/[/\\]/).pop() || 'Unknown file';
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

function badge(text: string, classes: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = `text-xs px-1.5 py-0.5 rounded ${classes}`;
  span.textContent = text;
  return span;
}

function statusBadge(download: chrome.downloads.DownloadItem): HTMLSpanElement {
  if (download.state === 'complete' && download.exists === false) {
    return badge('Deleted', 'bg-red-500/20 text-red-400');
  }
  if (download.state === 'complete') {
    return badge('Complete', 'bg-green-500/20 text-green-400');
  }
  if (download.state === 'in_progress') {
    if (download.paused) return badge('Paused', 'bg-yellow-500/20 text-yellow-400');
    const total = download.totalBytes;
    const progress = total > 0 ? Math.round((download.bytesReceived / total) * 100) : 0;
    return badge(total > 0 ? `${progress}%` : formatBytes(download.bytesReceived), 'bg-blue-500/20 text-blue-400');
  }
  return badge('Interrupted', 'bg-red-500/20 text-red-400');
}

function createDownloadElement(download: chrome.downloads.DownloadItem, index: number): HTMLDivElement {
  const item = document.createElement('div');
  item.className = 'flex items-center gap-3 p-2 download-item rounded-md hover:bg-slate-700/30';
  item.style.setProperty('--item-delay', `${index * 50}ms`);

  const fileName = baseName(download.filename);
  const fileExt = fileName.includes('.') ? (fileName.split('.').pop() as string) : '';

  const icon = document.createElement('div');
  icon.className = 'min-w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded';
  icon.setAttribute('aria-hidden', 'true');
  const iconLabel = document.createElement('span');
  iconLabel.className = 'uppercase text-xs font-semibold';
  iconLabel.textContent = fileExt ? fileExt.slice(0, 3) : '📁';
  icon.appendChild(iconLabel);
  item.appendChild(icon);

  const body = document.createElement('div');
  body.className = 'flex flex-col overflow-hidden flex-1';

  const name = document.createElement('p');
  name.className = 'text-sm text-violet-100 truncate';
  name.textContent = fileName;
  body.appendChild(name);

  const meta = document.createElement('div');
  meta.className = 'flex items-center justify-between gap-2 text-xs text-gray-400';

  const when = document.createElement('span');
  const started = new Date(download.startTime);
  const size = formatBytes(download.totalBytes || download.fileSize);
  when.textContent = Number.isNaN(started.getTime())
    ? size
    : [started.toLocaleDateString('en-us', { month: 'short', day: 'numeric' }), size].filter(Boolean).join(' · ');
  meta.appendChild(when);
  meta.appendChild(statusBadge(download));
  body.appendChild(meta);

  if (download.state === 'in_progress' && download.totalBytes > 0) {
    const track = document.createElement('div');
    track.className = 'mt-1 h-0.5 w-full rounded-full bg-slate-600/50 overflow-hidden';
    const bar = document.createElement('div');
    bar.className = 'h-full bg-blue-400 transition-[width] duration-300';
    bar.style.width = `${Math.round((download.bytesReceived / download.totalBytes) * 100)}%`;
    track.appendChild(bar);
    body.appendChild(track);
  }

  item.appendChild(body);

  const openable = download.state === 'complete' && download.exists !== false;
  if (openable) {
    const open = () => chrome.downloads.open(download.id);
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.style.cursor = 'pointer';
    item.title = `Open ${fileName}`;
    item.ariaDisabled = 'false';
  } else {
    item.ariaDisabled = 'true';
    item.style.cursor = 'default';
    item.title = fileName;
  }

  return item;
}
