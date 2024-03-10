document.addEventListener("contextmenu", function (click) {
    click.preventDefault();

    const menu_width = 270;
    const menu_height = 230;

    menu.style.display = "flex";
    menu.style.top = `${
        click.clientY + menu_height > window.innerHeight
            ? click.clientY - menu_height
            : click.clientY
    }px`;

    menu.style.left = `${
        click.clientX + menu_width > window.innerWidth
            ? click.clientX - menu_width
            : click.clientX
    }px`;
});

document.addEventListener("click", hide_menu);

function hide_menu(click) {
    if (!menu.contains(click.target)) {
        menu.style.display = "none";
    }
}
