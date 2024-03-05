const menu = document.getElementById("menu");

document.addEventListener("contextmenu", function (click) {
    click.preventDefault();

    menu.style.display = "flex";
    menu.style.top = `${click.clientY}px`;
    menu.style.left = `${click.clientX}px`;
});

document.addEventListener("click", hide_menu);

function hide_menu(click) {
    if (!menu.contains(click.target)) {
        menu.style.display = "none";
    }
}
