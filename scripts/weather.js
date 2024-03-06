if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const lati = position.coords.latitude;
        const long = position.coords.longitude;

        const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m`;

        fetch(WEATHER_API)
            .then((choosni) => choosni.json())
            .then((khbr) => {
                const weather = document.getElementById("weather");
                const unit = document.getElementById("unit");
                weather.textContent = khbr.current.temperature_2m;
                unit.textContent = khbr.current_units.temperature_2m;
            });
    });
} else {
    console.error("Geolocation is not supported by your browser");
}

// {
//   latitude: 32,
//   longitude: 73,
//   generationtime_ms: 0.012993812561035156,
//   utc_offset_seconds: 0,
//   timezone: 'GMT',
//   timezone_abbreviation: 'GMT',
//   elevation: 190,
//   current_units: { time: 'iso8601', interval: 'seconds', temperature_2m: '°C' },
//   current: { time: '2024-03-06T12:45', interval: 900, temperature_2m: 19.4 }
// }
