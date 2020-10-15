var http = require("http");
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var ejs = require("ejs");
var querystring = require("querystring");
var urljson;
var con;

let conStr = {
    url: "localhost",
    user: "root",
    password: "1234",
    database: "node"
};

var server = http.createServer(function (request, response) {
    urljson = url.parse(request.url, true);
    response.writeHead(200, { "Content-Type": "text/html;charset:utf8" });

    if (urljson.pathname == "/") {
        fs.readFile("./index.html", "utf-8", function (error, data) {
            if (error) {
                console.log("실패", error);
            } else {
                response.end(data);
            }
        });
    } else if (urljson.pathname == "/member/registForm") {
        registForm(request, response);
    } else if (urljson.pathname == "/member/regist") {
        regist(request, response);
    } else if (urljson.pathname == "/member/loginForm") {
        loginForm(request, response);
    } else if (urljson.pathname == "/member/detail") {
        getDetail(request, response);
    } else if (urljson.pathname == "/member/list") {
        getList(request, response);
    } else if (urljson.pathname == "/member/del") {
        del(request, response);
    } else if (urljson.pathname == "/member/edit") {
        update(request, response);
    } else if (urljson.pathname == "/category") {
        getCategory(request, response);
        //console.log(request.url);
    }
});

function regist(request, response) {
    request.on("data", function (param) {
        var postParam = querystring.parse(param.toString());
        console.log("postParam = ", postParam);

        var sql = "insert into member2(uid, password, uname, phone, email, addr, memo, receive)";
        sql += "values(?,?,?,?,?,?,?,?)";

        con.query(sql, [postParam.uid,
        postParam.password,
        postParam.uname,
        postParam.phone,
        postParam.email_id + "@" + postParam.email_server,
        postParam.addr,
        postParam.memo,
        postParam.receive
        ], function (error, fields) {
            if (error) {
                console.log("회원정보 삽입 실패", error);
            } else {
                response.end("<script>alert('등록완료');location.href='/member/list';</script>");
            }
        });
    });
}
function registForm(request, response) {
    var sql = "select * from skill";
    con.query(sql, function (error, record, fields) {
        if (error) {
            console.log("skill 조회실패", error);
        } else {
            console.log(record);
            fs.readFile("./registForm.ejs", "utf-8", function (err, data) {
                if (error) {
                    console.log("실패", err);
                } else {
                    response.end(ejs.render(data, {
                        skillArray: record
                    }));
                }
            });
        }
    });
}
function loginForm(request, response) {

}

function getDetail(request, response) {
    // console.log("urlJson : ", urlJson.query);
    var member2_id = urljson.query.member2_id;
    var sql = "select * from member2 where member2_id =" + member2_id;
    con.query(sql, function (error, record, fields) {
        fs.readFile("./detail.ejs", "utf-8", function (error, data) {
            if (error) {
                console.log("detail.ejs 읽기 실패", error);
            } else {
                response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" })
                response.end(ejs.render(data, {
                    member: record[0]
                }));
            }
        });
    });
}

//회원목록 처리함수 
function getList(request, response) {
    //회원 목록 가져오기 
    var sql = "select * from member2";
    con.query(sql, function (error, record, fields) {
        if (error) {
            console.log("조회 실패", error);
        } else {
            fs.readFile("./list.ejs", "utf-8", function (error, data) {
                if (error) {
                    console.log("list.ejs 읽기실패", error);
                } else {
                    response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    response.end(ejs.render(data, {
                        memberArray: record
                    }));
                }
            });
        }
    });

}
function del(request, response) {
    var member2_id = urljson.query.member2_id;
    var sql = "delete from member2 where member2_id=" + member2_id;

    con.query(sql, function (error, fields) {
        if (error) {
            console.log("삭제 실패", error);
        } else {
            response.end("<script>alert('탈퇴 완료!');location.href='/member/list';</script>");
        }
    });
}
//회원정보 수정 처리
function update(request, response) {
    //post로 전송된 파라미터들을 받자!!
    request.on("data", function (param) {
        var postParam = querystring.parse(param.toString());

        //검증용
        //var sql="update member2 set phone='"+postParam.phone+"', email='"+postParam.email+"', addr='"+postParam.addr+"',memo='"+postParam.memo+"'";
        //sql+=", password='"+postParam.paassword+"', receive='"+postParam.receive+"' where member2_id="+postParam.member2_id;

        var sql = "update member2 set phone=?, email=?, addr=?,memo=?";
        sql += ", password=?, receive=? where member2_id=?";

        con.query(sql, [
            postParam.phone,
            postParam.email,
            postParam.addr,
            postParam.memo,
            postParam.password,
            postParam.receive,
            postParam.member2_id
        ], function (error, fields) {
            if (error) {
                console.log("수정실패", error);
            } else {
                //alert 띄우고, 회원 목록 보여주기 
                var tag = "<script>";
                tag += "alert('수정되었습니다');";
                tag += "location.href='/member/detail?member2_id=" + postParam.member2_id + "';";
                tag += "</script>";
                response.end(tag);
            }
        });

    });
    //response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    //response.end(sql);

}
//동물의 종류 가져오기 
function getCategory(request, response){
    var sql="select * from category";

    con.query(sql, function(error, record, fields){
        if(error){
            console.log("동물구분 목록 조회실패", error);
        }else{
            fs.readFile("./animal.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("animal.ejs 읽기 실패", err);
                }else{
                    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        categoryArray:record
                    }));
                }           
            });
        }
    });
}
function ConnectionDB() {
    con = mysql.createConnection(conStr);
}

server.listen(8888, function () {
    console.log("8888 Server Running");
    ConnectionDB();
});