
jQuery( document ).ready(function() {
    $('.FOOTER-ARROW').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
    $( ".ARROW-FIXED" ).hide();
    $('#menu .search-button').click(function(){
      menu.goSearch();
    });
    $('#menu .search-input').keypress(function(event){
      if ( event.which == 13 ) { menu.goSearch();}
    });
    $('#menu-mobile .search-button').click(function(){
      menu.goSearchMobile();
    });
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
    },
    goSearch:function(){
      var val = $('#menu .search-input').val()
      location.href = '/search/?q='+val
    },
    goSearchMobile:function(){
      var val = $('#menu-mobile .search-input').val()
      location.href = '/search/?q='+val
    }
}
