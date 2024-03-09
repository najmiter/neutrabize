const clock = document.getElementById("clock");
const greeting_msg = document.getElementById("greeting-msg");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const meridiem = document.getElementById("meridiem");
const mkhi = document.getElementById("mkhi");
const date = document.getElementById("date");
const name = document.getElementById("name");
const meteor = document.getElementById("meteor");
const menu = document.getElementById("menu");
const shortcuts = document.getElementById("shortcuts");
let show_shortcuts = true;

function update_bg(img) {
    document
        .getElementById("jism")
        .style.setProperty(
            "background",
            `center / cover no-repeat url(${img})`
        );

    localStorage.setItem("neutrabize_BGIMG", img);
}

function set_main_color(color) {
    document
        .getElementsByTagName("html")[0]
        .style.setProperty("--main-color", `${color}`);
}

function read_bg_from_localStorage() {
    const img = localStorage.getItem("neutrabize_BGIMG");
    if (img) update_bg(img);
}

function get_name_from_localStorage() {
    name.textContent =
        localStorage.getItem("neutrabize_NAME") ?? name.textContent;
}

function get_animations_toggle_from_localStorage() {
    const animate = localStorage.getItem("neutrabize_ANIMATE");
    meteor.setAttribute("aria-should-play", `${animate === "true"}`);
}

function get_main_color_from_localStorage() {
    const main_color = localStorage.getItem("neutrabize_TEXTCOLOR");
    if (main_color) set_main_color(main_color);
}

function get_show_shortcuts_from_localStorage() {
    const should = localStorage.getItem("neutrabize_SHOWSHORTCUTS");
    if (should) show_shortcuts = should === "true";
}

function read_localStorage() {
    get_name_from_localStorage();
    read_bg_from_localStorage();
    get_animations_toggle_from_localStorage();
    get_main_color_from_localStorage();
    get_show_shortcuts_from_localStorage();
}
