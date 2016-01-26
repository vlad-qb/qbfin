var formHandler = {
    formData: false,
    send: function(formId){
        formHandler.formData = $(formId).serialize()
        $.post( "/receive/index.php", formHandler.formData ,function(data){
            alert(data)
            if(data.response == 'success')
                location.href = "success.php"
            //else
                //location.href = "error.php"
        } ).error(function() { 
            //location.href = "error.php" 
        });
        return false;
    }
}
