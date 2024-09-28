const downloadsContainer = document.querySelector(
  '#downloads'
) as HTMLDivElement;

const container = document.querySelector(
  '#downloads-container'
) as HTMLDivElement;
const trigger = document.querySelector(
  '#downloads-trigger'
) as HTMLButtonElement;
const chevron = document.querySelector('#chevron') as HTMLSpanElement;

trigger.addEventListener('click', handleDownloads);
handleDownloads();

function handleDownloads() {
  const isOpen = trigger.dataset.isopened === 'true';
  if (isOpen) {
    chevron.style.rotate = '0deg';
    container.style.opacity = `1`;
    container.style.width = `384px`;
    downloadsContainer.style.display = 'flex';
    container.style.height = `${window.innerHeight - 40}px`;
  } else {
    chevron.style.rotate = '180deg';
    container.style.opacity = `0.5`;
    container.style.width = `fit-content`;
    downloadsContainer.style.display = 'none';
    container.style.height = `${trigger.getBoundingClientRect().height + 8 + 8}px`;
  }
  trigger.dataset.isopened = String(!isOpen);
}

chrome.downloads.search({}, function (downloads) {
  let i = 0;
  downloadsContainer.innerHTML = '';

  downloads.forEach((file) => {
    const filename = file.filename.split('/').pop();
    if (file.exists && filename) {
      const date = new Date(file.startTime).toLocaleDateString('en-us', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
      i++;
      const downloadFile = document.createElement('div');
      downloadFile.classList.add('download-file');
      downloadFile.innerHTML = `
        <img src="${getFileIcon(file.filename)}" alt="" class="w-12" />
        <div class="grid gap-1">
          <h1 class="font-normal text-sm">${filename.slice(0, 50) + (filename.length > 50 ? '...' : '')}</h1>
          <p class="text-xs font-light text-gray-200">${date}</p>
        </div>
      `;

      downloadFile.addEventListener('click', function () {
        chrome.downloads.open(file.id);
      });
      downloadsContainer.appendChild(downloadFile);
    }
  });
});

function getFileIcon(filename: string) {
  const nuktaLocation = filename.lastIndexOf('.');
  const extension = filename.substring(nuktaLocation + 1).toLowerCase();
  const name = extensionToName.get(extension);
  if (name) {
    return nameToIcon.get(name);
  }

  return '/files/file.png';
}

type IconName = 'pdf' | 'document' | 'video' | 'image';
const nameToIcon = new Map<IconName, string>([
  ['pdf', '/files/pdf.png'],
  ['document', '/files/document.png'],
  ['video', '/files/video.png'],
  ['image', '/files/image.png'],
]);

const extensionToName = new Map<string, IconName>([
  ['pdf', 'pdf'],
  ['doc', 'document'],
  ['docx', 'document'],
  ['mp4', 'video'],
  ['mkv', 'video'],
  ['flv', 'video'],
  ['mov', 'video'],
  ['jpg', 'image'],
  ['jpeg', 'image'],
  ['webp', 'image'],
  ['png', 'image'],
  ['gif', 'image'],
]);
