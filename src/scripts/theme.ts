import { updateTheme } from './globals';

interface ThemeData {
  name: string;
  classes: {
    date: string[];
    time: string[];
  };
  bg: string;
}

interface ThemesData {
  [key: string]: ThemeData;
}

const themesData: ThemesData = {
  city: {
    name: 'city',
    classes: {
      date: ['theme__city-date', 'theme__date'],
      time: ['theme__city-time', 'theme__time'],
    },
    bg: './imgs/bg/night2.jpg',
  },
  alienet: {
    name: 'alienet',
    classes: {
      date: ['theme__alienet-date', 'theme__date'],
      time: ['theme__alienet-time', 'theme__time'],
    },
    bg: './imgs/bg/ai-mountain.jpg',
  },
  jant: {
    name: 'jant',
    classes: {
      date: ['theme__jant-date', 'theme__date'],
      time: ['theme__jant-time', 'theme__time'],
    },
    bg: './imgs/bg/jant.jpg',
  },
  dusk: {
    name: 'dusk',
    classes: {
      date: ['theme__dusk-date', 'theme__date'],
      time: ['theme__dusk-time', 'theme__time'],
    },
    bg: './imgs/bg/dusk.jpg',
  },
  beach: {
    name: 'beach',
    classes: {
      date: ['theme__beach-date', 'theme__date'],
      time: ['theme__beach-time', 'theme__time'],
    },
    bg: './imgs/bg/video/day.mp4',
  },
  exoPlanet: {
    name: 'exoPlanet',
    classes: {
      date: ['theme__expoPlanet-date', 'theme__date'],
      time: ['theme__expoPlanet-time', 'theme__time'],
    },
    bg: './imgs/bg/video/night.mp4',
  },
};

// default theme
if (!localStorage.getItem('neutrabize_THEMEDATA'))
  localStorage.setItem(
    'neutrabize_THEMEDATA',
    JSON.stringify(themesData.exoPlanet)
  );

const themes = document.querySelectorAll<HTMLElement>('.theme');
themes?.forEach((theme) => {
  theme.addEventListener('click', ({ target }) => {
    const element = target as HTMLElement;
    const name = element.dataset.name;

    if (!name || !themesData[name]) return;

    updateTheme(themesData[name]);

    localStorage.setItem(
      'neutrabize_THEMEDATA',
      JSON.stringify(themesData[name])
    );

    themes.forEach(
      (theme) =>
        (theme.dataset.active = (theme.dataset.name === name).toString())
    );
  });
});
