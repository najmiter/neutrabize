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

      const batteryIconContainer = document.getElementById('battery-icon') as HTMLElement;
      const batteryProgress = document.getElementById('battery-progress') as HTMLElement;
      const isChargingIcon = document.getElementById('battery-charging') as HTMLElement;

      function update_svg({ level }: BatteryManager): void {
        batteryProgress.textContent = `${Math.trunc(level * 100)}%`;
        fill.setAttribute('width', (level * fullWidth).toString());
        const color =
          level < 0.2 ? 'var(--color-red-300)' : level < 0.8 ? 'var(--color-orange-300)' : 'var(--color-green-300)';
        fill.setAttribute('fill', color);
        fill.setAttribute('stroke', color);
        batteryIconContainer.innerHTML = '';
        batteryIconContainer.appendChild(batteryIcon);
      }

      navigator.getBattery().then((battery) => {
        update_svg(battery);
        isChargingIcon.dataset.charging = battery.charging.toString();
        handle_title(battery);

        battery.onlevelchange = () => update_svg(battery);
        battery.onchargingchange = () => (isChargingIcon.dataset.charging = battery.charging.toString());
        battery.ondischargingtimechange = () => {
          handle_title(battery);
        };
        battery.onchargingtimechange = () => {
          handle_title(battery);
        };
      });
    })
    .catch(() => void 0);
} else {
  batteryContainer.dataset.batteryHaiENi = 'true';
}

function handle_title(battery: BatteryManager) {
  const whatsup = (time: number) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    return [hrs, mins];
  };
  if (battery.charging) {
    const rem = battery.chargingTime;
    if (rem !== Infinity) {
      const [hrs, mins] = whatsup(rem);
      batteryContainer.title = `${hrs ? `${hrs}h ` : ''}${mins}m until fully charged`;
    } else {
      batteryContainer.title = `Calculating time until full...`;
    }
  } else {
    const rem = battery.dischargingTime;
    if (rem !== Infinity) {
      const [hrs, mins] = whatsup(rem);
      batteryContainer.title = `${hrs ? `${hrs}h ` : ''}${mins}m remaining`;
    } else {
      batteryContainer.title = `Calculating time remaining...`;
    }
  }
}
