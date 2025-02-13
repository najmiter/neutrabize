import { batteryContainer } from './globals';

if ('getBattery' in navigator) {
  fetch('../imgs/icons/battery.svg')
    .then((r) => r.text())
    .then((data) => {
      const parser = new DOMParser();
      const svg = parser.parseFromString(data, 'image/svg+xml');
      const batteryIcon = svg.documentElement;

      const fill = batteryIcon.querySelector('#inner') as SVGElement;
      const fullWidth = +fill.getAttribute('width')!;

      const batteryIconContainer = document.getElementById(
        'battery-icon'
      ) as HTMLElement;
      const batteryProgress = document.getElementById(
        'battery-progress'
      ) as HTMLElement;
      const isChargingIcon = document.getElementById(
        'battery-charging'
      ) as HTMLElement;

      function updateSvg({ level }: BatteryManager): void {
        batteryProgress.textContent = `${Math.trunc(level * 100)}%`;
        fill.setAttribute('width', (level * fullWidth).toString());
        batteryIconContainer.innerHTML = '';
        batteryIconContainer.appendChild(batteryIcon);
      }

      navigator.getBattery().then((battery) => {
        updateSvg(battery);
        isChargingIcon.dataset.charging = battery.charging.toString();

        battery.onlevelchange = () => updateSvg(battery);
        battery.onchargingchange = () =>
          (isChargingIcon.dataset.charging = battery.charging.toString());
      });
    })
    .catch((error) => console.error(error));
} else {
  batteryContainer.dataset.batteryHaiENi = 'true';
}
