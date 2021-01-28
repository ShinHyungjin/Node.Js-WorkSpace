var http = require("http");
var static = require("serve-static");
var express = require("express");

var app = express();
app.use(static(__dirname+"/static"));

var server = http.createServer(app);

server.listen(7777, function() {
    console.log("Server is running at 7777 port");
});