import { wallpaper } from './globals';
import { setTime } from './utils';

if (wallpaper) {
  const hour = new Date().getHours();
  wallpaper.src = hour <= 6 || hour > 18 ? '/night.mp4' : '/day.mp4';
}

setTime();
setInterval(setTime, 1000);
