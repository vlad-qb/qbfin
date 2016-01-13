
jQuery( document ).ready(function() {
    $('.FOOTER-ARROW').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
    $( ".ARROW-FIXED" ).hide();
});

$( document ).scroll(function() {
  var h = $(document).height() - $(window).height();
  var scroll = $(window).scrollTop();
  var bottomscroll = h - scroll;
  if(scroll > 100){
    $( ".ARROW-FIXED" ).show();
      if(bottomscroll > 270){
        $( ".ARROW-FIXED" ).show();
      }else{
        $( ".ARROW-FIXED" ).hide();
      }
  }else{
    $( ".ARROW-FIXED" ).hide();
  }
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
    },
    showSearch:function(){
      $('.icon-search').hide();
      $('.search').fadeIn('fast');
      $('.search-button').show();
    }
}
