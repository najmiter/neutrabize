const temperature = document.getElementById("temperature");
const weather_previously_fetched = localStorage.getItem("neutrabize_WEATHER");
const weatherIcon = document.getElementById("weather-icon");

function update_weather() {
    if (weather_previously_fetched) {
        const { temperature: old, at } = JSON.parse(weather_previously_fetched);

        if (Date.now() > at + 1000 * 60 * 60) {
            do_da_weather_thing();
        } else {
            temperature.textContent = `${old.temp}`;
            weatherIcon.src = `./imgs/icons/${old.icon}.svg`;
            weatherIcon.dataset.good = "true";
        }
    } else {
        do_da_weather_thing();
    }
}

function do_da_weather_thing() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lati = position.coords.latitude;
            const long = position.coords.longitude;

            const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&current=temperature_2m,rain,is_day`;

            try {
                const choosni = await fetch(WEATHER_API);

                if (choosni.ok) {
                    const khbr = await choosni.json();
                    const icon = khbr.current.rain
                        ? "rainy"
                        : khbr.current.is_day
                          ? "sunny"
                          : "night";

                    temperature.textContent = `${khbr.current.temperature_2m} ${khbr.current_units.temperature_2m}`;
                    weatherIcon.src = `./imgs/icons/${icon}.svg`;
                    weatherIcon.dataset.good = "true";

                    localStorage.setItem(
                        "neutrabize_WEATHER",
                        JSON.stringify({
                            at: Date.now(),
                            temperature: {
                                temp: temperature.textContent,
                                icon,
                            },
                        })
                    );
                } else {
                    throw new Error(`Couldn't get the temperature`);
                }
            } catch (probably_the_network_thing) {
                reset_weather_to_previous_or_empty();
            }
        }, reset_weather_to_previous_or_empty);
    } else {
        temperature.textContent = "";
        console.error("temperature data could not be displayed");
    }
}

function reset_weather_to_previous_or_empty() {
    if (weather_previously_fetched) {
        const { temperature: old } = JSON.parse(weather_previously_fetched);
        temperature.textContent = old.temp;
        weatherIcon.src = `./imgs/icons/${old.icon}.svg`;
        weatherIcon.dataset.good = "true";
    } else {
        temperature.textContent = "";
    }
}
