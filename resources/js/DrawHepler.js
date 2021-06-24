import {Chart, registerables} from "chart.js";
import $ from "jquery";
import distinctColors from 'distinct-colors'

export  default  class DrawHelper {

    constructor() {
        Chart.register(...registerables);
    }

    /**
     * Отображает график уникальных посещений по часам
     * @param visitsByHour
     */
    drawVisitsByHour (visitsByHour) {
        let labels = [];
        let dataByHour = [];

        for (let hour = 0; hour < 24; hour ++) {
            labels[hour] = hour;
            if (visitsByHour.hasOwnProperty(hour) && visitsByHour[hour].hasOwnProperty('unique_visits')) {
                dataByHour[hour] = visitsByHour[hour].unique_visits;
            } else {
                dataByHour[hour] = 0;
            }
        }
        const data = {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: dataByHour,
            }]
        };
        const config = {
            type: 'line',
            data,
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        };

        new Chart(
            $('.user-visits__visits-by-hour'),
            config
        );

    }

    /**
     * Отображает диаграмму посещений по гороодам
     * @param visitsByCity
     */
    drawVisitsByCity (visitsByCity) {
        let palette = distinctColors(visitsByCity.length);
        let cities = [];
        let citiesData = [];
        let citiesColors = [];

        for (let cityIndex in visitsByCity) {
            let cityData = visitsByCity[cityIndex];
            cities.push(cityData.city);
            citiesData.push(cityData.unique_visits);
            let paleteRgb = palette[cityIndex]._rgb;
            citiesColors.push(`rgb(${paleteRgb[0]},${paleteRgb[1]},${paleteRgb[2]}`);
        }

        const data = {
            labels: cities,
            datasets: [{
                label: 'Visits by city',
                data: citiesData,
                backgroundColor: citiesColors,
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'pie',
            data: data
        };

        new Chart(
            $('.user-visits__visits-by-city'),
            config
        );
    }
}
