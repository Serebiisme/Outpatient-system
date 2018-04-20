/**
 * Created by apple on 2018/4/8.
 */

//资讯根链接
var $lifeArticleUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticlelist?catid=6&onlyorgan=1&organid=1&page=',
    $busnessArticleUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticlelist?catid=5&onlyorgan=1&organid=1&page=',
    $articleDetailUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticle?aid=';

//用户info
var client = null;

//页面回退
$(document).on('click','.back',function(){
    history.go(-1);
});

$(document).on('click','.item-link',function(){
    var href = $(this).attr('href');
    href && (location.hash = href);
});