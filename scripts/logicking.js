function update_time() {
    const time = new Date();

    const [pm, h] = get_hours(time.getHours());
    const m = suuii(time.getMinutes());

    hours.textContent = h;
    mkhi.classList.toggle("vis-hid");
    minutes.textContent = m;
    meridiem.textContent = pm ? "PM" : "AM";
}

function get_hours(hrs) {
    let dopehr = hrs >= 12;

    if (hrs !== 12) {
        hrs %= 12;
    }

    return [dopehr, suuii(hrs)];
}

function suuii(thing) {
    if (thing < 10) {
        thing = `0${thing}`;
    }

    return thing;
}

function update_greeting_msg() {
    const hour = new Date().getHours();
    if (hour <= 6) {
        greeting_msg.textContent = "Good night";
    } else if (hour < 12 && hour > 6) {
        greeting_msg.textContent = "Good morning";
    } else if (hour < 14) {
        greeting_msg.textContent = "Good afternoon";
    } else if (hour < 19) {
        greeting_msg.textContent = "Good evening";
    } else {
        greeting_msg.textContent = "Good night";
    }
}

username_input.addEventListener("input", (e) => {
    const input = e.target.value;
    localStorage.setItem("neutrabize_USERNAME", input);
});

username_input.addEventListener(
    "blur",
    remove_username_input_and_replace_with_div
);
