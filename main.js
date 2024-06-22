const time = document.getElementById("time");
const date = document.getElementById("date");

const shouldShowQuote = localStorage.getItem("neutrabize_SHOULDSHOWQUOTE");
const shouldShowShortcuts = localStorage.getItem(
    "neutrabize_SHOULDSHOWSHORTCUTS"
);

if (shouldShowQuote === "true") {
    const quote = document.getElementById("quote");
    const toggle = document.getElementById("show-quote-toggle");

    toggle.dataset.on = "true";
    quote.style.display = "block";
    quote.classList.remove("animate-away");
}

if (shouldShowShortcuts === "false") {
    const toggle = document.getElementById("show-shortcuts-toggle");
    const shortcutsBar = document.getElementById("shortcuts-bar");

    toggle.dataset.on = "false";
    shortcutsBar.dataset.show = "false";
} else document.getElementById("shortcuts").classList.remove("animate-away");

date.textContent = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
});

function updateTime() {
    const now = new Date()
        .toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .split(" ")
        .at(0);

    time.textContent = now;
}

updateTime();
update_weather();

setInterval(updateTime, 1 * 1000);
