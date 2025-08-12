import { themesData } from '../data/themes';
import { ThemeData } from '../types';
import { themeContainer, updateTheme } from './globals';

export const renderThemes = () => {
  // this is gonna be bad 😭 (but we'll deliver it as a feature - not a bug. until it's been fixed 😋)
  themeContainer.innerHTML = '';
  const themes = Object.values(themesData);
  // must be there at this point
  const activeTheme = JSON.parse(localStorage.getItem('neutrabize_THEMEDATA') ?? '{}');

  const themeNodes = themes.map((theme) => {
    const container = makeContainer();
    const overlay = makeOverlay(theme.name, activeTheme?.name === theme.name);
    container.innerHTML = getElement(theme);
    container.append(overlay);
    return container;
  });

  themeContainer.append(...themeNodes);
};

const makeContainer = (): HTMLDivElement => {
  const container = document.createElement('div');
  container.classList.add(
    ...'relative grid gap-2 cursor-pointer justify-items-center max-w-36 rounded-md p-2 hover:bg-stone-900/70 has-[div[data-active=true]]:bg-stone-400/30'.split(
      ' '
    )
  );
  return container;
};

const makeOverlay = (themeName: string, isActive = false) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.setAttribute('role', 'presentation');
  overlayDiv.dataset.name = themeName;
  overlayDiv.dataset.active = isActive.toString();

  overlayDiv.classList.add(...'theme absolute top-0 left-0 w-full h-full bg-transparent'.split(' '));

  // bubbling would've worked but who cares
  overlayDiv.addEventListener('click', ({ target }) => {
    const element = target as HTMLElement;
    const name = element.dataset.name;

    if (!name || !themesData[name]) return;

    updateTheme(themesData[name]);

    localStorage.setItem('neutrabize_THEMEDATA', JSON.stringify(themesData[name]));

    renderThemes();
  });
  return overlayDiv;
};

const getElement = (theme: ThemeData): string => (theme.kind === 'img' ? makeImgElement(theme) : makeVidElement(theme));

const makeVidElement = (theme: ThemeData): string => `
  <video
    autoplay
    loop
    muted
    playsinline
    style="pointer-events: none"
    class="max-w-32 aspect-square object-cover rounded-md"
  >
    <source
      src="${theme.bg}"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
  <h3 class="text-lg">${theme.displayName}</h3>
`;

const makeImgElement = (theme: ThemeData): string => `
  <img
    src="${theme.bg}"
    class="max-w-32 aspect-square object-cover rounded-md"
    alt=""
  />
  <h3 class="text-lg">${theme.displayName}</h3>
`;
