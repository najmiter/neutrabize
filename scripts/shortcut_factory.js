const links = ["google", "youtube", "facebook", "github", "x", "instagram"];

function render_shortcuts() {
    if (show_shortcuts) {
        shortcuts.style.display = "flex";
        links.forEach((item) =>
            shortcuts.appendChild(create_shortcut_item(item, item))
        );
        const add_btn = document.createElement("button");
        add_btn.setAttribute("class", "shortcut-item add-shortcut-btn");
        add_btn.textContent = "+";
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
    <a href="https://${link}.com" class="shortcut-link"
        ><img
            class="shortcut-icon"
            src="imgs/icons/${name}.png"
            alt="${name} icon"
        /></a>
    `;

    return shortcut_item;
}
