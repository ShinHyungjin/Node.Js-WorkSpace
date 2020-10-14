var http = require("http");
var fs = require("fs");
var ejs = require("ejs");
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    fs.readFile("./list.ejs", "utf-8", function (error, data) {
        if (error) {
            console.log("실패", error);
        } else {
            response.end(ejs.render(data));
        }
    });
});

server.listen(7979, function () {
    console.log("EJS Server Running");
});