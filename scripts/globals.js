const date = document.getElementById('date');
const time = document.getElementById('time');
const wallpaper = document.getElementById('wallpaper');
const quote = document.getElementById('quote');
const shortcuts = document.getElementById('shortcuts');
const themes = document.querySelectorAll('.theme');
const batteryContainer = document.getElementById('battery-container');
const video = document.getElementById('live-wallpaper-vid');
const source = document.getElementById('live-wallpaper-src');

function updateTheme(theme) {
  date.setAttribute('class', theme.classes.date.join(' '));
  time.setAttribute('class', theme.classes.time.join(' '));

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
