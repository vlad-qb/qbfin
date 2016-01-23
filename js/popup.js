    function popup(){
      var html =  
      '   <div class="form-row">' +
      '       <input id="name" type="text" name="name" required="required"' +
      '       placeholder="Имя" />' +
      '   </div>' +
      '   <div id="phone" class="form-row">' +
      '       <input type="text" name="phone" required="required"' +
      '       placeholder="Телефон" />' +
      '   </div>'+
      '   <div id="time" class="form-row">' +
      '       <input type="text" name="time" ' +
      '       placeholder="Время звонка" />' +
      '   </div>';
      new $.flavr({                
          title       : 'Отправить заявку',
          content     : 'на консультацию по стратегиям управления активами',
          dialog      : 'form',
          buttons     : {
              submit  : { text: 'Отправить', style: 'danger', 
                action: function($container,$form){
                  $.post( "/receive/", $form.serialize() ,function(data){
                    if(data.response == 'success')
                      location.href = "success.php"
                    else
                      location.href = "error.php"
                  } ).error(function() { 
                      location.href = "error.php" 
                  });
                  return false;
                }},
              cancel : { text: 'Отмена' }      
          },
          form        : { content: html, method: 'post' }
      });
    }
