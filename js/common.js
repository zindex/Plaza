$(function(){
    initCommonFeatures();
    initGallery();
});

function initCommonFeatures(){
    $('ul.shop-list__block .shop-list__inner').hover(
        function(){
            $('.shop-list__popup', $(this)).fadeIn();
            $('.shop-list__popup', $(this)).parents('li').css('z-index',5);
        },function(){
            $('.shop-list__popup', $(this)).stop(true,true).hide();
            $('.shop-list__popup', $(this)).parents('li').css('z-index','auto');
        });

    $('.cnt__header').click(function(e){
        var ttl = $(this),
            block = ttl.nextAll('.shop-list__list').eq(0);
        ttl.toggleClass('cnt__header-active');
        block.toggle();
        e.preventDefault();
    });
    $('.ftr__info-txt-head').click(function(e){
        var ttl = $(this),
            block = ttl.nextAll('.ftr__info-block').eq(0);
        ttl.toggleClass('ftr__info-txt-head-active');
        block.toggle();
        e.preventDefault();
    });

    $('.ico_type_arrow', '.b-input-i').click(function(e){
        $('.news__popup').show();
        e.preventDefault();
    });
    $('.ico_type_close', '.news__popup_inner').click(function(e){
        $('.news__popup').hide();
        e.preventDefault();
    });

    if($.browser.msie){
        $('input[placeholder]').each(function(){

            var input = $(this);

            $(input).val(input.attr('placeholder'));
            input.css('color','#a9a9a9');

            $(input).focus(function(){
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.css('color','#212121');
                }
            });

            $(input).blur(function(){
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.val(input.attr('placeholder'));
                    input.css('color','#a9a9a9');
                }
            });
        });
    }
}

function initGallery(){
    $('#thumbs img').click(function(){
        $('#thumbs img').removeClass("thumbs-active");
        $(this).addClass("thumbs-active");
        $('#largeImage').attr('src',$(this).attr('src').replace('thumb','large'));
    });
    $("#next").click(function(){
        switch_img('next');
        return false;
    });
    $("#prev").click(function(){
        switch_img('prev');
        return false;
    });

    if ( $("#slider").size()){

        var font = $('.slider__block-txt').css('font-size');
        font = parseInt(font.slice(0,2))/14;
        $('.slider__block-txt').css('font-size',font+'em');

        var font2 = $('.slider__block-ttl').css('font-size');
        font2 = parseInt(font2.slice(0,2))/14;
        $('.slider__block-ttl').css('font-size',font2+'em');

        var font3 = $('.slider__block-txt_size').css('font-size');
        font3 = parseInt(font3.slice(0,2))/14;
        $('.slider__block-txt_size').css('font-size',font3+'em');

        slider();
        $(window).resize(function(){
           slider();
        });
    }

    function slider(){
        $("#slider").carouFredSel({
            circular: true,
            auto : 2000,
            infinite: true,
            width : "100%",
            responsive : true,
            items: {
                width : 450,
                visible: {
                    max: 3,
                    min:1
                }
            },
            scroll: {
                duration: 1200,
                pauseOnHover: true
            }
        }).parent().css('height', '115px');

        if ($(".slider__block-left").width() < 202 ){
            $('.slider__block').css('font-size','60%');
        } else {
            $('.slider__block').css('font-size','100%');
        }
    }

    function switch_img(direction)
    {
        count = $('#thumbs img').length;
        activeIndex = $('#thumbs .thumbs-active').index();

        if(direction == "next") activeIndex++;
        if(direction == "prev") activeIndex--;

        if(activeIndex == count) activeIndex = 0;

        var image = $('#thumbs img:eq(' + activeIndex + ')');
        $('#thumbs img').removeClass("thumbs-active");
        image.addClass("thumbs-active");
        $('#largeImage').attr('src',image.attr('src').replace('thumb','large'));
    }
}

function initMonthPagination() {
    //scrollpane parts
    var scrollPane = $( ".action__month-i" ),
        scrollContent = $( ".jsToggleMonth"),
        totalWidth = 0;

    $('.action__month-inner a, .jsToggleMonth .action__month-inner h3',scrollContent).each(function(){
        totalWidth += $(this).outerWidth();
    });

    $('.action__month-inner',scrollContent).css('width',totalWidth);

    // Variable to hold scroll type
    var slideDrag,
        slideWidth = scrollContent.width(),
        maxScroll = totalWidth*0.5;

    // Initialize sliders
    var scrollbar = $("#slider-line").slider({
        value:0,
        animate: 300,
        start: checkType,
        slide: doSlide,
        max: slideWidth,
        change: function(){
            if(slideDrag == true){
                changeSlide();
            }
            ajaxChangeMonths();
        }
    });

    if (scrollbar.length){
        $('.jsToggleMonth a').click(function(e, ui){
            var that = $(this);

            scrollContent.animate({
                'margin-left': -that.position().left * (maxScroll / slideWidth)
            }, 200, function(){
                $('.ui-slider-handle',scrollbar).animate({
                    left: that.position().left + that.width()/2
                },200);
            });

            that.siblings('a').removeClass('selected');
            that.addClass('selected');
            changebottom(that);
            ajaxChangeMonths();

            e.preventDefault();
        });
    }

    var t = setTimeout(function(){
        $('.jsToggleMonth a.selected').click();
    },500);

    $('.action__month_bottom a').click(function(e){
        if ($(this).hasClass('g-left')){ $('.jsToggleMonth a.selected').prevAll('a').eq(0).click();}
        if ($(this).hasClass('g-right')){ $('.jsToggleMonth a.selected').nextAll('a').eq(0).click();}
        if ($(this).hasClass('selected')){ $('.jsToggleMonth a.selected').click();}

        e.preventDefault();
    });


    function checkType(e){
        slideDrag = $(e.originalEvent.target).hasClass("ui-slider-handle");
    }

    function doSlide(e, ui){
        // Was it a click or drag?
        if (slideDrag == true){
            // User dragged slider head, match position
            scrollContent.css({'margin-left': -ui.value * (maxScroll / slideWidth) });
            changeSlide();
        }
        else{
            // User clicked on slider itself, animate to position
            scrollContent.stop().animate({
                'margin-left': -ui.value * (maxScroll / slideWidth)
            }, 200, function(){
                changeSlide();
            });

        }
    }
    function changeSlide(e,ui){
        $.each($('.jsToggleMonth a'),function(key,value){
            var left = $(this).position().left - 4,
                right = $(this).width() + left + 12,
                handleLeft = $('.ui-slider-handle',scrollbar).position().left + $(this).width()/2,
                choose = $('.jsToggleMonth a').eq(key);
            if ( left < handleLeft && handleLeft < right){
                $('.ui-slider-handle',scrollbar).animate({
                    left: left + $(this).width()/2 + 4
                }, 200);
                choose.siblings('a').removeClass('selected');
                choose.addClass('selected');
                changebottom(choose);
            }
        });
    }

    function changebottom(link){
        var tmonth = link.text(),
            prevmonth = link.prevAll('a').eq(0),
            nextmonth = link.nextAll('a').eq(0),
            bmonth = $('.action__month_bottom a.selected');
        bmonth.text(tmonth + ' ' + link.attr('data-year'));
        if (prevmonth.text() == ''){
            bmonth.prev('a').text('');
        }
        else {
            bmonth.prev('a').text(prevmonth.text() + ' ' + prevmonth.attr('data-year'));
        }
        if (nextmonth.text()== ''){
            bmonth.next('a').text('');
        }
        else {
            bmonth.next('a').text(nextmonth.text() + ' ' + nextmonth.attr('data-year'));
        }
    }

    //changing months via ajax
    function ajaxChangeMonths(){
        console.log('ajax result goes here');


    }

}


