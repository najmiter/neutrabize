const hide_show_shortcuts = document.getElementById("hide-show-shortcut-btn");

hide_show_shortcuts.addEventListener("click", function () {
    menu.style.display = "none";
    show_shortcuts = !show_shortcuts;
    render_shortcuts();

    localStorage.setItem("neutrabize_SHOWSHORTCUTS", show_shortcuts);
});
