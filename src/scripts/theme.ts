import { themesData } from '@/data/themes';

if (!localStorage.getItem('neutrabize_THEMEDATA')) {
  localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData.exoplanets));
}
