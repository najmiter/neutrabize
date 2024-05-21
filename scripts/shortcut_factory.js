const links = [
    { icon: "imgs/icons/google.png", link: "www.google.com" },
    { icon: "imgs/icons/youtube.png", link: "www.youtube.com" },
    { icon: "imgs/icons/facebook.png", link: "www.facebook.com" },
    { icon: "imgs/icons/github.png", link: "www.github.com" },
    { icon: "imgs/icons/x.png", link: "www.x.com" },
    { icon: "imgs/icons/instagram.png", link: "www.instagram.com" },
];
const add_shortcut_dialog = document.getElementById("add-shortcut-dialog");
const add_shortcut_btn = document.getElementById("add-shortcut-btn");
const shortcut_link_input = document.getElementById("shortcut-link-input");
const shortcut_icon_input = document.getElementById("shortcut-icon-input");

const add_btn = document.createElement("button");
add_btn.setAttribute("class", "shortcut-item add-shortcut-btn");
add_btn.textContent = "+";
add_btn.addEventListener("click", () => {
    add_shortcut_dialog.showModal();
});

add_shortcut_btn.addEventListener("click", () => {
    const shortcut_link = shortcut_link_input.value;
    const shortcut_icon = shortcut_icon_input.value;
    if (shortcut_link) {
        add_shortcut_dialog.close();

        stored_shortcuts.push({ icon: shortcut_icon, link: shortcut_link });
        localStorage.setItem(
            "neutrabize_SHORTCUTS",
            JSON.stringify(stored_shortcuts)
        );

        render_shortcuts();
    }
});

let stored_shortcuts = localStorage.getItem("neutrabize_SHORTCUTS");

if (!stored_shortcuts) {
    localStorage.setItem("neutrabize_SHORTCUTS", JSON.stringify(links));
    stored_shortcuts = localStorage.getItem("neutrabize_SHORTCUTS");
}

stored_shortcuts = JSON.parse(stored_shortcuts);
render_shortcuts();

function render_shortcuts() {
    if (show_shortcuts) {
        shortcuts.style.display = "flex";
        shortcuts.innerHTML = ``;

        stored_shortcuts?.forEach(({ icon, link }) =>
            shortcuts.appendChild(create_shortcut_item(link, icon))
        );

        shortcuts.appendChild(add_btn);
    } else {
        shortcuts.style.display = "none";
        shortcuts.innerHTML = "";
    }
}

function create_shortcut_item(link, name) {
    const shortcut_item = document.createElement("div");
    shortcut_item.setAttribute("class", "shortcut-item");

    shortcut_item.innerHTML = `
    <a href="${link}" class="shortcut-link"
        >${
            name
                ? `<img
            class="shortcut-icon"
            src="${name}"
            alt="icon"
        />`
                : `<p class="shortcut-icon-default">🌏</p>`
        }</a>
    `;

    return shortcut_item;
}
