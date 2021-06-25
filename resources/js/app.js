require('./bootstrap');
import $ from 'jquery';
import DrawHelper from "./DrawHepler";

window.onload = () => {
    if ($('.user-visits__canvases').length) {

        let urlForRequest = '/api/get-unique-visits';
        $.get( urlForRequest , function( requestResult ) {
            $('.user-visits__loading').hide();
            let requestError = false;
            if (
                !requestResult.hasOwnProperty('success') ||
                !requestResult.hasOwnProperty('data') ||
                !requestResult.success ||
                !requestResult.data
            ) {
                requestError = true;
            } else {
                let requestData = requestResult.data;
                if (
                    !requestData.hasOwnProperty('by_city') ||
                    !requestData.hasOwnProperty('by_hour')
                ) {
                    requestError = true;
                }
            }

            if (requestError) {
                $('.user-visits__error').removeClass('d-none').addClass('alert-danger').html('There was en error with loading the data');
            } else {
                if (!requestResult.data.by_hour.length && !requestResult.data.by_city.length) {
                    $('.user-visits__error').removeClass('d-none').addClass('alert-primary').html('There was no user visits yet');
                } else {
                    $('.user-visits__success').removeClass('d-none');
                    let Drawer = new DrawHelper();
                    Drawer.drawVisitsByHour(requestResult.data.by_hour);
                    Drawer.drawVisitsByCity(requestResult.data.by_city);
                }

            }
        }, "json");
    }

    class UserDataSender {
        sendUserData() {
            $.getJSON("https://api.ipify.org/?format=json", function (e) {
                let urlForRequest = '/api/create';
                let ip = e.ip;
                let city = ymaps.geolocation.city;

                let matched = navigator.userAgent.toLowerCase().match(/android|webos|iphone|ipad|ipod|blackberry|Windows|iemobile|opera mini/i);

                let device = '';
                if (matched) {
                    device = matched[0];
                }

                let postData = {ip, city, device};
                $.post(urlForRequest, postData, function (data) {
                    // Сюда можно встроить код для конторля процесса
                }, "json");
            });
        }

        loadYmaps() {
            if (typeof ymaps == 'undefined') {
                let headTag = document.getElementsByTagName("head")[0];
                let jqTag = document.createElement('script');
                jqTag.type = 'text/javascript';
                jqTag.src = 'http://api-maps.yandex.ru/2.0-stable/?load=package.standard&lang=ru-RU';
                jqTag.onload = this.sendUserData;
                headTag.appendChild(jqTag);
            } else {
                this.sendUserData();
            }
        }

        loadJquery() {
            if (typeof jQuery == 'undefined') {
                let headTag = document.getElementsByTagName("head")[0];
                let jqTag = document.createElement('script');
                jqTag.type = 'text/javascript';
                jqTag.src = 'http://yastatic.net/jquery/2.1.1/jquery.min.js';
                jqTag.onload = this.loadYmaps;
                headTag.appendChild(jqTag);
            } else {
                this.loadYmaps();
            }
        }
    }

    let senderObject = new UserDataSender();
    senderObject.loadJquery();

}
