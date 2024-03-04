const clock = document.getElementById("clock");
const greeting_msg = document.getElementById("greeting-msg");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const meridiem = document.getElementById("meridiem");
const mkhi = document.getElementById("mkhi");

update_time();

setInterval(update_time, 1 * 1000);

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
    const time = new Date();

    const [pm, h] = get_hours(time.getHours());
    const m = suuii(time.getMinutes());

    hours.textContent = h;
    mkhi.classList.toggle("vis-none");
    minutes.textContent = m;
    meridiem.textContent = pm ? "PM" : "AM";
}

function get_hours(hrs) {
    let dopehr = false;
    if (hrs !== 12) {
        hrs %= 12;
    }

    dopehr = hrs >= 12;

    return [dopehr, suuii(hrs)];
}

function suuii(thing) {
    if (thing < 10) {
        thing = `0${thing}`;
    }

    return thing;
}
