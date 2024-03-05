date.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
});

update_time();
update_greeting_msg();
get_name_from_localStorage();
read_bg_from_localStorage();

name.addEventListener("input", function () {
    if (name.textContent.length >= 25) {
        get_name_from_localStorage();
    }
    localStorage.setItem("neutrabize_NAME", name.textContent);
});

setInterval(update_time, 1 * 1000);
setInterval(play_animations, 3 * 1000);
