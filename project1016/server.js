var http = require("http");
var fs = require("fs");
var express = require("express");
var mysql = require("mysql");
var ejs = require("ejs");
var common = require("./common.js");
var con;

let conStr = {
    url: "localhost",
    user: "root",
    password: "1234",
    database: "node"
};

var static = require("serve-static");
const { request } = require("express");

var app = express();
app.use(static(__dirname + "/static"));
app.use(express.urlencoded({
    extended: true
}));

//console.log("현재 실행중인 파일의 디렉토리 경로 : ", __dirname);

function connect() {
    con = mysql.createConnection(conStr);
}
// app.use(function(request, response) {

// });

app.post("/notice/regist", function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    var title = request.body.title;
    var writer = request.body.writer;
    var content = request.body.content;
    console.log("제목 : ", title, "  작성자 : ", writer, " 내용 : ", content);

    var sql = "insert into notice(title, writer, content) ";
    sql += "values(?,?,?)";

    con.query(sql, [title, writer, content], function (error, fields) {
        if (error) {
            console.log("insert실패", error);
        } else {
            response.end(common.getMsgURL("등록성공", "/notice/list"));
        }
    });

    //response.end("Your http method is post");
});

app.get("/notice/list", function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    var sql = "select * from notice order by notice_id desc"; // 내림차순

    con.query(sql, function (error, record, fields) {
        if (error) {
            console.log("리스트 조회 실패 ", error);
        } else {
            fs.readFile("./list.ejs", "utf-8", function (err, data) {
                if (err) {
                    console.log("실패", err);
                } else {
                    console.log(record);
                    response.end(ejs.render(data, {
                        noticeArray: record
                    }));
                }
            });
        }
    });
});

app.get("/notice/detail", function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    var notice_id = request.query.notice_id;
    var sql = "select * from notice where notice_id=?";

    con.query(sql, [notice_id], function (error, record, fields) {
        if (error) {
            console.log("상세보기 실패", error);
        } else {
            fs.readFile("./detail.ejs", "utf-8", function (err, data) {
                if (err) {
                    console.log("파일읽기 실패", err);
                } else {
                    response.end(ejs.render(data, {
                        notice: record[0]
                    }));
                }
            });
        }
    });
    //response.end(sql);
});

app.post("/notice/del",function(request, response) {
    var notice_id = request.body.notice_id;
    var sql = "delete from notice where notice_id=?";
    
    con.query(sql, [notice_id], function(error,fields) {
        if(error) {
            console.log("삭제실패", error);
        } else {
            response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            response.end(common.getMsgURL("삭제완려","/notice/list"));
        }
    });
});

app.post("/notice/edit",function(request, response) {
    var sql = "update notice set title=?, writer=?, content=?";
    
    con.query(sql, [request.body.title,request.body.writer, request.body.content], function(error,fields) {
        if(error) {
            console.log("수정실패", error);
        } else {
            response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            response.end(common.getMsgURL("수정완려","/notice/list"));
        }
    });
});


var server = http.createServer(app);
server.listen(9999, function () {
    connect();
    console.log("The Server using express modul is Running at 9999 Port...");
});