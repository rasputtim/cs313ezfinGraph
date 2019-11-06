(function ($) {
    // USE STRICT
    "use strict";
    $( "#date_from" ).datepicker({
        dateFormat: "yy-mm-dd",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-calendar-alt"></i>',
    });

    $( "#date_to" ).datepicker({
        dateFormat: "yy-mm-dd",
        showOn: "both",
        buttonText : '<i class="zmdi zmdi-calendar-alt"></i>',
    });
	$( "#inidate" ).datepicker({
        dateFormat: "yy-mm-dd"
    });

    $( "#enddate" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
	
	$( "#keydate" ).datepicker({
        dateFormat: "yy-mm-dd"
    });

    $( "#duedate" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
	
	 $( "#paydate" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
	$( "#text-start_date" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
	
	 $( "#text-end_date" ).datepicker({
        dateFormat: "yy-mm-dd"
    });

})(jQuery);

function confirmation() {
message = 'Are you sure?';
      return confirm(message);
}

function Tang(){
    var x = document.getElementById("quantity").value;//lay gia tri cu trong text
    if(parseInt(x) >= 0){
        document.getElementById("quantity").value = parseInt(x) +1;// + gia tri lay dc len 1 roi gan kq vao o text
    }
}
function Giam(){
    var x = document.getElementById("quantity").value;
    if(parseInt(x) >= 1){
        document.getElementById("quantity").value = parseInt(x) -1;
    }
}