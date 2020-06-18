$(document).ready(function () {
        // ............................... map API 1 .............................
    let app = new Mapp({
        element: '#map',
        presets: {
          latlng: {
            lat: 35,
            lng: 56,
          },
          zoom: 6
        },
        apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImUwYzM3MDdhYjYwNDVjNmU5MGVjOTVmZWI2Y2RiMjhkZTM2ZGNiNDE4M2VmOWUwNGMyYzdhY2VhODQwNGUzOGFkOTJiMjg5NWM5MjllZmUzIn0.eyJhdWQiOiI5NzE1IiwianRpIjoiZTBjMzcwN2FiNjA0NWM2ZTkwZWM5NWZlYjZjZGIyOGRlMzZkY2I0MTgzZWY5ZTA0YzJjN2FjZWE4NDA0ZTM4YWQ5MmIyODk1YzkyOWVmZTMiLCJpYXQiOjE1OTIzMzIxMjMsIm5iZiI6MTU5MjMzMjEyMywiZXhwIjoxNTk0OTI0MTIzLCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.MXJaR4IyMsk5c9UYpWKpS7OhKfM7VR-U7fUD8I3KHpx81_RqcqBMeWmYlmOyVgCzf35rE4Z2cMV3uFwJywWdyyXN_48xVKiZgf2nO0KBLzFGH8IrxlZZhQphCJQjK0NZw1C2ZoAjbL5v-Opabx_VKknCogRySuaFBtskGj28uCbsnjeNEYw7U_AudYXk6JnrGKAX1rrZPy732NCK-CyOZBfCS7nJKvym5_OR-Cwg6f582M7tA6nB7aMr8VKaLGKbjuTNVTaU6B_W0lehJ7G28xjYF_TXScEtPdMCOwN76t2S776aXi3szQ0Fx1Aun8sibN7Bs0ZtX_NuE5Wn-H5HZg'
    });
    app.addLayers();
    app.addZoomControls();

    // ............................... country API  .............................
    let settings = {
        "url": "https://restcountries.eu/rest/v2/all",
        "method": "GET",
        "timeout": 0
    };

    $.ajax(settings).done(function (response) {
        // $("#select-country").empty();
        for (const country of response) {
            $("#select-country").append(`<option value="${country.alpha3Code}">${country.name}</option>`)

        }
    });
    $("#form").on("submit", function (event) {
        event.preventDefault();
    })

    $("#select-country").change(function (event) {
        $.ajax({
            "url": `https://restcountries.eu/rest/v2/alpha/${this.value}`,
            "method": "GET"
        }).done(function (response1) {
            $("#flag").attr("src", response1.flag);
            $("#info").html(`
            <h6>${response1.name}</h6>
            <P><span>Native Name:</span> ${response1.nativeName}</p>
            <P><span>Capital:</span> ${response1.capital}</p>
            <P><span>Region:</span> ${response1.region}, ${response1.subregion}</p>
            <P><span>Population:</span> ${response1.population}</p>
            <P><span>Langueges:</span> ${response1.languages[0].name}</p>
            <P><span>Timezone:</span> ${response1.timezones}</p>
            `);
            $("#call-code").text(`${response1.callingCodes}`);

    // ............................... weather API  .............................
            $.ajax({
                "url": `https://api.openweathermap.org/data/2.5/onecall?lat=${response1.latlng[0]}&lon=${response1.latlng[1]}&
                exclude=hourly,daily&appid=dcd9e3cbf11893c4270a725d3035ddae`,
                "method": "GET"
            }).done(function (response2) {     
                console.log(response2);
                                           
                $("#weather").html(`
                <div class="description-weather">
                    <img src = "http://openweathermap.org/img/wn/${response2.current.weather[0].icon}@2x.png"></img>
                    <h6>${response2.current.weather[0].description}</h6>
                </div>
                <P>Wind Speed: <span>${response2.current.wind_speed}</span> MS</p>
                <P>Temperature: <span>${Math.floor(response2.current.temp - 273)} </span> C</p>
                <P>Humidity: <span>${response2.current.humidity}</span> %</p>
                <P>Visibility: <span>${response2.current.visibility}</span> m</p>
                `);
            });

    // ............................... map API 2 .............................
            app.addMarker({
                name: 'basic-marker',
                latlng: {
                    lat: `${response1.latlng[0]}`,
                    lng: `${response1.latlng[1]}`,
                },
                popup: {
                  title: {
                    html: `${response1.nativeName}`,
                  },
                  description: {
                    html: 'Basic marker description',
                  },
                  open: true,
                },
              });
        });
    });      
});
