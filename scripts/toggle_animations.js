const toggle_animations_btn = document.getElementById("toggle-animations-btn");
toggle_animations_btn.addEventListener("click", function () {
    toggle_animations();
});

function toggle_animations() {
    const what = meteor.getAttribute("aria-should-play") !== "true";
    meteor.setAttribute("aria-should-play", `${what}`);
    toggle_animations_btn.setAttribute("data-isOn", what);
    localStorage.setItem("neutrabize_ANIMATE", what);
    show_message("Animation settings updated");
}

function play_animations() {
    if (meteor.getAttribute("aria-should-play") === "true") {
        meteor.classList.toggle("fall");
    }
}
