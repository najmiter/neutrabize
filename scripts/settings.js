const settingsBtn = document.getElementById("settings-btn");
const settingsWrapper = document.getElementById("settings-wrapper");
const settingsContent = document.getElementById("settings-content");

document.addEventListener("click", (e) => {
    if (!document.getElementById("settings").contains(e.target)) {
        settingsWrapper.style.height = 0;
        settingsWrapper.style.padding = 0;
        settingsContent.style.display = "none";
    }
});

settingsBtn.addEventListener("click", () => {
    if (window.getComputedStyle(settingsWrapper).height !== "0px") {
        settingsWrapper.style.height = 0;
        settingsWrapper.style.padding = 0;
        settingsContent.style.display = "none";
    } else {
        settingsWrapper.style.height = "60px";
        settingsWrapper.style.padding = "16px";
        settingsContent.style.display = "flex";
    }
});

settingsWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle")) {
        handleQuoteToggle();
    }
});

function handleQuoteToggle() {
    const toggle = document.getElementById("show-quote-toggle");

    toggle.dataset.on = toggle.dataset.on === "false";

    const quote = document.getElementById("quote");
    quote.classList.toggle("animate-away");
    setTimeout(
        () => {
            quote.style.display =
                toggle.dataset.on === "true" ? "block" : "none";
        },
        quote.classList.contains("animate-away") ? 400 : 0
    );

    localStorage.setItem("neutrabize_SHOULDSHOWQUOTE", toggle.dataset.on);
}
