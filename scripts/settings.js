const settingsBtn = document.getElementById("settings-btn");
const settingsWrapper = document.getElementById("settings-wrapper");
const settingsContent = document.getElementById("settings-content");
const toggleQuote = document.getElementById("toggle-quote");
const toggleShortcuts = document.getElementById("toggle-shortcuts");

document.addEventListener("click", (e) => {
    if (!document.getElementById("settings").contains(e.target)) {
        hideSettings();
    }
});

settingsBtn.addEventListener("click", () => {
    const themes = document.querySelectorAll("#themes>div");

    if (window.getComputedStyle(settingsWrapper).height !== "0px") {
        themes.forEach((theme) => {
            theme.classList.remove("animate-come-in");
            theme.classList.add("animate-come-out");
        });
        hideSettings();
    } else {
        themes.forEach((theme) => {
            theme.classList.remove("animate-come-out");
            theme.style.opacity = 0;
            setTimeout(() => theme.classList.add("animate-come-in"), 130);
        });
        settingsWrapper.style.height = "366px";
        settingsWrapper.style.padding = "16px";
        settingsContent.style.display = "grid";
    }
});

toggleQuote.addEventListener("click", () => {
    const toggle = document.getElementById("show-quote-toggle");

    toggle.dataset.on = toggle.dataset.on === "false";

    quote.classList.toggle("animate-away");
    setTimeout(
        () => {
            quote.style.display =
                toggle.dataset.on === "true" ? "block" : "none";
        },
        quote.classList.contains("animate-away") ? 400 : 0
    );

    localStorage.setItem("neutrabize_SHOULDSHOWQUOTE", toggle.dataset.on);
});

toggleShortcuts.addEventListener("click", () => {
    const toggle = document.getElementById("show-shortcuts-toggle");
    const shortcutsBar = document.getElementById("shortcuts-bar");

    toggle.dataset.on = toggle.dataset.on === "false";

    const shortcuts = document.getElementById("shortcuts");
    shortcuts.classList.toggle("animate-away");
    setTimeout(
        () => {
            shortcutsBar.dataset.show = toggle.dataset.on;
        },
        shortcuts.classList.contains("animate-away") ? 400 : 0
    );

    localStorage.setItem("neutrabize_SHOULDSHOWSHORTCUTS", toggle.dataset.on);
});

function hideSettings() {
    settingsWrapper.style.height = 0;
    settingsWrapper.style.padding = 0;
    settingsContent.style.display = "none";
}
