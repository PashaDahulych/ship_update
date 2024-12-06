window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

const buildDurationSet = function (options) {
    if (typeof options === 'object') {
        if (options.length === 0) {
            $('#startTimeCard').empty();
            $('#durationCard').next('div.select-main__body').find('span.select-main__content').html('');
            $('#startTimeCard').next('div.select-main__body').find('span.select-main__content').html('');
            $('#passengersCard').next('div.select-main__body').find('span.select-main__content').html('');
            $('#calendarCard').addClass('has-error');
            $('.chose-another').removeClass('display-none');
        } else {
            $('#calendarCard').removeClass('has-error');
            $('.chose-another').addClass('display-none');
            $('#durationCard').empty();
            $('#durationCard').next('.select-main__body').find('div.simplebar-content').empty();
            $('#passengersCard').next('div.select-main__body').find('span.select-main__content').html('Passengers');
            var i = 1;
            $.each(options, function (single, option) {
                // <button className="select-main__option" data-value="00:00" type="button">00:00</button>
                if (option === '12:00' || i === 1) {
                    var value = option.replace(/\D/g, '');
                    $('#durationCard').next('div.select-main__body').find('span.select-main__content').html(option);
                    $('#durationCard').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                    $('#durationCard').append($('<option selected></option>').val(option).html(option));
                    $('#durationCard').attr('data-value', value);
                } else {
                    $('#durationCard').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                    $('#durationCard').append($('<option></option>').val(option).html(option));
                }
                i++;
                // console.log(option);
            });
        }

    }
}

window.buildDurationSet = buildDurationSet;

const buildTimeSet = function (options) {
    if (typeof options === 'object') {
        $('#startTimeCard').empty();
        $('#startTimeCard').next('.select-main__body').find('div.simplebar-content').empty();
        var i = 1;
        $.each(options, function (single, option) {
            // <button className="select-main__option" data-value="00:00" type="button">00:00</button>
            if (option === '12:00' || i === 1) {
                $('#startTimeCard').next('div.select-main__body').find('span.select-main__content').html(option);
                $('#startTimeCard').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#startTimeCard').append($('<option selected></option>').val(option).html(option));
                $('#startTimeCard').attr('data-value', option);
            } else {
                $('#startTimeCard').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#startTimeCard').append($('<option selected></option>').val(option).html(option));
            }
            i++;
            // console.log(option);
        });
    }

}
window.buildTimeSet = buildTimeSet;

$('#checkSingleBoat').on('click', function (e) {
    e.preventDefault();
    var boat = $('#boatID').val();
    var date = $('#calendarCard').attr('data-value');
    var fixDate = date.replace(/\./g, '-');
    var duration = $('#durationCard').attr('data-value');
    duration = duration.replace(/\D/g, '')
    var time = $('#startTimeCard').attr('data-value');
    var passengers = $('#passengersCard').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
    languageSelect = languageSelect.toLowerCase();
    if (boat !== "" && date !== "" && duration !== "" && time !== "" && passengers !== "" && passengers !== 'Passenger') {

        // Разбиваем стартовое время на часы и минуты
        let [hours, minutes] = time.split(':').map(Number);

        // Создаем объект Date и устанавливаем начальные часы и минуты
        let startDate = new Date();
        startDate.setHours(hours);
        startDate.setMinutes(minutes);

        // Прибавляем длительность (в часах) к стартовому времени
        startDate.setHours(startDate.getHours() + Math.floor(duration)); // Добавляем целые часы
        startDate.setMinutes(startDate.getMinutes() + (duration % 1) * 60); // Добавляем оставшиеся минуты

        // Получаем конечное время
        let endHours = startDate.getHours().toString().padStart(2, '0');
        let endMinutes = startDate.getMinutes().toString().padStart(2, '0');

        // Формируем и выводим результат
        let endTime = `${endHours}:${endMinutes}`;

        $.ajax({
            // public function actionBookingTimes($id, $dateSince, $duration, $timeSince, $adults)
            method: 'GET',
            url: '/boat/check-available',
            data: {
                id: boat,
                dateSince: fixDate,
                duration: duration,
                timeSince: time,
                adults: passengers,
            },
            success: function (response) {
                if(response !== '0') {
                    $('.time-dialog-warning').html(time + '-' + endTime);
                    $.ajax({
                        method: 'GET',
                        url: '/boat/booking-times-free',
                        data: {
                            id: boat,
                            dateSince: fixDate,
                            duration: duration,
                            timeSince: time,
                            adults: passengers,
                            children: 0,
                        },
                        success: function (response) {
                            // https://charterclick.local/boat/booking-times?id=9215&dateSince=26-10-2024&duration=4&timeSince=0&adults=Passenger&children=0
                            // /dubai?durationType=1&dateSince=16.10.2024&timeSince=13:00&duration=4&adults=2&sort=offers
                            $('.another-times').removeClass('display-none');
                            $('.sorry-block').removeClass('display-none');
                            var link = '/dubai?durationType=1&dateSince=' + date + '&timeSince=' + time + '&duration=' + duration + '&adults=' + passengers;
                            $('.another-times-button').attr('href', link);
                            try {
                                var times = JSON.parse(response); // Преобразуем JSON строку в массив
                            } catch (error) {
                                console.error("Ошибка парсинга JSON:", error);
                                return; // Прерываем выполнение, если JSON некорректен
                            }
                            $('.button-times').empty();
                            times.forEach(function(time) {
                                // Создаем кнопку
                                var button = $('<button type="button"></button>')
                                    .text(time) // Добавляем текст времени в кнопку
                                    .addClass('time-button time-button-click') // Добавляем класс для стилей (опционально)
                                    .attr('data-time', time);
                                // Добавляем кнопку в контейнер
                                $('.button-times').append(button);
                            });
                        }
                    });
                } else {
                    var locations = '/' + languageSelect + '/boat/index?id=' + boat + '&dateSince=' + date + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0';
                    location.href = locations;
                }

            }

        });

    } else {
        if (passengers === "Passenger") {
            $('div.select_form-passengers-yacht').addClass('has-error');
        }
        console.log('error');
    }
});

$(document).on('click', '.time-button-click', function () {
    var boat = $('#boatID').val();
    var date = $('#calendarCard').attr('data-value');
    var fixDate = date.replace(/\./g, '-');
    var duration = $('#durationCard').attr('data-value');
    duration = duration.replace(/\D/g, '');
    var time = $(this).attr('data-time');
    var passengers = $('#passengersCard').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
    languageSelect = languageSelect.toLowerCase();

    // Формируем URL
    var locations =  '/boat/index?id=' + boat + '&dateSince=' + fixDate + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0';

    location.href = locations; // Перенаправление, если нужно
});


// $('#checkSingleYacht button').on('click', function () {
//     var dateSelected = $('#calendarCard').attr('data-value');
//     console.log(dateSelected);
//
//     var parts = dateSelected.split('.');
//     var day = parseInt(parts[0], 10);
//     var month = parseInt(parts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0
//     var year = parseInt(parts[2], 10);
//
// // Создаем объект Date
//     var dateObject = new Date(year, month, day);
//     updateDateValue(dateObject);
// });

function updateDateValue(dateValue) {
    var selectedValue = dateValue;
    var selectedDay = dateValue.getDate();
    var selectedMonth = dateValue.getMonth() + 1;
    var selectedYear = dateValue.getFullYear();
    if (selectedMonth < 10) {
        selectedMonth = '0' + selectedMonth;
    }
    var element = $('#boatID').val();
    if (element) {
        var currentDay = selectedDay + '-' + selectedMonth + '-' + selectedYear;
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/boat/booking-durations?id=' + element + '&dateSince=' + currentDay + '&duration=&timeSince=&adults=&children=0',
            success: function (data) {
                buildDurationSet(data);

            }
        });
        var duration = $('#durationCard').attr('data-value');
        duration = duration.replace(/[^-0-9-.]/, '');
        var time = $('#startTimeCard').attr('data-value');
        var passengers = $('#passengersCard').attr('data-value');
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/boat/booking-times?id=' + element + '&dateSince=' + currentDay + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0',
            // success: function (data) {
            //     console.log(data);
            // },
            success: buildTimeSet,
            error: function () {
                console.log('errors');
            }
        });
    } else {
        console.log('apply');
    }

}


const buildMobileDurationSet = function (options) {
    if (typeof options === 'object') {
        if (options.length === 0) {
            $('#popup-yacht-card').find('#duration-book').next('div.select-main__body').find('span.select-main__content').html('');
            $('#popup-yacht-card').find('#startTimeBook').next('div.select-main__body').find('span.select-main__content').html('');
            $('#popup-yacht-card').find('#passengerBook').next('div.select-main__body').find('span.select-main__content').html('');
            $('#popup-yacht-card').find('#calendarBook').addClass('has-error');
            $('#popup-yacht-card').find('.chose-another').removeClass('display-none');
        } else {
            $('#popup-yacht-card').find('#calendarBook').removeClass('has-error');
            $('#popup-yacht-card').find('.chose-another').addClass('display-none');
            $('#popup-yacht-card').find('#duration-book').empty();
            $('#popup-yacht-card').find('#duration-book').next('.select-main__body').find('div.simplebar-content').empty();
            $('#popup-yacht-card').find('#passengerBook').next('div.select-main__body').find('span.select-main__content').html('Passengers');
            var i = 1;
            $.each(options, function (single, option) {

                // <button className="select-main__option" data-value="00:00" type="button">00:00</button>
                if (i === 1) {
                    var value = option.replace(/\D/g, '');
                    $('#popup-yacht-card').find('#duration-book').next('div.select-main__body').find('span.select-main__content').html(option);
                    $('#popup-yacht-card').find('#duration-book').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                    $('#popup-yacht-card').find('#duration-book').append($('<option selected></option>').val(option).html(option));
                    $('#popup-yacht-card').find('#duration-book').attr('data-value', value);
                    console.log(option);
                } else {
                    $('#popup-yacht-card').find('#duration-book').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                    $('#popup-yacht-card').find('#duration-book').append($('<option></option>').val(option).html(option));
                }
                i++;
                // console.log(option);
            });
        }

    }
}

window.buildMobileDurationSet = buildMobileDurationSet;

const buildMobileTimeSet = function (options) {
    if (typeof options === 'object') {
        $('#popup-yacht-card').find('#startTimeBook').empty();
        $('#popup-yacht-card').find('#startTimeBook').next('.select-main__body').find('div.simplebar-content').empty();
        var i = 1;
        $.each(options, function (single, option) {
            // <button className="select-main__option" data-value="00:00" type="button">00:00</button>
            if (option === '12:00' || i === 1) {
                $('#popup-yacht-card').find('#startTimeBook').next('div.select-main__body').find('span.select-main__content').html(option);
                $('#popup-yacht-card').find('#startTimeBook').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#popup-yacht-card').find('#startTimeBook').append($('<option selected></option>').val(option).html(option));
                $('#popup-yacht-card').find('#startTimeBook').attr('data-value', option);
            } else {
                $('#popup-yacht-card').find('#startTimeBook').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#popup-yacht-card').find('#startTimeBook').append($('<option selected></option>').val(option).html(option));
            }
            i++;
            // console.log(option);
        });
    }

}
window.buildMobileTimeSet = buildMobileTimeSet;

$('#checkMobileDuration').on('click', function (e) {
    e.preventDefault();
    var boat = $('#mobile-single-boat').val();
    var date = $('#calendarBook').attr('data-value');
    var fixDate = date.replace(/\./g, '-');
    var duration = $('#duration-book').attr('data-value');
    duration = duration.replace(/\D/g, '')
    var time = $('#startTimeBook').attr('data-value');
    var passengers = $('#passengerBook').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
    languageSelect = languageSelect.toLowerCase();
    if (passengers === "Passengers" || passengers === "Passenger") {
        $('div.select_form-passengers-yacht').addClass('has-error');
    }
    if (boat !== "" && date !== "" && duration !== "" && time !== "" && passengers !== "" && passengers !== 'Passenger' && passengers !== "Passengers") {
        // location.href = '/boat/index?id=' + boat + '&dateSince=' + date + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0';

        // Разбиваем стартовое время на часы и минуты
        let [hours, minutes] = time.split(':').map(Number);

        // Создаем объект Date и устанавливаем начальные часы и минуты
        let startDate = new Date();
        startDate.setHours(hours);
        startDate.setMinutes(minutes);

        // Прибавляем длительность (в часах) к стартовому времени
        startDate.setHours(startDate.getHours() + Math.floor(duration)); // Добавляем целые часы
        startDate.setMinutes(startDate.getMinutes() + (duration % 1) * 60); // Добавляем оставшиеся минуты

        // Получаем конечное время
        let endHours = startDate.getHours().toString().padStart(2, '0');
        let endMinutes = startDate.getMinutes().toString().padStart(2, '0');

        // Формируем и выводим результат
        let endTime = `${endHours}:${endMinutes}`;

        $.ajax({
            // public function actionBookingTimes($id, $dateSince, $duration, $timeSince, $adults)
            method: 'GET',
            url: '/boat/check-available',
            data: {
                id: boat,
                dateSince: fixDate,
                duration: duration,
                timeSince: time,
                adults: passengers
            },
            success: function (response) {
                if(response !== '0') {
                    $('.time-dialog-warning').html(time + '-' + endTime);

                    $.ajax({
                        method: 'GET',
                        url: '/boat/booking-times-free',
                        data: {
                            id: boat,
                            dateSince: fixDate,
                            duration: duration,
                            timeSince: time,
                            adults: passengers
                        },
                        success: function (response) {
                            $('.another-times-mobile').removeClass('display-none');
                            $('.sorry-block-mobile').removeClass('display-none');
                            var link = '/dubai?durationType=1&dateSince=' + date + '&timeSince=' + time + '&duration=' + duration + '&adults=' + passengers;
                            $('.another-times-button').attr('href', link);
                            try {
                                var times = JSON.parse(response); // Преобразуем JSON строку в массив
                            } catch (error) {
                                console.error("Ошибка парсинга JSON:", error);
                                return; // Прерываем выполнение, если JSON некорректен
                            }
                            $('.button-times').empty();
                            times.forEach(function(time) {
                                // Создаем кнопку
                                var button = $('<button type="button"></button>')
                                    .text(time) // Добавляем текст времени в кнопку
                                    .addClass('time-button time-button-click') // Добавляем класс для стилей (опционально)
                                    .attr('data-time', time);
                                // Добавляем кнопку в контейнер
                                $('.button-times').append(button);
                            });
                        }
                    });
                } else {
                    var locations = '/' + languageSelect + '/boat/index?id=' + boat + '&dateSince=' + date + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0';
                    location.href = locations;
                }

            }

        });
    } else {

        console.log('error');
    }
});


function updateSingleMobileValue(dateValue) {
    var selectedValue = dateValue;
    var selectedDay = dateValue.getDate();
    var selectedMonth = dateValue.getMonth() + 1;
    var selectedYear = dateValue.getFullYear();
    if (selectedMonth < 10) {
        selectedMonth = '0' + selectedMonth;
    }
    var element = $('#mobile-single-boat').val();
    if (element) {
        var currentDay = selectedDay + '-' + selectedMonth + '-' + selectedYear;
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/boat/booking-durations?id=' + element + '&dateSince=' + currentDay + '&duration=&timeSince=&adults=&children=0',
            success: function (data) {
                buildMobileDurationSet(data);
            }
        });
        var duration = $('#duration-book').attr('data-value');
        duration = duration.replace(/[^-0-9-.]/, '')
        var time = $('#startTimeBook').attr('data-value');
        var passengers = $('#passengerBook').attr('data-value');
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/boat/booking-times?id=' + element + '&dateSince=' + currentDay + '&duration=' + duration + '&timeSince=' + time + '&adults=' + passengers + '&children=0',
            // success: function (data) {
            //     console.log(data);
            // },
            success: buildMobileTimeSet,
            error: function () {
                console.log('errors');
            }
        });
    } else {
        console.log('apply');
    }

}

$('#book-now-single').on('click', function (e) {
    e.preventDefault();
    var id = $(this).attr('data-boat');
    var type = $(this).attr('data-type');
    var specialOfferId = $(this).attr('data-specialofferid');
    var dateSince = $(this).attr('data-dateSince');
    var duration = $(this).attr('data-duration');
    var time = $(this).attr('data-time');
    var adults = $(this).attr('data-adults');
    var children = $(this).attr('data-children');
    var languageSelect = $('.lang-select a').attr('data-language');
    languageSelect = languageSelect.toLowerCase();

    location.href = '/' + languageSelect + '/book/pay?boatId=' + id;
    console.log(id);
});

$.fn.countdown = function (prop) {

    // Количество секунд в каждом временном отрезке
    var days = 24 * 60 * 60,
        hours = 60 * 60,
        minutes = 60;

    var options = $.extend({
        callback: function () {
        },
        timestamp: 0
    }, prop);

    var left, d, h, m, s;

    (function tick() {

        // Осталось времени
        left = Math.floor((options.timestamp - (new Date())) / 1000);

        // Отенить платёж за 1 секунду до истечения счётика
        try {
            let intentId = $('#book-form').data('intent-id');
            if (intentId) {
                if (left === 1) {
                    $.ajax('/book/cancel-payment-intent-by-timeout', {
                        data: {
                            paymentIntentId: intentId
                        },
                        method: 'POST'
                    });
                }
            }
        } catch (Exception) {
        }

        if (left < 0) {
            left = 0;
        }

        // Осталось дней
        d = Math.floor(left / days);
        left -= d * days;

        // Осталось часов
        h = Math.floor(left / hours);
        left -= h * hours;

        // Осталось минут
        m = Math.floor(left / minutes);
        left -= m * minutes;

        // Осталось секунд
        s = left;

        // Вызываем возвратную функцию пользователя
        options.callback(d, h, m, s);

        // Планируем следующий вызов данной функции через 1 секунду
        setTimeout(tick, 1000);
    })();

    return this;
};

$('#time-spent').countdown({
    timestamp: (new Date()).getTime() + 15 * 60 * 1000,
    callback: function (days, hours, minutes, seconds) {
        $('#time-spent').html(('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
    }
});

$('.options-conf__input').on('click', function () {
    var id = $(this).attr('data-id');
    var booking = $(this).attr('data-booking');
    var listChecked = [];
    $('.options-conf__input:checked').each(function () {
        var idChecked = $(this).attr('data-id');
        listChecked.push(idChecked);
    });
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: '/book/update-booking?booking=' + booking + '&options=' + listChecked,
        success: function () {
            location.reload();
        },
        error: function () {
            console.log('error add options');
        }
    });
    console.log(listChecked);
});

$('#promo').on('input keyup', function (e) {
    e.preventDefault();
    var value = $(this).val();
    var booking = $(this).attr('data-booking');
    if (value.length > 4) {
        if (value.length > 8) {
            var newvalue = value.slice(0, -1);
            $(this).val(newvalue);
        }
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/book/check-promo?booking=' + booking + '&promo=' + value,
            success: function (data) {
                if (data === 'Promo code has expired!') {
                    $('.promo-errors').text('Promo code has expired!');
                    $('.booking-details__button').removeClass('active-promo');
                } else {
                    $('.promo-errors').text('');
                    $('.booking-details__button').addClass('active-promo');
                }
            },
            error: function () {
                $('.promo-errors').text('Promo code is not valid!');
            }
        });

    } else {
        $('.promo-errors').text('Minimum number of characters 5');
    }

});

$('.booking-details__button').on('click', function () {
    var value = $('#promo').val();
    var booking = $('#promo').attr('data-booking');
    if (value.length > 4) {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/book/apply-promo?id=' + booking + '&promo=' + value,
            success: function (data) {
                console.log(data);
                location.reload();
            },
            error: function () {
                $('.promo-errors').text('Promo code is not valid!');
            }
        });
    }

});

$('.remove-apply-booking').on('click', function () {
    var promoCodeID = $('#remove-promo').attr('data-discount');
    var bookingOrderNumber = $('#remove-promo').attr('data-booking');
    var priceFull = $('#remove-promo').attr('data-price');
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: '/book/remove-promo?booking=' + bookingOrderNumber + '&promo=' + promoCodeID + '&price=' + priceFull,
        success: function (data) {
            console.log(data);
            location.reload();
        },
        error: function () {
            $('.promo-errors').text('Promo code is not valid!');
        }
    });
});


const buildSpecialOfferTimeSet = function (options) {
    if (typeof options === 'object') {
        $('#startTimePopupApplyOffers').empty();
        $('#startTimePopupApplyOffers').next('.select-main__body').find('div.simplebar-content').empty();
        var i = 1;
        $.each(options, function (single, option) {
            // <button className="select-main__option" data-value="00:00" type="button">00:00</button>
            if (option === '12:00' || i === 1) {
                $('#startTimePopupApplyOffers').next('div.select-main__body').find('span.select-main__content').html(option);
                $('#startTimePopupApplyOffers').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#startTimePopupApplyOffers').append($('<option selected></option>').val(option).html(option));
                $('#startTimePopupApplyOffers').attr('data-value', option);
            } else {
                $('#startTimePopupApplyOffers').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(option).html(option))
                $('#startTimePopupApplyOffers').append($('<option selected></option>').val(option).html(option));
            }
            i++;
            // console.log(option);
        });
    }

}
window.buildSpecialOfferTimeSet = buildSpecialOfferTimeSet;


$('.button-special-offer').on('click', function (e) {
    e.preventDefault();
    var special_id = $(this).attr('data-special-offer');
    $('#specialBoatID').attr('data-special-id', special_id);
    var currentDate = new Date();
    // Добавляем один день
    currentDate.setDate(currentDate.getDate() + 1);
    var duration = $(this).attr('data-duration');
    var boat = $(this).attr('data-boat');
    $('#specialBoatID').val(boat);
    var passengers = $(this).attr('data-passengers');
    $('#durationPopupApplyOffers').attr('data-value', duration);
    var durationTop = duration + ' hours';
    $('#durationPopupApplyOffers').next('div.select-main__body').find('span.select-main__content').html('');
    $('#durationPopupApplyOffers').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(duration).html(durationTop).attr('data-value', duration));
    $('#durationPopupApplyOffers').next('div.select-main__body').find('span.select-main__content').html(durationTop);
    $('#durationPopupApplyOffers').append($('<option selected></option>').val(duration).html(durationTop));
    $('#passengersPopupApplyOffers').next('div.select-main__body').find('span.select-main__content').html('');
    for (var i = 1; i <= passengers; i++) {
        var passengersTop = i + ' Passengers';
        // Ваш код для каждой итерации цикла
        if (i === 1) {
            $('#passengersPopupApplyOffers').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button" selected></button>').val(i).html(passengersTop).attr('data-value', i));
            $('#passengersPopupApplyOffers').next('div.select-main__body').find('span.select-main__content').html(passengersTop);
            $('#passengersPopupApplyOffers').append($('<option selected></option>').val(i).html(passengersTop));
        } else {
            $('#passengersPopupApplyOffers').next('.select-main__body').find('div.simplebar-content').append($('<button class="select-main__option" type="button"></button>').val(i).html(passengersTop).attr('data-value', i));
            $('#passengersPopupApplyOffers').append($('<option></option>').val(i).html(passengersTop));
        }
    }

    updateSpecialOffers(currentDate);
});

function updateSpecialOffers(dateValue) {
    var selectedValue = dateValue;
    var selectedDay = dateValue.getDate();
    var selectedMonth = dateValue.getMonth() + 1;
    var selectedYear = dateValue.getFullYear();
    if (selectedMonth < 10) {
        selectedMonth = '0' + selectedMonth;
    }
    var element = $('#specialBoatID').val();
    if (element) {
        var currentDay = selectedDay + '-' + selectedMonth + '-' + selectedYear;
        var duration = $('#durationPopupApplyOffers').attr('data-value');
        var passengers = $('#passengersPopupApplyOffers').attr('data-value');
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/boat/booking-times?id=' + element + '&dateSince=' + currentDay + '&duration=' + duration + '&timeSince=' + '&adults=' + passengers + '&children=0',
            success: buildSpecialOfferTimeSet,
            // success: function (data){
            //     console.log(data);
            // },
            error: function () {
                console.log('errors');
            }
        });
    } else {
        console.log('apply');
    }
}

window.updateSpecialOffers = updateSpecialOffers;

$('.apply-specialOffers-check').on('click', function (e) {
    e.preventDefault();
    var specialOffersId = $('#specialBoatID').attr('data-special-id');
    var selectedBoatID = $('#specialBoatID').val();
    var selectedDate = $('#datePopupApplyOffers').attr('data-value');
    var selectedDuration = $('#durationPopupApplyOffers').attr('data-value');
    var selectedTime = $('#startTimePopupApplyOffers').attr('data-value');
    var passengers = $('#passengersPopupApplyOffers').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
    languageSelect = languageSelect.toLowerCase();
    var selectedLocation = '/' + languageSelect + '/boat/index?id=' + selectedBoatID + '&specialOfferId=' + specialOffersId + '&dateSince=' + selectedDate + '&duration=' + selectedDuration + '&timeSince=' + selectedTime + '&adults=' + passengers + '&children=0';
    location.href = selectedLocation;
});

$('#book-payment').on('input', function () {
    $('.errors-booking-form').hide();
    $('.pay-info__terms-error').hide();
    $('#submit-booking').text('Confirm payment');
    $('#submit-booking').removeClass('has-error');
});

$('.submit-booking').on('click', async function (e) {
    e.preventDefault();
    var checkedTerms = $("#agreeVisa").prop('checked');
    var form = $('#book-info');
    var formResponseInform = form.serializeArray();
    var isValidInfo = validateInformationDate(form);
    var formStripe = $('#book-payment');
    var formStripeResponse = formStripe.serializeArray();
    var isValidateStripe = validateStripe(formStripe);
    if (checkedTerms !== true && isValidateStripe !== true) {
        $('.errors-booking-form').show();
        $('.pay-info__terms-error').show();


    } else {
        $('.errors-booking-form').hide();
        $('.pay-info__terms-error').hide();
        var bookingNumber = $('#bookingform-bookingnumber').val();
        if (isValidInfo && checkedTerms === true) {
            $(this).text("Please wait..");
            $.ajax({
                type: 'POST',
                data: formResponseInform,
                url: '/book/post-pay-info',
                success: function (data) {
                    // console.log('info-done');
                    // console.log(data);
                },
                error: function () {
                    console.log('errors');
                }
            });
        } else {
            console.error('Error validation');
        }

        if (isValidateStripe) {
            return true;
        }
        // console.log(isValidInfo);
    }

});
$('#phoneInput').inputmask("+999999999999");
$('#card-number').inputmask('9999 9999 9999 9999');
$('#card-cvv').inputmask('999');
$('#card-expiry').inputmask('99/99');

function validateInformationDate(formDataInformation) {
    // $('.has-error').removeClass('has-error');
    var phoneValue = $('#phoneInput').val();
    var emailValue = $('#bookingform-customeremail').val();
    $(formDataInformation).find(':input').each(function () {
        // Проверяем, пустое ли значение у текущего элемента
        if ($(this).val() === '') {
            if ($(this).attr('id') !== 'undefined') {
                // Если значение пустое, выводим сообщение или выполняем нужные действия
                if ($(this).attr('id') !== 'message') {
                    $(this).addClass('has-error');
                    // console.log('Поле "' + $(this).attr('data-label') + '" не заполнено!');
                    $('.errors-booking-form').show();
                    $('.pay-info__terms-error-validate').show();
                }
            }
        } else {

            $(this).removeClass('has-error');
            $('.pay-info__terms-error-validate').hide();
        }

    });
    // Проверка телефона по маске
    if (!isValidPhone(phoneValue)) {
        console.log('Некорректный номер телефона!');
        $('#phoneInput').addClass('has-error');
        $('.errors-booking-form').show();
        $('.pay-info__terms-error-validate').show();
        return false; // Прекращаем выполнение функции, если номер телефона некорректный
    }
    // Проверка email на подлинность
    if (!isValidEmail(emailValue)) {
        console.log('Некорректный email!');
        $('#bookingform-customeremail').addClass('has-error');
        $('.errors-booking-form').show();
        $('.pay-info__terms-error-validate').show();
        return false; // Прекращаем выполнение функции, если email некорректный
    }
    return true;
}


function validateStripe(formDataStripe) {
    var cardNumber = $('#card-number');
    var cardName = $('#card-name');
    var cardExpire = $('#card-expiry');
    var cardCvv = $('#card-cvv');
    var postalCode = $('#zip-code');
    var form = $('#book-payment');
    var formResponseInform = form.serializeArray();
    $(formDataStripe).find(':input').each(function () {
        // Проверяем, пустое ли значение у текущего элемента
        if ($(this).val() === '') {
            if ($(this).attr('id') !== 'undefined') {
                // Если значение пустое, выводим сообщение или выполняем нужные действия
                if ($(this).attr('id') !== 'zip-code') {
                    $(this).addClass('has-error');
                    // console.log('Поле "' + $(this).attr('data-label') + '" не заполнено!');
                    $('.errors-booking-form').show();
                    $('.pay-stripe-error').show();
                }
            }
        } else {
            $(this).removeClass('has-error');
            $('.pay-stripe-error').hide();
            $('.errors-booking-form').hide();
        }

    });

    return true;

}

function createPaymentTransaction(bookingFormData, stripeData) {
    $.ajax('/book/create-stripe-payment-transaction', {
        data: {
            bookingFormData: bookingFormData,
            stripeData: stripeData
        },
        async: false,
        method: 'POST'
    });
}

// Функция для проверки телефона по маске
function isValidPhone(phone) {
    var phonePattern = /^\+\d{12}$/; // Пример маски для телефона: +1 (123) 456-78-90
    return phonePattern.test(phone);
}

// Функция для проверки email на подлинность
function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

$('.cancel-booking-link').on('click', function (e) {
    e.preventDefault();
    if (window.confirm('Do you really want to cancel this booking?')) {
        alert('Booking canceled');
        var token = $(this).attr('data-cancel-token');
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: '/book/cancel?token=' + token,
            success: function () {

                document.location.href = "/";
            }
        });
        console.log('success ' + token);
    } else {
        location.reload();
    }
});

$('.show-password-login').on('click', function (e) {
    e.preventDefault();
    var inputPassword = $('#password-form-password');
    var fieldType = inputPassword.attr('type');

    if (fieldType === 'password') {
        inputPassword.attr('type', 'text');
    } else {
        inputPassword.attr('type', 'password');
    }
});

$('#login-form-popup input').on('input', function () {
    // Проверяем, заполнены ли все поля формы
    var allFieldsFilled = true;
    $('#login-form-popup input').each(function () {
        if ($(this).val().trim() === '') {
            allFieldsFilled = false;
            $(this).addClass('has-error');
        } else {
            $(this).removeClass('has-error');
        }
    });

    // Если все поля заполнены, активируем кнопку
    if (allFieldsFilled) {
        $('#login-submit-button').prop('disabled', false);
        $('#login-submit-button').addClass('active-button');
        $('.has-error').removeClass('has-error');
    } else {
        $('#login-submit-button').prop('disabled', true);
        $('#login-submit-button').removeClass('active-button');
    }
});

$('#login-submit-button').on('click', function (e) {
    e.preventDefault();
    var loginForm = $('#login-form-popup');
    $.ajax({
        url: '/site/login',
        method: 'POST',
        data: loginForm.serialize(),
        success: function (response) {
            if (response === 'success') {
                document.location.href = "/";
            } else {
                console.log(response);
                $('.form-login-errors').show().html('Password or login not correct.');
            }
        }
    });
});

$('.nav_dashboard').on('click', function (e) {
    e.preventDefault();
    var currentUrlWithoutProtocol = $(this).attr('data-server');
    window.open('https://bo.' + currentUrlWithoutProtocol, '_blank');
    console.log(currentUrlWithoutProtocol);
});


function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

$('#reset-password input').on('input', function () {
    // Проверяем, заполнены ли все поля формы
    var allFieldsFilled = true;
    $('#reset-password input').each(function () {
        if ($(this).val().trim() === '') {
            allFieldsFilled = false;
            $(this).addClass('has-error');
        } else {
            $(this).removeClass('has-error');
        }
    });
    // Если все поля заполнены, активируем кнопку
    if (allFieldsFilled) {
        $('#reset-password-button').prop('disabled', false);
        $('#reset-password-button').addClass('active-button');
        $('.has-error').removeClass('has-error');
    } else {
        $('#reset-password-button').prop('disabled', true);
        $('#reset-password-button').removeClass('active-button');
    }

});


$('#reset-password-button').on('click', function (e) {
    e.preventDefault();
    var emailInput = $('.email-reset-input');
    var email = $('.email-reset-input').val();
    if (emailInput.val().trim() !== '' && validateEmail(email)) {
        $('.email-reset-input').removeClass('has-error');
        console.log('active');
        $('.errors-form').html('');
        $.ajax({
            url: '/site/reset?email=' + emailInput.val(),
            method: 'GET',
            success: function (response) {
                if (response === 'success') {
                    console.log(response);
                    $('.success-form').html(response);
                } else {
                    $('.success-form').html(response);
                }
            }
        });
    } else {
        $('.errors-form').html('Username not found');
        $('#reset-password-button').prop('disabled', true);
        $('.email-reset-input').addClass('has-error');
    }
});

// register-as-agent
$('#phone-number-register').inputmask("+999999999999");
$('#phone-first-step').inputmask("+999999999999");
$('#second-company-phone').inputmask("+999999999999");

function validateAgentForm() {

    $('#register-agent input[type!="radio"]').each(function () {
        // Проверяем, является ли значение пустым или равным пустой строке
        if ($(this).val() === '') {
            // Поле пустое
            $(this).addClass('has-error');
            return false;

        } else {
            // Поле не пустое
            $(this).removeClass('has-error');
        }

    });

    var email = $('#register-agent-email').val();
    if (isValidEmail(email)) {
        $('#register-agent-email').removeClass('has-error');
        return true;
    } else {
        $('#register-agent-email').addClass('has-error');
    }
    return true;

}

$('#submit-register-agent').on('click', function (e) {
    e.preventDefault();
    var formAgent = $('#register-agent');
    var formResponseInform = formAgent.serializeArray();
    var isValidInfo = validateAgentForm(formAgent);
    var checkedTerms = $("#agreeAgentRegister").prop('checked');
    if (checkedTerms != true) {
        $('.register-agent-errors').show();
        $('.register-agent-errors p').html('You must agree to terms and conditions to continue');
    } else {
        $('.register-agent-errors').hide();
        $('.register-agent-errors p').html('');
    }
    if (isValidInfo) {
        $.ajax({
            url: '/site/signup-agent',
            method: 'POST',
            data: formAgent.serialize(),
            success: function (response) {
                if (response === 'The user has been created and is awaiting confirmation by email!') {
                    $('.register-agent-errors').show();
                    $('.register-agent-errors p').html(response);
                } else {
                    console.log(response);
                    $('.register-agent-errors').show();
                    $('.register-agent-errors p').html(response);
                }
            }
        });
    }

});

$('#first-step-owner input').on('input', function () {
    var firstName = $('#first-name-first-step').val();
    var lastName = $('#last-name-first-step').val();
    var phoneNumber = $('#phone-first-step').val();
    var emailOwner = $('#email-first-step').val();

    if (firstName !== '' && lastName !== '' && emailOwner !== '' && phoneNumber !== '' && isValidEmail(emailOwner)) {
        console.log('true');
        $('#two-step-owner').prop('disabled', false);
    } else {
        console.log('false');
        $('#two-step-owner').prop('disabled', true);
    }

});

$('#second-step-owner input').on('input', function () {
    var firstName = $('#first-name-first-step').val();
    var lastName = $('#last-name-first-step').val();
    var phoneNumber = $('#phone-first-step').val();
    var emailOwner = $('#email-first-step').val();
    var companyName = $('#second-company-name').val();
    var companyPhone = $('#second-company-phone').val();
    var companyEmail = $('#second-company-email').val();
    var checkedTerms = $("#agreeCompRegister").prop('checked');
    if (checkedTerms != true) {
        $('.form-owner-register-errors').show();
        $('.form-owner-register-errors p').html('You must agree to terms and conditions to continue');
        $('.form-owner-register-errors p').css('color', 'red');
    } else {
        $('.form-owner-register-errors').hide();
    }
    if (companyName !== '' && companyPhone !== '' && companyEmail !== '' && phoneNumber !== '' && isValidEmail(companyEmail)) {
        console.log('true');
        $('#last-step-submit').prop('disabled', false);

    } else {
        console.log('false');
        $('#last-step-submit').prop('disabled', true);
    }

});

$('#last-step-submit').on('click', function (e) {
    e.preventDefault();
    var firstName = $('#first-name-first-step').val();
    var lastName = $('#last-name-first-step').val();
    var phoneNumber = $('#phone-first-step').val();
    var emailOwner = $('#email-first-step').val();
    var companyName = $('#second-company-name').val();
    var companyPhone = $('#second-company-phone').val();
    var companyEmail = $('#second-company-email').val();
    var checkedTerms = $("#agreeCompRegister").prop('checked');
    console.log(firstName + ' ' + lastName + ' ' + phoneNumber + ' ' + emailOwner + ' ' + companyName + ' ' + companyPhone + ' ' + companyEmail + ' ' + checkedTerms);
    $.ajax({
        method: 'GET',
        url: '/signup/check-email-user?email=' + emailOwner,
        success: function (data) {
            if (data === 'A user with this email already exists') {
                $('.form-owner-register-errors').show();
                $('.form-owner-register-errors p').html(data);
                $('.form-owner-register-errors p').css('color', 'red');
            } else {
                // actionSignup($firstName, $lastName, $phoneNumber, $emailOwner, $companyName, $companyPhone, $companyEmail)
                $('.form-owner-register-errors').hide();
                $('.form-owner-register-errors p').html('');
                $.ajax({
                    method: 'GET',
                    url: '/signup/signup?firstName=' + firstName + '&lastName=' + lastName + '&phoneNumber=' + phoneNumber
                        + '&emailOwner=' + emailOwner + '&companyName=' + companyName + '&companyPhone=' + companyPhone + '&companyEmail=' + companyEmail,
                    success: function (data) {
                        if (data === 'The user has been created and is awaiting confirmation by email!') {
                            console.log('true');
                            $('#popup-register-as-owner').hide();
                            $('#thanks').show();
                        } else {
                            console.log('false');
                        }
                    }
                });
            }
        },
        error: function () {
            $('.form-owner-register-errors').show();
            $('.form-owner-register-errors p').html('Has error in form');
            $('.form-owner-register-errors p').css('color', 'red');
        }
    });
});

$('.form-yacht__ckeck-mobile').on('click', function () {
    var dateString = $('#calendarBook').attr('data-value');

    // Разбиваем строку на день, месяц и год
    var parts = dateString.split('.');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0
    var year = parseInt(parts[2], 10);

    // Создаем объект Date
    var dateObject = new Date(year, month, day);
    updateSingleMobileValue(dateObject);
});

$('#register-agent #individual').on('change', function () {
    var firstName = $('#agent-first-name').val();
    var lastName = $('#agent-last-name').val();

    // Заполнить поле названия компании на основе имени и фамилии
    $('#companyName-register-agent').val(firstName + ' ' + lastName + ' agent');

    // Показать поле с названием компании
    $('#companyName-register-agent').toggle();

});
$('#select-currency').change(function (e){
    e.preventDefault();
    var selectedValue = $(this).val();
    location.href = '/site/change-currency?currency=' + selectedValue;
    console.log(selectedValue);
});


$('.select_form-sort button.select-main__option').on('click' , function (e){
    e.preventDefault();
    var dataId = $(this).attr('data-value');
    var option = $('#sort-by option[value="' + dataId + '"]');
    console.log('click ' + dataId);
    console.log(option.attr('data-url'));
    var sortUrl = option.attr('data-url');
    location.href = sortUrl;
});