const weather = document.getElementById("weather");
const unit = document.getElementById("unit");
const weather_previously_fetched = localStorage.getItem("neutrabize_WEATHER");

function update_weather() {
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
}

function do_da_weather_thing() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const lati = position.coords.latitude;
            const long = position.coords.longitude;

            const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain,is_day`;

            try {
                const choosni = await fetch(WEATHER_API);

                if (choosni.ok) {
                    const khbr = await choosni.json();

                    weather.textContent = `${khbr.current.rain ? "🌧️" : khbr.current.is_day ? "🌤️" : "🌙"} ${khbr.current.temperature_2m}`;
                    unit.textContent = khbr.current_units.temperature_2m;

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
                } else {
                    throw new Error(`Couldn't get the weather`);
                }
            } catch (probably_the_network_thing) {
                reset_weather_to_previous_or_empty();
            }
        }, reset_weather_to_previous_or_empty);
    } else {
        weather.textContent = "";
        console.error("Weather data could not be displayed");
    }
}

function reset_weather_to_previous_or_empty() {
    if (weather_previously_fetched) {
        const { weather: old } = JSON.parse(weather_previously_fetched);
        weather.textContent = old.temp;
        unit.textContent = old.unit;
    } else {
        weather.textContent = "";
    }
}
