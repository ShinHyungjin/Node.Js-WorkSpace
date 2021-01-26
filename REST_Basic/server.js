var http = require("http"); //웹 서버 모듈
var fs = require("fs"); // 파일 시스템 객체 (파일에 대한 입,출력 처리)
var mysql = require("mysql"); // MySQL 외부 모듈 가져오기

var server = http.createServer(function(request, response) {
    //console.log("클라이언트의 요청 url은 " + request.url);
    //console.log("클라이언트의 요청 method는 " + request.method);

    //입력양식폼을 요청하면
    if(request.url=="/rest/board/form" && request.method=="GET") {
        fs.readFile("./main.html","utf-8", function(error, data){
            response.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            response.end(data);
        });
    }else if(request.url=="/rest/board" && request.method=="GET") {   //목록 요청 처리  /rest/board GET방식
        //mysql 연동
        let con = mysql.createConnection({
            url:"localhost",
            user:"root",
            password:"1234",
            database:"android"
        });
        //접속
        var sql = "select * from board order by board_id desc";
        con.query(sql, function(error,record, fields) {
            if(error) {
                response.writeHead(500, {"Content-Type":"application/json;charset=utf8"});
                response.end("에러났음");
            }else {
                console.log(record);
                response.writeHead(200, {"Content-Type":"application/json;charset=utf8"});
                response.end(JSON.stringify(record));
            }
        });
        
    }else if(request.url=="/rest/board/23" && request.method=="GET") {   //상세보기 /rest/board/23
        
    }else if(request.url=="/rest/board" && request.method=="POST") {   //등록  /rest/board POST방식
        request.on("data",function(param){
            var jsonparser = JSON.parse(param);
            console.log(jsonparser);
        let con = mysql.createConnection({
            url:"localhost",
            user:"root",
            password:"1234",
            database:"android"
        });
        //접속
        var sql = "insert into board(title, writer, content) values(?,?,?)";
        con.query(sql, [jsonparser.title, jsonparser.writer, jsonparser.content],function(error,record, fields) {
            if(error) {
                response.writeHead(500, {"Content-Type":"application/json;charset=utf8"});
                response.end("에러났음");
            }else {
                response.writeHead(200, {"Content-Type":"application/json;charset=utf8"});
                response.end("등록 성공");
            }
        });
    });
    }else if(request.url=="/rest/board" && request.method=="PUT") {   //수정  /rest/board PUT방식
        
    }else if(request.url=="/rest/board/23" && request.method=="DELETE") {   //삭제  /rest/board/23 DELETE방식
        
    }

    
        

});



/*
// 접속자 감지
server.on("connection", function() {
    console.log("클라이언트 요청 감지");
});
*/

server.listen(7777, function() {
    console.log("Server is running to 7777 port");
});