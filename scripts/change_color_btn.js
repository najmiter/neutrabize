const change_color_btn = document.getElementById("change-color-btn");
const change_color_input = document.getElementById("change-color-input");

change_color_btn.addEventListener("click", function () {
    change_color_input.click();
    change_color_input.value = document
        .getElementsByTagName("html")[0]
        .style.getPropertyValue("--main-color");

    change_color_input.oninput = function () {
        set_main_color(change_color_input.value);

        localStorage.setItem("neutrabize_TEXTCOLOR", change_color_input.value);
    };
});
