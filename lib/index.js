$(document).ready(function() {
  var hitEnter = function(event) {
    _waiting = true;
    var speech = $("input#say").val();
    var voice = $("select#voice").val();
    $("input#say").val("");
    var chat = document.getElementById("chat");
    
    $.ajax({
       async: true,
       url: "/say",
       type: "POST",
       contentType: "application/json",
       dataType: "plaintext",
       data : {
         say: speech,
         voice: voice,
       },
       success: function(fileInfo) {
         var fileJson = JSON.parse(fileInfo);
         var id = fileJson.id;
         var filename = fileJson.filename;
         
         //create an embed element, play it, remove the element
         var badBrowserMsg = "If you are reading this, you need to update your browser. Might I suggest Chrome or Firefox 3?"
         var embedded = "<audio id='" + id + "' src='" + filename + "' autoplay='autoplay'>" + badBrowserMsg + "</audio>";
         $("div#empty").append(embedded);
         
         var oldCommand = document.createElement("p");
         oldCommand.innerHTML = "<em>root@~ $say '" + speech + "' -v " + voice + "</em>";
         chat.appendChild(oldCommand);
         chat.scrollTop = 1000000;
       },
       error: function(somethingOrNothing) {
         //should play an error message :-D
         //alert("wonk! " + somethingOrNothing);
         var err = document.createElement("p");
         err.innerHTML = "<em>root@~ $ say 'oh noes an error' </em>";
         chat.appendChild(err);
         chat.scrollTop = 1000000;
       }
    });
  }
  $("input#say").keypress(function(event) {
    if (event.keyCode == 13) { hitEnter(); return false;}
  });
  $("input#say").focus();
});