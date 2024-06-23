if ("getBattery" in navigator) {
    fetch("../imgs/icons/battery.svg")
        .then((r) => r.text())
        .then((data) => {
            const parser = new DOMParser();
            const svg = parser.parseFromString(data, "image/svg+xml");
            const batteryIcon = svg.documentElement;

            const fill = batteryIcon.querySelector("#inner");
            const fullWidth = +fill.getAttribute("width");

            const batteryIconContainer =
                document.getElementById("battery-icon");
            const batteryProgress = document.getElementById("battery-progress");
            const isChargingIcon = document.getElementById("battery-charging");

            function updateSvg({ level }) {
                batteryProgress.textContent = `${Math.trunc(level * 100)}%`;
                fill.setAttribute("width", level * fullWidth);
                batteryIconContainer.innerHTML = "";
                batteryIconContainer.appendChild(batteryIcon);
            }

            navigator.getBattery().then((battery) => {
                updateSvg(battery);

                battery.onlevelchange = () => updateSvg(battery);
                battery.onchargingchange = () =>
                    (isChargingIcon.dataset.charging = battery.charging);
            });
        })
        .catch((error) => console.error(error));
}
