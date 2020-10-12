/* 
var os = require("os");
console.log(os.hostname());
console.log(os.cpus());
*/

var url = require("url");
var result = url.parse("https://terms.naver.com/search.nhn?query=banana");
console.log(result.query);