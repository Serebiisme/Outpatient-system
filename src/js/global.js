/**
 * Created by apple on 2018/4/8.
 */

//页面回退
$(document).on('click','.back',function(){
    history.go(-1);
});