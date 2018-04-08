/**
 * Created by apple on 2018/4/2.
 */
function zpost(name,param,callback){
    $.ajax({
        type: 'POST',
        url: name,
        data: param,
        dataType: 'json',
        timeout: 300,
        success: function(data){
            callback(data);
        },
        error: function(xhr, type){
            zalert('Ajax error!')
        }
    })
}

function showloading(){
    $.showIndicator();
}

function hideloading(){
    $.hideIndicator();
}

function showLoading(title){
    $.showPreloader(title);
}

function hideLoading(){
    $.hidePreloader();
}

function zinfo(title){
    $.toast(title);
}

function zalert(text,title,callback){
    $.alert(text, title, callback());
}

function zcomfirm(text,title,success,cancel){
    $.confirm(text, title,success(),cancel());
}

function zprompt(text,title,success,cancel){
    $.prompt(text, title,success(val),cancel(val));
}

function zmodel(text,title,buttons){
    $.modal({
        title:  title,
        text: text,
        verticalButtons: true,
        buttons: buttons
    })
}

function getParam(name){
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = location.hash.substring(1).match(reg);
    if (arr != null) {
        return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    }
    return "";
}

function getRandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

//字符函数: startWith
String.prototype.startWith = function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
};

//字符函数: endWith
String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
};

//字符函数: 全替换
String.prototype.replaceAll = function(s1, s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};

function isValidDate(iY, iM, iD) {
    var a=new Date(iY,iM-1,iD);
    var y=a.getFullYear();
    var m=a.getMonth()+1;
    var d=a.getDate();
    if (y!=iY || m!=iM || d!=iD)
        return false;
    return true
}

function isNum(str){
    if(str == "")
        return false;
    return !isNaN(str);
}

function isMobile(s){
    var patrn=/^1[0-9]{10}$/;
    if(!patrn.exec(s))
        return false;
    return true;
}

function isInteger(str) {
    if(/[^\d]+$/.test(str)){
        return false;
    }
    return true;
}

function isNum(str){
    if(str == "")
        return false;
    return !isNaN(str);
}

function isIDCard(StrNo){
    StrNo = StrNo.toString();
    if(StrNo.length==18){
        var a,b,c;
        if(!isInteger(StrNo.substr(0,17)))
            return false;

        if(!isValidDate(StrNo.substr(6,4),StrNo.substr(10,2),StrNo.substr(12,2)))
            return false;

        a=parseInt(StrNo.substr(0,1))*7+parseInt(StrNo.substr(1,1))*9+parseInt(StrNo.substr(2,1))*10;
        a=a+parseInt(StrNo.substr(3,1))*5+parseInt(StrNo.substr(4,1))*8+parseInt(StrNo.substr(5,1))*4;
        a=a+parseInt(StrNo.substr(6,1))*2+parseInt(StrNo.substr(7,1))*1+parseInt(StrNo.substr(8,1))*6;
        a=a+parseInt(StrNo.substr(9,1))*3+parseInt(StrNo.substr(10,1))*7+parseInt(StrNo.substr(11,1))*9;
        a=a+parseInt(StrNo.substr(12,1))*10+parseInt(StrNo.substr(13,1))*5+parseInt(StrNo.substr(14,1))*8;
        a=a+parseInt(StrNo.substr(15,1))*4+parseInt(StrNo.substr(16,1))*2;
        b=a%11;

        if(b==2)
            c=StrNo.substr(17,1).toUpperCase(); //转为大写X
        else
            c=parseInt(StrNo.substr(17,1));

        switch(b){
            case 0:
                if(c!=1)
                    return false;
                break;
            case 1:
                if(c!=0)
                    return false;
                break;
            case 2:
                if(c!="X")
                    return false;
                break;
            case 3:
                if(c!=9)
                    return false;
                break;
            case 4:
                if(c!=8)
                    return false;
                break;
            case 5:
                if(c!=7)
                    return false;
                break;
            case 6:
                if(c!=6)
                    return false;
                break;
            case 7:
                if(c!=5)
                    return false;
                break;
            case 8:
                if(c!=4)
                    return false;
                break;
            case 9:
                if(c!=3)
                    return false;
                break;
            case 10:
                if(c!=2)
                    return false;
        }
    }else{
        return false;
    }

    return true;
}

function isCorrectName(name){
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
        len = 0;
    //判断字符串字符长度
    for (var i = 0; i < name.length; i++) {
        var a = name.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null)
        {
            len += 2;
        }
        else
        {
            len += 1;
        }
    }
    if(regEn.test(name) || regCn.test(name)) {
        return false;
    }
    if(len > 20) {
        return false
    }
    return true;
}

//获取某年某月的天数
function getDays(year,month){
    return 33 - new Date(year,month-1,33).getDate();
}

//获取某天是星期几
function getWeek(year,month,day){
    var week = new Date(year,month-1,day).getDay();
    if(week == 0) week = 7;
    return week;
}

Date.prototype.format=function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

//function formatTime(value){
//    value = value.replaceAll("-","/").replace(".0","");
//    return new Date(value);
//}

//function getDate(){
//    var d = new Date();
//    //return formatTime(d.format("yyyy-MM-dd") + " 00:00:00");
//    return d.format("yyyy-MM-dd") + " 00:00:00";
//}

function getJson(obj){
    return JSON.stringify(obj);
}

function getObj(str){
    return JSON.parse(str);
}