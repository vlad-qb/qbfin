
jQuery( document ).ready(function() {
    $('.FOOTER-ARROW').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});



var menu = {
    slideDown:function(){
        $("html, body").animate({ scrollTop: 0 }, 0);
        $('#menu-mobile').animate({height: $( document ).height()+"px",top: "0px"}, 150);
        $( 'body' ).css("overflow","hidden");
        $('.header').hide();
    },
    slideUp:function(){
        $('#menu-mobile').animate({height: "800px",top: "-800px"}, 300);
        $( 'body' ).css("overflow","scroll");
        $('.header').fadeIn(300);
    }
}
