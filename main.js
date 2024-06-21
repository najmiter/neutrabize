const time = document.getElementById("time");
const date = document.getElementById("date");

const shouldShowQuote = localStorage.getItem("neutrabize_SHOULDSHOWQUOTE");

if (shouldShowQuote && shouldShowQuote === "true") {
    const quote = document.getElementById("quote");
    const toggle = document.getElementById("show-quote-toggle");
    quote.classList.remove("animate-away");
    toggle.dataset.on = "true";
    quote.style.display = "block";
}

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
