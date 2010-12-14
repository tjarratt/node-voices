var sys = require("sys");
__appRoot = __dirname;
sys.puts("starting server with root: " + __appRoot);

//setup web server
var gh = require("grasshopper");
gh.configure({
  viewsDir : "./",
});

var cleanDirtyDirectories = function() {
  var exec = require("child_process").exec;
  exec("rm " + __appRoot + "/voices/*");
}

//render index
gh.get("/", function() {
  this.render("/index");
});

//respond to /say
gh.post("/say", function(args) {
  var self = this;
  
  //could be a timing issue here
  process.nextTick(cleanDirtyDirectories);
  
  ajaxData = "/say?";
  var request = gh.request;
  request.on("data", function(chunk) {
    ajaxData += chunk;
  });
  request.on("end", function() {
    gotAllData(ajaxData);
  });
  
  var gotAllData = function(ajaxData) {        
    require.paths.unshift(__appRoot + '/vendor/mongoose');
    var mongoose = require('mongoose').Mongoose;
    
    ajaxData = require("url").parse(ajaxData, true).query;
    
    var textToSpeak = ajaxData.say;
    var voice = ajaxData.voice;
    voice = voice? voice : "Vicki";

    textToSpeak = textToSpeak.replace(/[~`!@#$%^&*()_+-=":';?\/\\>.<,]/g, "");
    if (/^[A-Za-z0-9\s]*$/.test(textToSpeak) != true) {
      textToSpeak = "congratulations you just won a golden wonka ticket";
      //TODO: email admin
    }

    //give this an ID so we can embed it on the client
    require("lib/uuid");
    var id = Math.uuid();

    var exec = require("child_process").exec;
    var filename = "/voices/" + id + ".aiff";
    
    exec("say -v " + voice + " -o " + __appRoot + filename + " " + textToSpeak, function(result) {
      //return file descriptor
      sys.puts("returning id:" + id + " and file: " + filename);
      self.renderText(JSON.stringify({"id" : id, "filename" : filename}));
    });
  }
});

gh.serve(8080);