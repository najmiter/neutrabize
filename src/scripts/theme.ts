import { themesData } from '../data/themes';
import { CONTEXT, themeContainer, update_theme } from './globals';

// default theme
if (!localStorage.getItem('neutrabize_THEMEDATA'))
  localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData.exoplanets));

const themes = themeContainer.querySelectorAll<HTMLElement>('.theme');
themes?.forEach((theme) => {
  theme.addEventListener('click', ({ target }) => {
    const element = target as HTMLElement;
    const name = element.dataset.name;

    if (!name || !themesData[name]) return;

    CONTEXT.set('theme', themesData[name]);
    localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData[name]));
    update_theme();

    themes.forEach((theme) => (theme.dataset.active = (theme.dataset.name === name).toString()));
  });
});
