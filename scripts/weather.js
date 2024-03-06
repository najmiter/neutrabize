const weather = document.getElementById("weather");
const unit = document.getElementById("unit");

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const lati = position.coords.latitude;
        const long = position.coords.longitude;

        const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m`;

        fetch(WEATHER_API)
            .then((choosni) => choosni.json())
            .then((khbr) => {
                weather.textContent = khbr.current.temperature_2m;
                unit.textContent = khbr.current_units.temperature_2m;
            });
    });
} else {
    weather.textContent = "";
    console.error("Weather data could not be displayed");
}
