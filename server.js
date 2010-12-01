//setup web server
var gh = require("grasshopper");
gh.configure({
  viewsDir : "./",
});

//render index
gh.get("/", function() {
  this.render("index");
});

//respond to /say
gh.post("/say", function(args) {
  var self = this;
  var textToSpeak = this.params["say"];
  var voice = this.params["voice"];
  voice = voice? voice : "Vicki";
  
  textToSpeak = textToSpeak.replace(/[~`!@#$%^&*()_+-=":';?\/\\>.<,]/g, "");
  if (/^[A-Za-z0-9\s]*$/.test(textToSpeak) != true) {
    textToSpeak = "congratulations you just won a golden wonka ticket";
  
  //give this an ID
  require("lib/uuid");
  var id = Math.uuid();
  
  var exec = require("child_process").exec;
  var filename = "/voices/" + id + ".aiff";
  exec("say -v " + voice + " -o " + __appRoot + filename + " " + textToSpeak, function(result) {
    //return file descriptor
    self.renderText(filename);
  });
});