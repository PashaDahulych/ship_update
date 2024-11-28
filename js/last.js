$('#checkFilterHome').on('click', function (e) {
   e.preventDefault();
   var selectedDate = $('#date').attr('data-value');
   var selectedDuration = $('#duration').attr('data-value');
   var selectedTime = $('#startTime').attr('data-value');
   var selectedPassengers = $('#passengers').attr('data-value');
   var sort = $('.get-sort-parametrs').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
   languageSelect = languageSelect.toLowerCase();
   if(sort) {
      var locations = '/' + languageSelect + '/dubai?durationType=1&dateSince=' + selectedDate + '&timeSince=' + selectedTime + '&duration=' + selectedDuration + '&adults=' + selectedPassengers + '&sort=' + sort;
      location.href = locations;
   }else{
      var locations = '/' + languageSelect + '/dubai?durationType=1&dateSince=' + selectedDate + '&timeSince=' + selectedTime + '&duration=' + selectedDuration + '&adults=' + selectedPassengers + '&sort=offers';
      location.href = locations;
   }

});

$('#mobileCheckHome').on('click', function (e){
   e.preventDefault();
   var selectedDate = $('#datePopup').attr('data-value');
   var selectedDuration = $('#durationPopup').attr('data-value');
   var selectedTime = $('#startTimePopup').attr('data-value');
   var selectedPassengers = $('#passengersPopup').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
   languageSelect = languageSelect.toLowerCase();
   var locations = '/' + languageSelect + '/dubai?durationType=1&dateSince=' + selectedDate + '&timeSince=' + selectedTime + '&duration=' + selectedDuration + '&adults=' + selectedPassengers + '&sort=offers';
   location.href = locations;
});

// https://charterclick.com/en/dubai?durationType=1&dateSince=&timeSince=13%3A00&duration=4&adults=12&
// durationType=1&dateSince=&timeSince=13%3A00&duration=4&adults=12&instantBooking=1&year=2002&cabins=2&type=motor_yacht&suitables%5B%5D=73&harbourId=293&sort=offers
$('.options__input').on('click', function (){
   var selectedYears = $('input[name="year"]:checked');
   var valuesYears = selectedYears.map(function() {
      return 'year=' + $(this).val();
   }).get();
   var joinedYears = valuesYears.join('&');
   if(joinedYears.length === 0) {
      joinedYears = 'year=';
   }

   var selectedTypes = $('input[name="type"]:checked');
   var valuesTypes = selectedTypes.map(function () {
      return 'type=' + $(this).val();
   }).get();
   var jounedTypes = valuesTypes.join('&');
   if(jounedTypes.length === 0) {
      jounedTypes = 'type=';
   }

   var selectedCabins = $('input[name="cabin"]:checked');
   var valuesCabins = selectedCabins.map(function () {
      return 'cabins=' +  $(this).val();
   }).get();
   var joinedCabins = valuesCabins.join('&');
   if(joinedCabins.length === 0) {
      joinedCabins = 'type=';
   }

   var selectedSuitables = $('input[name="suitable"]:checked');
   var valuesSuitables = selectedSuitables.map(function () {
      return 'suitables=' + $(this).val();
   }).get();
   var joinedSuitables = valuesSuitables.join('&');
   if(joinedSuitables.length === 0) {
      joinedSuitables = 'suitables=';
   }

   var selectedHarbor = $('input[name="marina"]:checked');
   var valuesHarbor = selectedHarbor.map(function () {
      return 'harbourId=' + $(this).val();
   }).get();
   var joinedHarbours = valuesHarbor.join('&');
   if(joinedHarbours.length === 0) {
      joinedHarbours = 'harbourId=';
   }

   var sort = $('.get-sort-parametrs').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
   languageSelect = languageSelect.toLowerCase();
   var selectedDate = $('#date').attr('data-value');
   var selectedDuration = $('#duration').attr('data-value');
   var selectedTime = $('#startTime').attr('data-value');
   var selectedPassengers = $('#passengers').attr('data-value');
   var locations = '/' + languageSelect + '/dubai?durationType=1&dateSince=' + selectedDate + '&timeSince=' + selectedTime + '&duration=' + selectedDuration + '&adults=' + selectedPassengers
       + '&' + joinedYears  + '&' + joinedCabins + '&' + jounedTypes + '&' + joinedSuitables + '&' + joinedHarbours +'&sort=' + sort + '';
   location.href = locations;
});

$('#checkFilterHomeFilter').on('click', function (e) {
   e.preventDefault();
   var selectedYears = $('input[name="year"]:checked');
   var valuesYears = selectedYears.map(function() {
      return 'year=' + $(this).val();
   }).get();
   var joinedYears = valuesYears.join('&');
   if(joinedYears.length === 0) {
      joinedYears = 'year=';
   }

   var selectedTypes = $('input[name="type"]:checked');
   var valuesTypes = selectedTypes.map(function () {
      return 'type=' + $(this).val();
   }).get();
   var jounedTypes = valuesTypes.join('&');
   if(jounedTypes.length === 0) {
      jounedTypes = 'type=';
   }

   var selectedCabins = $('input[name="cabin"]:checked');
   var valuesCabins = selectedCabins.map(function () {
      return 'cabins=' +  $(this).val();
   }).get();
   var joinedCabins = valuesCabins.join('&');
   if(joinedCabins.length === 0) {
      joinedCabins = 'type=';
   }

   var selectedSuitables = $('input[name="suitable"]:checked');
   var valuesSuitables = selectedSuitables.map(function () {
      return 'suitables=' + $(this).val();
   }).get();
   var joinedSuitables = valuesSuitables.join('&');
   if(joinedSuitables.length === 0) {
      joinedSuitables = 'suitables=';
   }

   var selectedHarbor = $('input[name="marina"]:checked');
   var valuesHarbor = selectedHarbor.map(function () {
      return 'harbourId=' + $(this).val();
   }).get();
   var joinedHarbours = valuesHarbor.join('&');
   if(joinedHarbours.length === 0) {
      joinedHarbours = 'harbourId=';
   }

   var sort = $('.get-sort-parametrs').attr('data-value');
    var languageSelect = $('.lang-select a').attr('data-language');
   languageSelect = languageSelect.toLowerCase();
   var selectedDate = $('#date').attr('data-value');
   var selectedDuration = $('#duration').attr('data-value');
   var selectedTime = $('#startTime').attr('data-value');
   var selectedPassengers = $('#passengers').attr('data-value');
   var locations = '/' + languageSelect + '/dubai?durationType=1&dateSince=' + selectedDate + '&timeSince=' + selectedTime + '&duration=' + selectedDuration + '&adults=' + selectedPassengers
       + '&' + joinedYears  + '&' + joinedCabins + '&' + jounedTypes + '&' + joinedSuitables + '&' + joinedHarbours +'&sort=' + sort + '';
   location.href = locations;
});

$('.reset-filters-button').on('click', function (e) {
   e.preventDefault();
    var languageSelect = $('.lang-select a').attr('data-language');
   languageSelect = languageSelect.toLowerCase();
   location.href = '/' + languageSelect + '/dubai';

});

$(window).on('load', function() {
   // Предполагается, что атрибут data-date находится на элементе с id="date"
   var dateValue = $('#date').attr('data-date');
   if (dateValue) {
      $('#date').val(dateValue);
   }
});