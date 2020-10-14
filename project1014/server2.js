var http = require("http");
var url = require("url");
var querystring = require("querystring");

var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    if (request.method == "GET") {
        console.log("요청 Method : ", request.method);
        response.end("요청 Method : ", request.method);

        var urljson = url.parse(request.url, true);
        var param = urljson.query;
        console.log("--GET 분석결과--");
        console.log(urljson);
        console.log("ID : ", param.id);
        console.log("PW : ", param.pass);
    }
    else if (request.method == "POST") {
        console.log("요청 Method : ", request.method);
        response.end("요청 Method : ", request.method);

        request.on("data", function (postparam) {
            var str = querystring.parse(postparam.toString());
            console.log("--POTS 분석결과--");
            console.log(str);

            console.log("ID : ", str.id);
            console.log("PW : ", str.pass);
        });
    }
});

server.listen(9999, function () {
    console.log("My Server Is Running at 9999 Port...");
});