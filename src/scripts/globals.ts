export const date = document.getElementById('date') as HTMLElement;
export const time = document.getElementById('time') as HTMLElement;
export const wallpaper = document.getElementById(
  'wallpaper'
) as HTMLImageElement;
export const quote = document.getElementById('quote') as HTMLElement;
export const shortcuts = document.getElementById('shortcuts') as HTMLElement;
export const themes = document.querySelectorAll('.theme');
export const batteryContainer = document.getElementById(
  'battery-container'
) as HTMLElement;
export const video = document.getElementById(
  'live-wallpaper-vid'
) as HTMLVideoElement;
export const source = document.getElementById(
  'live-wallpaper-src'
) as HTMLSourceElement;
export const downloadsPanel = document.getElementById(
  'downloads-panel'
) as HTMLElement;

interface Theme {
  bg: string;
  classes: {
    date: string[];
    time: string[];
  };
  name: string;
}

export function updateTheme(theme: Theme): void {
  date.setAttribute('class', theme.classes.date.join(' '));
  time.setAttribute('class', theme.classes.time.join(' '));

  if (theme?.name == 'beach') {
    video.style.transform = 'scaleX(-1)';
  } else {
    video.style.transform = 'scaleX(1)';
  }

  if (theme.bg.includes('.mp4')) {
    wallpaper.style.display = 'none';
    video.style.display = 'block';
    source.src = theme.bg;
    video.load();
    video.play();
  } else {
    wallpaper.src = theme.bg;
    wallpaper.style.display = 'block';
    video.style.display = 'none';
  }
}
