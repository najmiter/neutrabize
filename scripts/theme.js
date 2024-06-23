const themesData = {
    city: {
        name: "city",
        classes: {
            date: ["theme__city-date", "theme__date"],
            time: ["theme__city-time", "theme__time"],
        },
        bg: "./imgs/bg/night2.jpg",
    },
    alienet: {
        name: "alienet",
        classes: {
            date: ["theme__alienet-date", "theme__date"],
            time: ["theme__alienet-time", "theme__time"],
        },
        bg: "./imgs/bg/ai-mountain.jpg",
    },
    jant: {
        name: "jant",
        classes: {
            date: ["theme__jant-date", "theme__date"],
            time: ["theme__jant-time", "theme__time"],
        },
        bg: "./imgs/bg/jant.jpg",
    },
    dusk: {
        name: "dusk",
        classes: {
            date: ["theme__dusk-date", "theme__date"],
            time: ["theme__dusk-time", "theme__time"],
        },
        bg: "./imgs/bg/dusk.jpg",
    },
};

if (!localStorage.getItem("neutrabize_THEMEDATA"))
    localStorage.setItem(
        "neutrabize_THEMEDATA",
        JSON.stringify(themesData.alienet)
    );

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

        themes.forEach(
            (theme) => (theme.dataset.active = theme.dataset.name === name)
        );
    });
});
