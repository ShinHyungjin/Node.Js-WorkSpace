var http = require("http") // http 모듈
var url = require("url"); // url 분석모듈
var fs = require("fs"); // file system 파일 읽기 쓰기 모듈
var mysql = require("mysql") // mysql 외부 모듈
var con; // mysql 접속 정보를 가진 객체, 이 객체로 sql 수행
var ejs = require("ejs"); // node 서버에서만 실행가능한 문서

let conStr = {  //mysql 접속 문자열
    url: "localhost",
    user: "root",
    password: "1234",
    database: "node"
};

var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=utf8" }); // 응답코드 (200정상, 404에러 등)
    url = url.parse(request.url, true); // 분석결과를 json으로 반환
    console.log("url 분석 결과 : ", url);

    if (url.pathname == "/") {
        fs.readFile("./index.html", "utf-8", function (error, data) {
            if (error) {
                response.end("index 읽기실패", error);
                console.log("index 읽기실패", error);
            } else {
                response.end(data);
            }
        });
    } else if (url.pathname == "/member/registForm") {
        fs.readFile("./registForm.html", "utf-8", function (error, data) {
            if (error) {
                response.end("registForm 읽기실패", error);
                console.log("registForm 읽기실패", error);
            } else {
                response.end(data);
            }
        });

    } else if (url.pathname == "/member/loginForm") {
        fs.readFile("./loginForm.html", "utf-8", function (error, data) {
            if (error) {
                response.end("loginForm 읽기실패", error);
                console.log("loginForm 읽기실패", error);
            } else {
                response.end(data);
            }
        });

    } else if (url.pathname == "/member/regist") {
        //response.end("mysql에 정보를 전송합니다..");
        var sql = "insert into member2(uid,password,uname,phone,email,addr,memo,receive)";
        sql += " values(?,?,?,?,?,?,?,?)";

        var param = url.query;
        con.query(sql, [param.uid,
        param.password,
        param.uname,
        param.phone,
        param.email,
        param.addr,
        param.memo,
        param.receive], function (error, result, fields) {
            if (error) {
                console.log("실패", error);
                response.end("실패");
            } else {
                //방금 insert 된 회원의 pk조회
                sql = "select last_insert_id() as member2_id";
                con.query(sql, function (error, record, fields) {
                    if (error) {
                        console.log("실패", error);
                    } else {
                        console.log("조회 : ", record);
                        var member2_id = record[0].member2_id;

                        for (var i = 0; i < param.skill_id.length; i++) {
                            sql = "insert into member_skill(member2_id, skill_id) values(" + member2_id + "," + param.skill_id[i] + ")";
                            console.log("스킬 등록 쿼리 : ", sql);

                            con.query(sql, function (err) {
                                if (err) {
                                    console.log("실패", err);
                                } else {
                                    console.log("회원정보 등록 완료");
                                    response.end("회원정보 등록 완료");
                                }
                            });
                        }

                    }
                });


            }
        });

    } else if (url.pathname == "/member/list") {
        // 회원목록 보여주기
        var sql = "select * from member2";
        con.query(sql, function (error, result, fields) {
            if (error) {
                console.log("실패", error);
            } else {
                //console.log("회원목록 : ", result);
                var tag = "<table width:'100%' border='1px'>";
                tag += "<tr>";
                tag += "<td> member2_id </td>";
                tag += "<td> uid </td>";
                tag += "<td> password </td>";
                tag += "<td> uname </td>";
                tag += "<td> phone </td>";
                tag += "<td> email </td>";
                tag += "<td> addr </td>";
                tag += "<td> receive </td>";
                tag += "</tr>";

                for (var i = 0; i < result.length; i++) {
                    var member = result[i];
                    tag += "<tr>";
                    tag += "<td><a href='/member/detail?member2_id=" + member.member2_id + "'>" + member.member2_id + "</a></td>";
                    tag += "<td>" + member.uid + "</td>";
                    tag += "<td>" + member.password + "</td>";
                    tag += "<td>" + member.uname + "</td>";
                    tag += "<td>" + member.phone + "</td>";
                    tag += "<td>" + member.email + "</td>";
                    tag += "<td>" + member.addr + "</td>";
                    tag += "<td>" + member.receive + "</td>";
                    tag += "</tr>"
                }
                tag += "<tr>";
                tag += "<td colspan='9'><a href='/'>메인으로</a></td>";
                tag += "</tr>";
                tag += "</table>";
                response.end(tag);
            }
        });
    } else if (url.pathname == "/member/detail") { //회원의 상세정보 요청
        var member2_id = url.query.member2_id;

        //mysql 에서 데이터가져오기
        var sql = "select * from member2 where member2_id=" + member2_id;

        con.query(sql, function (error, record, fields) {
            if (error) {
                console.log("회원 1건 조회 실패", error);
            } else {
                //console.log("3번 회원의 정보 : ", record);
                var obj = record[0];//0번째에 들어있는 json 추출 

                fs.readFile("./detail.ejs", "utf-8", function (error, data) {
                    if (error) {
                        console.log("detail.ejs 읽기 실패", error);
                    } else {
                        response.end(ejs.render(data, {
                            member: obj //json 자체를 보내버림
                        })); //그냥 보내지 말고, 서버에서 실행한 후 그 결과를 보내자
                    }
                });
            }
        });
    } else if (url.pathname == "/fruit") {
        var f1 = "apple";
        var f2 = "banana";
        fs.readFile("./test.ejs", "utf-8", function (error, data) {
            if (error) {
                console.log("실패", error);
            } else {
                response.end(ejs.render(data, {
                    fruit: f1
                }));
            }
        });
    }

});

function getConnection() {
    con = mysql.createConnection(conStr); // json을 매개변수로 넣어주면 됨
}

server.listen(7878, function () {
    console.log("My Server is Running at 7878 Port...");
    getConnection();
});