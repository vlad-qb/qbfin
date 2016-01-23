var formHandler = {
    formData: false,
    send: function(formId){
        formData = $(formId).serialize()
        $.post( "/receive/", formData ,function(data){
            if(data.response == 'success')
                location.href = "success.php"
            else
                location.href = "error.php"
        } ).error(function() { 
            location.href = "error.php" 
        });
        return false;
    }
}
