import { CONTEXT, time } from './globals';

export const generate_clock = (): void => {
  const timeNow = new Date().toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true });
  const now = timeNow.split(' ').at(0)?.split('');
  if (!now) return;

  const container = document.createElement('div');
  container.classList.add('time-container');

  const waj_k = document.createElement('div');
  waj_k.textContent = ':';
  waj_k.style.marginInline = '0.1em';

  const realTime = document.createElement('div');
  realTime.className = 'sr-only real-time';

  container.append(realTime);
  container.append(get_digits(), get_digits(), waj_k, get_digits(), get_digits());
  time.append(container);
};

export const update_time = (): void => {
  let now = new Date()
    .toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true })
    .split(' ')
    .at(0);
  // now = `${Math.trunc(Math.random() * 100) % 10}${Math.trunc(Math.random() * 100) % 10}:${Math.trunc(Math.random() * 100) % 10}${Math.trunc(Math.random() * 100) % 10}`;

  const timeContainer = document.querySelector('.time-container');
  const realTime = timeContainer?.querySelector('.real-time') as HTMLDivElement;
  if (realTime && realTime.textContent === now) {
    return;
  }
  if (realTime) {
    realTime.textContent = now || '';
  }
  const digits = now
    ?.split('')
    .map(Number)
    .filter((s) => !Number.isNaN(s));

  if (!timeContainer || !digits) return;

  const digitsContainers: NodeListOf<HTMLSpanElement> = timeContainer.querySelectorAll('.digits-container');
  if (!digitsContainers) return;

  if (digits.length === 3) {
    digits.unshift(-1);
  }

  for (let i = 0; i < 4; i++) {
    const deez = digitsContainers[i];
    if (!deez) {
      console.assert(false, 'Something stupid has been has beened with the digits container');
      continue;
    }
    deez.dataset.current = digits[i]?.toString();
    if (i === 0 && digits[0] === -1) {
      deez.style.display = 'none';
    } else {
      deez.style.display = 'flex';
    }
    const deezDigit = deez.querySelector(`[data-n="${digits[i]}"]`) as HTMLDivElement;
    deezDigit?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
};

const get_digits = () => {
  const theme = CONTEXT.get('theme');
  const digits = Array.from({ length: 10 }).map((_, n) => {
    const digit = document.createElement('div');
    digit.textContent = n.toString();
    digit.dataset.n = n.toString();
    digit.setAttribute('class', 'theme__time ' + theme?.classes?.time?.join(' '));
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
