$('.open-book-popup').on('click', function () {
   $('body').css("overflow","hidden");
});

$('.open-offer-popup').on('click', function () {
   $('body').css("overflow","hidden");
});

$('.criteriapiker__close').on('click', function () {
   $('body').css("overflow","auto");
});

$('.items-boats-clean').on('click', function ( ){
   $(this).toggleClass('open-items');
});


$('.select-language .select-main__option').on('click', function (e){
   e.preventDefault();
   alert('click')
});