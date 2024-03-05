const toggle_animations_btn = document.getElementById("toggle-animations-btn");
toggle_animations_btn.addEventListener("click", function () {
    menu.style.display = "none";
    toggle_animations();
});

function toggle_animations() {
    meteor.setAttribute(
        "aria-should-play",
        `${meteor.getAttribute("aria-should-play") !== "true"}`
    );
}

function play_animations() {
    if (meteor.getAttribute("aria-should-play") === "true") {
        meteor.classList.toggle("fall");
    }
}
