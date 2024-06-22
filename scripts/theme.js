const themesData = {
    city: {
        classes: {
            date: ["theme__city-date", "theme__date"],
            time: ["theme__city-time", "theme__time"],
        },
        bg: "./imgs/bg/night2.jpg",
    },
    alienet: {
        classes: {
            date: ["theme__alienet-date", "theme__date"],
            time: ["theme__alienet-time", "theme__time"],
        },
        bg: "./imgs/bg/ai-mountain.jpg",
    },
};

const themes = document.querySelectorAll(".theme");

themes?.forEach((theme) => {
    theme.addEventListener("click", ({ target }) => {
        const {
            dataset: { name },
        } = target;

        if (!themesData[name]) return;

        updateTheme(themesData[name]);

        localStorage.setItem(
            "neutrabize_THEMEDATA",
            JSON.stringify(themesData[name])
        );
    });
});
