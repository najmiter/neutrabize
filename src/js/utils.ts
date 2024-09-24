import { timeContainers } from './globals';

export function getTime(): string {
  return (
    new Date()
      .toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
      })
      .split(' ')
      .at(0) || '00:00'
  );
}

export function setTime() {
  timeContainers.forEach((element) => (element.textContent = getTime()));
}
