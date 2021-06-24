require('./bootstrap');
import $ from 'jquery';
import DrawHelper from "./DrawHepler";

window.onload = () => {
    if ($('.user-visits__canvases').length) {

        let urlForRequest = 'http://127.0.0.1:8000/api/get-unique-visits';
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
                $('.user-visits__error').removeClass('d-none').html('There was en error with loading the data');
            } else {
                $('.user-visits__success').removeClass('d-none');
                let Drawer = new DrawHelper();
                Drawer.drawVisitsByHour(requestResult.data.by_hour);
                Drawer.drawVisitsByCity(requestResult.data.by_city);
            }
        }, "json");
    }
}
