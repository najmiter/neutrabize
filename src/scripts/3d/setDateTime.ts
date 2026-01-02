import gsap from 'gsap';

const dateTime = document.getElementById('date-time') as HTMLDivElement;
const date = document.getElementById('date') as HTMLDivElement;
const time = document.getElementById('time') as HTMLDivElement;

export function updateDateTime() {
  date.textContent = `${new Date().toLocaleString('en-us', { weekday: 'long', month: 'short', day: 'numeric' })}`;
  time.textContent = `${
    new Date().toLocaleString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true }).split(' ')[0]
  }`;
}

export const setDateTime = () => {
  updateDateTime();

  gsap.fromTo(
    dateTime,
    { y: window.innerHeight / 3, opacity: 0, scale: 0 },
    {
      y: window.innerHeight / 9,
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: 1,
      ease: 'power3.inOut',
    }
  );
};
