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