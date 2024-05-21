const settings = document.getElementById("settings");
const settings_close = document.getElementById("settings-close");
const settings_save = document.getElementById("settings-save");
const cta_wrapper_buttons = document.querySelectorAll(".cta-wrapper button");
const settings_nav_items = document.querySelectorAll(".settings-nav-item");
const settings_btn = document.getElementById("settings-btn");
const settings_wrapper = document.querySelectorAll(".settings-wrapper");
const change_username_input = document.getElementById("change-username-input");

document.addEventListener("keydown", (key) => {
    if (key.code === "Escape") settings.style.display = "none";
});

const previous_name = localStorage.getItem("neutrabize_USERNAME");
if (previous_name) change_username_input.value = previous_name;

settings_btn.addEventListener("click", () => {
    settings.style.display = "grid";
});

cta_wrapper_buttons.forEach((btn) => {
    btn.addEventListener("click", hideSettings);
});

settings_nav_items.forEach((item) => {
    item.addEventListener("click", () => {
        settings_nav_items.forEach((_item) => {
            if (item === _item) item.setAttribute("aria-active", "true");
            else _item.setAttribute("aria-active", "false");
        });

        settings_wrapper.forEach((piece) => {
            piece.setAttribute(
                "aria-visible",
                piece.dataset.settings === item.dataset.settings
            );
        });
    });
});

function hideSettings() {
    settings.style.display = "none";
}

change_username_input.addEventListener("input", (e) => {
    const new_name = e.target.value;
    localStorage.setItem("neutrabize_USERNAME", new_name);

    document.querySelector("#username h3").textContent = new_name;
});
