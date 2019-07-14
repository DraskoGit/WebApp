/*
Author: Drasko Aleksic
*/

$(document).ready(function () {
    // api settings
    let settings = {
        id: 787657, // <-- Nis
        apiKey: 'b6907d289e10d714a6e88b30761fae22',
        units: 'metric'
    };
    let weatherWidget = {
        currentData: {},
        dailyData: [],
        currentDate: new Date(),
        // set current time
        formatTime: function () {
            let day = moment().format('dddd');
            let month = moment().format('MMMM');
            let monthDo = moment().format('Do');
            let year = moment().format('YYYY');
            $('#day').text(day);
            $('#month').text(month);
            $('#numbDay').text(monthDo);
            $('#year').text(year);
            setInterval(function () {
                // current time
                $('#hours').text(moment().format('HH'))
                $('#minutes').text(moment().format('mm'))
                $('#seconds').text(moment().format('ss'));
                $('.spinner-border').removeClass();
            }, 1000);
        },
        // fetch current data
        fetchCurrentData: function () {
            $.getJSON(`http://openweathermap.org/data/2.5/weather?id=${settings.id}&appid=${settings.apiKey}&units=${settings.units}`).done(function (data) {
                weatherWidget.currentData = data;
                weatherWidget.CurrentData(data);
            }).catch(function (err) {
                console.error(err, 'greska');
            })
        },
        //  current data
        CurrentData: function (data) {
            $('#location').text(data.name + ", " + data.sys.country);
            $('#icons').removeClass().addClass(weatherWidget.checkWeatherIcon(data.weather[0].icon));
            $('#current-temp').text(data.main.temp);
            $('.current-about-text').text(data.weather[0].description);
            $('#current-temp-min').text(data.main.temp_min);
            $('#current-temp-max').text(data.main.temp_max);
            $('.current-wind').text(data.wind.speed + " m/s");
            $('.current-clouds').text(data.clouds.all + " %");
            $('.current-pressure').text(data.main.pressure + " mb");
            $('.current-humidity').text(data.main.humidity + " %");
        },

        fetchDailyData: function () {
            $.getJSON(`https://openweathermap.org/data/2.5/forecast?id=${settings.id}&appid=${settings.apiKey}&units=${settings.units}`).done(function (data) {
                weatherWidget.DailyData(data);
            }).catch(function (err) {
                console.error(err, 'greska');
            })
        },
        DailyData: function (data) {
            this.currentDate.setHours(15);
            console.log(data)
            $.each(data.list, function (index, value) {
                let loopDate = new Date(value.dt_txt);
                if (weatherWidget.currentDate.getHours() === loopDate.getHours()) {
                    weatherWidget.dailyData.push(value);
                }
            })
            $.each(weatherWidget.dailyData, function (index, singleDay) {
                let nameOfTheDay = moment(singleDay.dt_txt).format('dddd');
                // daily data
                $(`#${index + 1} .daily-date .card-title`).text(nameOfTheDay);
                $(`#${index + 1} .daily-icon .wi-night-sleet`).removeClass().addClass(weatherWidget.checkWeatherIcon(singleDay.weather[0].icon));
                $(`#${index + 1} .daily-about-text .about-weather`).text(singleDay.weather[0].description);
            })

        },
        checkWeatherIcon: function (name) {
            switch (name) {
                // night icon
                case '01n':
                    return 'wi wi-night-clear';
                    break;
                case '02n':
                    return 'wi wi-night-alt-cloudy';
                    break;
                case '03n':
                    return 'wi wi-cloudy';
                    break;
                case '04n':
                    return 'wi wi-cloudy';
                    break;
                case '09n':
                    return 'wi wi-night-alt-showers';
                    break;
                case '10n':
                    return 'wi wi-night-alt-rain';
                    break;
                case '11n':
                    return 'wi wi-night-alt-thunderstorm';
                    break;
                case '13n':
                    return 'wi wi-night-snow-wind';
                    break;
                case '50n':
                    return 'wi wi-night-fog';
                    break;
                    // day icon
                case '01d':
                    return 'wi wi-day-sunny';
                    break;
                case '02d':
                    return 'wi wi-day-cloudy';
                    break;
                case '03d':
                    return 'wi wi wi-cloudy';
                    break;
                case '04d':
                    return 'wi wi wi-cloudy';
                    break;
                case '09d':
                    return 'wi wi-day-rain-mix';
                    break;
                case '10d':
                    return 'wi wi-day-hail';
                    break;
                case '11d':
                    return 'wi wi-day-sleet-storm';
                    break;
                case '13d':
                    return 'wi wi-day-snow';
                    break;
                case '50d':
                    return 'wi wi-day-fog';
                    break;
                default:
                    return 'wi wi-day-sunny';
            }
        }
    };
    weatherWidget.fetchCurrentData();
    weatherWidget.fetchDailyData();
    weatherWidget.formatTime();
});