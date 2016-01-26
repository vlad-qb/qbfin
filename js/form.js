var formHandler = {
    formData: false,
    send: function(formId){
        formHandler.formData = $(formId).serialize()
        $.post( "/receive/index.php", formHandler.formData ,function(data){
            if(data.response == 'success')
                location.href = "success.php"
            else
                location.href = "error.php"
        }, 'json' ).error(function() { 
            location.href = "error.php" 
        });
        return false;
    }
}
