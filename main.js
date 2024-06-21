const time = document.getElementById("time");
const date = document.getElementById("date");

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
