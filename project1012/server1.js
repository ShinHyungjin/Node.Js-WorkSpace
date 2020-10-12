/*http 모듈로 웹서버 구축하기*/
var http = require("http"); 
var fs = require("fs");
let conStr = {
    user:"user0907",
    password:"1234",
    connectionString:"localhost/XE"
};

//서버는 클라이언트의 요청이 들어오면, 반드시 응답을 해야 한다..
//http 메카니즘이다..만일 응답을안하면?? 클라이언트는 무한정 서버의 응답을 기다리므로
//무한대기상태에 빠진다...
//서버객체를 생성 
//서버 객체 생성시, 요청정보와 응답정보를 구성할 수 있는 request, response객체가 매개변수로
//전달될 수 있다..
var server = http.createServer( function(request, response){
    //request 객체로는 클라이언트의 요청 정보를 처리할 수 있고, 
    //response  객체는 클라이언트에게 전송할 응답 정보를 구성할 수 있다..
    console.log("클라이언트의 요청을 받았습니다");
    // response.writeHead(200, {"Content-Type":"image/jpeg;"});//편지 봉투 구성하기!!
    // fs.readFile("../images/1.jpg", function(error, data) {
    //     response.end(data);
    // });

    fs.readFile("JQuery유효성검사.html","utf-8", function(error, data) {
        response.end(data);
    });
    
    //컨텐츠 전송 (클라이언트의 브라우저가 받게될 내용)
    // response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});//편지 봉투 구성하기!!
    // var tag = "<input type=\"text\"/>";
    // tag += "<button>가입</button>";
    // response.end(tag);//클라이언트에게 응답 정보 전송
});

//접속자를 감지
/*
server.on("connection", function(){
    console.log("접속자 감지");
});
*/




//서버가동 
/*
모든 네트워크 프로그램은 포트번호가 있어야 한다..
왜?? 하나의 os 내에서 수많은 네트워크 프로그램들간 엉키지 않기 위해....
ex) 오라클 1521 포트  , mysql 3306 포트...
*/
server.listen(8989, function(){
    console.log("Server is running at 8989 port...");
});
