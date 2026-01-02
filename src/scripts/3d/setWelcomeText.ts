import gsap from 'gsap';

export const setWelcomeText = ({
  first = 'Welcome',
  after = 'Welcome back',
} = {}) => {
  const welcomeChars = document.querySelector(
    '#welcome h1'
  ) as HTMLHeadingElement;

  chrome.tabs.query({}, (tabs) => {
    const msg = tabs.length === 1 ? first : after;

    let spans = '';
    for (const char of msg) {
      spans += `<span class="welcome-text">${char === ' ' ? '&nbsp;' : char}</span>\n`;
    }

    welcomeChars.innerHTML = spans;

    const welcomeText = document.getElementsByClassName(
      'welcome-text'
    ) as HTMLCollectionOf<HTMLSpanElement>;
    for (let i = 0; i < welcomeText.length; i++) {
      const char = welcomeText.item(i);

      gsap.to(char, {
        y: -20,
        x: 50,
        opacity: 0,
        duration: 0.2,
        delay: 0.025 * i + 1.5,
        ease: 'power3.inOut',
      });
    }
  });
};
