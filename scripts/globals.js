const date = document.getElementById("date");
const time = document.getElementById("time");
const wallpaper = document.getElementById("wallpaper");
const quote = document.getElementById("quote");
const shortcuts = document.getElementById("shortcuts");
const themes = document.querySelectorAll(".theme");
const batteryContainer = document.getElementById("battery-container");

function updateTheme(theme) {
    date.setAttribute("class", theme.classes.date.join(" "));
    time.setAttribute("class", theme.classes.time.join(" "));
    wallpaper.src = theme.bg;
}
