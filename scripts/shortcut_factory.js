const links = ["google", "youtube", "facebook", "github", "x", "instagram"];
const shortcuts = document.getElementById("shortcuts");

function render_shortcuts() {
    links.forEach((item) =>
        shortcuts.appendChild(create_shortcut_item(item, item))
    );
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
        />${name}</a
        >
    `;

    return shortcut_item;
}
