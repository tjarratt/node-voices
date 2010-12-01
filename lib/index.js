$.ready(function() {
  _waiting = false;
  $("input#submit").click(function(event) {
    _waiting = true;
    $.ajax({
       async: true,
       url: "/say",
       type: "POST",
       contentType: "application/json",
       dataType: "plaintext",
       data : {
         say: $("input#say").val(),
         voice: $("select#voice").val();
       },
       success: function(pathToFile) {
         _waiting = false;
         //create an embed element, play it, remove the element
         $("div#empty").append();
       }
       error: function(somethingOrNothing) {
         //should play an error message :-D
         _waiting = false;
         alert("wonk! " + somethingOrNothing);
       }
    });
  });
});