$(document).ready(function() {
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
         voice: $("select#voice").val(),
       },
       success: function(fileInfo) {
         var fileJson = JSON.parse(fileInfo);
         var id = fileJson.id;
         var filename = fileJson.filename;
         
         //create an embed element, play it, remove the element
         var badBrowserMsg = "If you are reading this, you need to update your browser. Might I suggest Chrome or Firefox 3?"
         var embedded = "<audio id='" + id + "' src='" + filename + "' autoplay='autoplay'>" + badBrowserMsg + "</audio>";
       },
       error: function(somethingOrNothing) {
         //should play an error message :-D
         _waiting = false;
         alert("wonk! " + somethingOrNothing);
       }
    });
  });
});