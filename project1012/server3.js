let conStr = {
    user:"user0907",
    password:"1234",
    connectionString:"localhost/XE"
};

var oracledb = require("oracledb");

oracledb.getConnection(conStr, function(error, con) {
    if(error)
        console.log("실패", error);
    else{
           console.log("성공");
           insert(con);
    }
});

function insert(con) {
    var sql="insert  into  member2(member2_id, firstname,lastname,local,msg)";
    sql += " values( seq_member2.nextval, '퍼맨','수','하우스','쎄오')";
    con.execute(sql, function(error, result, fields) {
        if(error) {
            console.log("실패",error);
        }
        else {
            console.log("성공");
        }
    });
    
}