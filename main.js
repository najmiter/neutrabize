const clock = document.getElementById("clock");
update_time();

setInterval(update_time, 1 * 1000);

function update_time() {
    const time = new Date();
    clock.textContent = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}
