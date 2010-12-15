var sys = require("sys");
__appRoot = __dirname;
sys.puts("starting server with root: " + __appRoot);

var express = require("express");
var app = express.createServer(
  express.compiler({src: __dirname, enable: ["sass"]}),
  express.staticProvider(__dirname)
);

app.set("views", __dirname);
app.set("view engine", "jade");

app.get("/", function(req, res) {
  console.log("AAAAH");
  sys.puts("waaaha");
  process.nextTick(cleanDirtyDirectories);
  res.render("index", {});
});

app.post("/say", function(request, response) {
  var ajaxData = "/say?",
      self = this;
  
  request.on("data", function(chunk) {
    console.log("got data chunk");
    ajaxData += chunk;
  });
  request.on("end", function() {
    console.log("got all data");
    gotAllData(ajaxData);
  });
  
  var gotAllData = function(ajaxData) {        
    require.paths.unshift('vendor/mongodb');//TODO: parse this data
    var mongoose = require(__appRoot + '/vendor/mongoose/mongoose').Mongoose;
    mongoose.model("Voice", {
      properties: ["id", "filepath", "text"],
      cast: {
        id: String,
        filepath: String,
        text: String,
      },
      indexes: ["id"],
    });
    var db = mongoose.connect("mongodb://localhost/db");
    var Voice = db.model("Voice");
    var thisVoice = new Voice();
    
    ajaxData = require("url").parse(ajaxData, true).query;
    
    var textToSpeak = ajaxData.say;
    var voice = ajaxData.voice;
    voice = voice? voice : "Vicki";
    
    var voiceModel = new Voice;
    voiceModel.text = textToSpeak;

    textToSpeak = textToSpeak.replace(/[~`!@#$%^&*()_+-=":';?\/\\>.<,]/g, "");
    if (/^[A-Za-z0-9\s]*$/.test(textToSpeak) != true) {
      textToSpeak = "CONGRATULATIONS YOU JUST FOUND A GOLDEN WONKA TICKET";
      //TODO: email admin, need to update this regex
    }

    //give this an ID so we can embed it on the client
    require("lib/uuid");
    var id = Math.uuid();

    var exec = require("child_process").exec;
    var filename = "/voices/" + id + ".aiff";
    
    voiceModel.id = id;
    voiceModel.filepath = filename;
    voiceModel.save();
    
    exec("say -v " + voice + " -o " + __appRoot + filename + " " + textToSpeak, function(result) {
      //return file descriptor
      sys.puts("returning id:" + id + " and file: " + filename);
      response.send(JSON.stringify({"id" : id, "filename" : filename}));
    });
  }
});

app.listen(3000);
console.log("Express app started on port 3000");

var cleanDirtyDirectories = function() {
  var exec = require("child_process").exec;
  exec("rm " + __appRoot + "/voices/*", function(test) {
    console.log(test);
    console.log("did we delete all the old .aiff files?");
  });
}