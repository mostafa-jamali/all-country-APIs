$(document).ready(function () {
    var settings = {
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

            $.ajax({
                "url": `https://api.openweathermap.org/data/2.5/onecall?lat=${response1.latlng[0]}&lon=${response1.latlng[1]}&
                exclude=hourly,daily&appid=dcd9e3cbf11893c4270a725d3035ddae`,
                "method": "GET"
            }).done(function (response2) {
                $("#weather").html(` 
                <P>Wind Speed: <span>${response2.current.wind_speed}</span> MS</p>
                <P>Temperature: <span>${Math.floor(response2.current.temp - 273)} </span> C</p>
                <P>Humidity: <span>${response2.current.humidity}</span> %</p>
                <P>Visibility: <span>${response2.current.visibility}</span> m</p>
                <P>weather: <span>${response2.current.weather[0].description}</span></p>
                `);
                // $.ajax({
                //     "url": ` http://openweathermap.org/img/wn/${response2.weather[0].id}@2x.png`,  /*https://openweathermap.org/weather-conditions*/
                //     "method": "GET"
                // }).done(function (response3) {
                //     $("#weather").append(`
                //     <div>${response3}</div>
                //     `)
                // });
            });
            $.ajax({
                "url": `https://maps.googleapis.com/maps/api/js?key=dcd9e3cbf11893c4270a725d3035ddae&callback=initMap&libraries=&v=weekly`,
                "method": "GET"
            }).done(function (response4) {
                $("#map").html(` 
                <div>${response4}</div>
                `);
            });
        });


    })
});
