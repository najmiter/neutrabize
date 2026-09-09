import { CONTEXT, time } from '@/scripts/globals';

const timeClasses = (): string[] => {
  const classes = CONTEXT.get('theme')?.classes?.time;
  return Array.isArray(classes) ? classes : ['theme__time'];
};

const formatNow = (): string =>
  new Date().toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true });

export const generate_clock = (): void => {
  const container = document.createElement('div');
  container.classList.add('time-container');

  const colon = document.createElement('div');
  colon.textContent = ':';
  colon.classList.add('time-colon', ...timeClasses());
  colon.style.marginInline = '0.02em';

  const realTime = document.createElement('div');
  realTime.className = 'sr-only real-time';

  container.append(realTime);
  container.append(get_digits(), get_digits(), colon, get_digits(), get_digits());
  time.replaceChildren(container);
};

export const update_time = (): void => {
  const now = formatNow();

  const timeContainer = document.querySelector('.time-container') as HTMLDivElement | null;
  if (!timeContainer) return;

  const realTime = timeContainer.querySelector('.real-time') as HTMLDivElement | null;
  if (realTime && realTime.textContent === now) return;
  if (realTime) realTime.textContent = now;

  const digits = now
    .split(' ')
    .at(0)
    ?.split('')
    .map(Number)
    .filter((s) => !Number.isNaN(s));

  if (!digits) return;
  timeContainer.title = now;

  const digitsContainers = timeContainer.querySelectorAll<HTMLDivElement>('.digits-container');
  if (digits.length === 3) digits.unshift(-1);

  for (let i = 0; i < 4; i++) {
    const container = digitsContainers[i];
    if (!container) continue;

    const value = digits[i];
    container.dataset.current = value?.toString();

    if (i === 0 && value === -1) {
      container.style.display = 'none';
      continue;
    }
    container.style.display = 'flex';

    const digit = container.querySelector<HTMLDivElement>(`[data-n="${value}"]`);
    if (!digit) continue;

    const top = digit.offsetTop - (container.clientHeight - digit.offsetHeight) / 2;
    container.scrollTo({ top, behavior: 'smooth' });
  }
};

const get_digits = () => {
  const classes = timeClasses();
  const digits = Array.from({ length: 10 }).map((_, n) => {
    const digit = document.createElement('div');
    digit.textContent = n.toString();
    digit.dataset.n = n.toString();
    digit.classList.add(...classes);
    digit.setAttribute('aria-hidden', 'true');
    return digit;
  });

  const container = document.createElement('div');
  container.classList.add('digits-container');
  container.setAttribute('aria-hidden', 'true');
  container.dataset.current = '-1';
  container.append(...digits);

  return container;
};
