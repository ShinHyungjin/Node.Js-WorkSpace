/*웹서버를 구축하여, 클라이언트가 전송한 파라미터 값들을 
 mysql에 넣어보자!*/

var http=require("http"); //http 모듈 가져오기 
var fs = require("fs"); // File system 모듈 가져오기

 //http모듈로 부터 server 객체 생성하기 
 var server = http.createServer(function(request, response){

   //1)클라이언트가 회원가입 양식을 보기를 원하면 회원가입 관련 코드를
   //2)가입을 원할경우엔 DB에 넣어야 함
   //3)이미지를 원할경우 이미지를 보여줘야함
   //4)오디오를 원하면 오디오를...

   //클라이언트의 요청을 선행적으로 분석해야함 (request객체 이용)

   console.log(request.url);
   //서버에 존재하는 회원가입양식 폼파일을 읽어서, 클라이언트의 브라우저에 보내주자!!
   fs.readFile("JQuery유효성검사.html", "utf-8" , function(error, data){
      if(error){
         console.log("파일을 읽지 못했습니다.", error);
      }else{
         //http 프로토콜 상 , 약속을 지켜서, 즉 형식을 지켜서 보내자 
         response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"}); 
         response.end(data);//클라이언트에게 컨텐츠 전송
      }
   });


 });

 //서버 가동하기 
 server.listen(7979, function(){
    console.log("Server is running at 7979 port..."); 
 });

