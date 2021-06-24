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

            console.log('Loading...')

            if (requestError) {
                $('.user-visits__error').removeClass('d-none').addClass('alert-danger').html('There was en error with loading the data');
            } else {
                if (!requestResult.data.by_hour && !requestResult.data.by_city) {
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
}
