const weather = document.getElementById("weather");
const unit = document.getElementById("unit");
const weather_previously_fetched = localStorage.getItem("neutrabize_WEATHER");

if (weather_previously_fetched) {
    const { weather: old, at } = JSON.parse(weather_previously_fetched);

    if (Date.now() > at + 1000 * 60 * 60) {
        do_da_weather_thing();
    } else {
        weather.textContent = old.temp;
        unit.textContent = old.unit;
    }
} else {
    do_da_weather_thing();
}

function do_da_weather_thing() {
    let weather_data_received = false;

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lati = position.coords.latitude;
            const long = position.coords.longitude;

            const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain`;

            fetch(WEATHER_API)
                .then((choosni) => choosni.json())
                .then((khbr) => {
                    weather.textContent = `${khbr.current.rain ? "🌧️" : "🌤️"} ${khbr.current.temperature_2m}`;
                    unit.textContent = khbr.current_units.temperature_2m;
                    weather_data_received = true;

                    localStorage.setItem(
                        "neutrabize_WEATHER",
                        JSON.stringify({
                            at: Date.now(),
                            weather: {
                                temp: weather.textContent,
                                unit: unit.textContent,
                            },
                        })
                    );
                });
        });
    } else {
        weather.textContent = "";
        console.error("Weather data could not be displayed");
    }

    setTimeout(() => {
        if (!weather_data_received) {
            if (weather_previously_fetched) {
                const { weather: old } = JSON.parse(weather_previously_fetched);
                weather.textContent = old.temp;
                unit.textContent = old.unit;
            } else {
                weather.textContent = "";
            }
        }
    }, 3 * 1000);
}
