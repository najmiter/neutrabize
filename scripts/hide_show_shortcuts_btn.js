const hide_show_shortcuts = document.getElementById("hide-show-shortcut-btn");

hide_show_shortcuts.addEventListener("click", function () {
    show_shortcuts = !show_shortcuts;
    render_shortcuts();

    hide_show_shortcuts.setAttribute("data-isOn", show_shortcuts);
    localStorage.setItem("neutrabize_SHOWSHORTCUTS", show_shortcuts);
});
