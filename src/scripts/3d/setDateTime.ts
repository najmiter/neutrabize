import gsap from 'gsap';

const dateTime = document.getElementById('date-time') as HTMLDivElement;
const date = document.getElementById('threed-date') as HTMLDivElement;
const time = document.getElementById('threed-time') as HTMLDivElement;

export const updateDateTime = () => {
  const now = new Date();
  const full = now.toLocaleString('en-us', { hour: 'numeric', minute: '2-digit', hour12: true });
  date.textContent = now.toLocaleString('en-us', { weekday: 'long', month: 'short', day: 'numeric' });
  time.textContent = full.split(' ')[0] ?? full;
  time.title = full;
};

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
