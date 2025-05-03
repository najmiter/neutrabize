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
  cityDusk: {
    name: 'cityDusk',
    classes: {
      date: ['theme__cityDusk-date', 'theme__date'],
      time: ['theme__cityDusk-time', 'theme__time'],
    },
    bg: './imgs/bg/city.jpg',
  },
  kaiju: {
    name: 'kaiju',
    classes: {
      date: ['theme__kaiju-date', 'theme__date'],
      time: ['theme__kaiju-time', 'theme__time'],
    },
    bg: './imgs/bg/kaiju.jpg',
  },
  planets: {
    name: 'planets',
    classes: {
      date: ['theme__planets-date', 'theme__date'],
      time: ['theme__planets-time', 'theme__time'],
    },
    bg: './imgs/bg/planets.png',
  },
  galaxy: {
    name: 'galaxy',
    classes: {
      date: ['theme__galaxy-date', 'theme__date'],
      time: ['theme__galaxy-time', 'theme__time'],
    },
    bg: './imgs/bg/galaxy.jpg',
  },
  spaceDude: {
    name: 'spaceDude',
    classes: {
      date: ['theme__spaceDude-date', 'theme__date'],
      time: ['theme__spaceDude-time', 'theme__time'],
    },
    bg: './imgs/bg/space-dude.jpg',
  },
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
  jungle: {
    name: 'jungle',
    classes: {
      date: ['theme__jungle-date', 'theme__date'],
      time: ['theme__jungle-time', 'theme__time'],
    },
    bg: './imgs/bg/video/jungle.mp4',
  },
  lake: {
    name: 'lake',
    classes: {
      date: ['theme__lake-date', 'theme__date'],
      time: ['theme__lake-time', 'theme__time'],
    },
    bg: './imgs/bg/video/lake.mp4',
  },
  sky: {
    name: 'sky',
    classes: {
      date: ['theme__sky-date', 'theme__date'],
      time: ['theme__sky-time', 'theme__time'],
    },
    bg: './imgs/bg/video/sky.mp4',
  },
  spaceBeach: {
    name: 'spaceBeach',
    classes: {
      date: ['theme__spaceBeach-date', 'theme__date'],
      time: ['theme__spaceBeach-time', 'theme__time'],
    },
    bg: './imgs/bg/video/space-beach.mp4',
  },
};

// default theme
if (!localStorage.getItem('neutrabize_THEMEDATA'))
  localStorage.setItem(
    'neutrabize_THEMEDATA',
    JSON.stringify(themesData.kaiju)
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
