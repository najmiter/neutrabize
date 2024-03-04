const clock = document.getElementById("clock");
const greeting_msg = document.getElementById("greeting-msg");
update_time();

setInterval(update_time, 60 * 1000);

const hour = new Date().getHours();

if (hour <= 6) {
    greeting_msg.textContent = "Hello there!";
} else if (hour < 12 && hour > 6) {
    greeting_msg.textContent = "Good morning to me.";
} else if (hour < 14) {
    greeting_msg.textContent = "Good afternoon to me.";
} else if (hour < 20) {
    greeting_msg.textContent = "Good evening to me.";
} else {
    greeting_msg.textContent = "Good night to me.";
}

function update_time() {
    const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    clock.textContent = time;
}
