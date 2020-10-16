exports.getMsgURL = function (msg, url) {
    var tag = "<script>";
    tag += "alert('" + msg + "');";
    tag += "location.href='" + url + "';";
    tag += "</script>";
    return tag;
}