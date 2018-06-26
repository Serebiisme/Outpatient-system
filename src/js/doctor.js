/**
 * Created by apple on 2018/4/21.
 */


/**
 * 首页
 */
app.controller('doctorController',function($scope){
    console.log('doctor');

    $scope.arr = null;
    $scope.bannerArr = null;

    //初始化生活资讯
    $.ajax({
        type: 'POST',
        url: $lifeArticleUrl + $scope.lifeStartNum,
        dataType: 'jsonp',
        timeout: 7500,
        success: function(data){
            $scope.arr = data.body.slice(0,3);
            console.log($scope.arr);
            $scope.$apply();
        },
        error: function(xhr, type){
            zalert('加载失败,请重新加载...!');
        }
    });

    //初始化banner
    zpost('getbanner',{}, function (data) {
        $scope.bannerArr = data.data;
        $scope.$apply();
        //初始化banner
        $(".swiper-container").swiper({
            autoplay : 3000,
            pagination : '.swiper-pagination',
            loop: true
        });
    });

    $.init();
});
/**
 * 预约管理
 */
app.controller('manageController',function($scope){
    console.log('manage');
    $scope.appointmentList = null;

    $(document).off('refresh', '.pull-to-refresh-content');
    $(document).on('refresh', '.pull-to-refresh-content',function(e) {
        zpost('/getAppointment',{doctorid:window.client.id}, function (data) {
            var arr = data.data;
            arr.forEach(function (e) {
                e.name || (e.name = '暂未预约');
            });
            $scope.appointmentList = arr;
            $scope.$apply();
            // 加载完毕需要重置
            $.pullToRefreshDone('.pull-to-refresh-content');
        });
    });

    $scope.finishAppointment = function () {
        //console.log(this.$index);
        var index = this.$index;

        if (!this.x.patientid){
            zinfo('该单尚未预约!');
            return false;
        }

        $.modal({
            title:'添加病历',
            text:'<textarea style="border: 1px solid #bbb;width: 90%;height: 6.5rem;border-radius: 5px;" autofocus></textarea>',
            extraClass:'addCase',
            buttons: [
                {
                    text: '<span style="color: #e43e56;">取消</span>',
                    close:true
                },
                {
                    text: '<span>确定</span>',
                    bold: true,
                    onClick: function() {
                        var val = $('.addCase textarea').val();

                        if(val == ""){
                            zalert('请输入病历情况!');
                            return false;
                        }

                        zpost('complateAppointment',{id:this.x.id,result:val}, function (data) {
                            zinfo(data.msg);
                            if(data.code == 200 ){
                                $scope.appointmentList.splice(index,1);
                                $scope.$apply();
                            }
                        });

                    }.bind(this)
                }
            ]
        });
    };

    $scope.cancelAppointment = function () {
        //console.log(this.$index);
        var index = this.$index;

        if (this.x.patientid){
            zinfo('该预约单已被预约,不能取消!');
            return false;
        }

        zcomfirm('确实取消该预约?',"温馨提示", function () {
            zpost('cancelAppointment',{id:this.x.id}, function (data) {
                zinfo(data.msg);
                if(data.code == 200 ){
                    $scope.appointmentList.splice(index,1);
                    $scope.$apply();
                }
            });
        }.bind(this));
    };

    $.init();

    //初始化触发;
    $('.pull-to-refresh-content').trigger('refresh');
});
/**
 * 设置页面
 */
app.controller('settingController',function($scope,$location){
    console.log('setting');
    window.client.intro || (window.client.intro = '暂无简介');
    $scope.myintro = window.client;

    //退出登录
    $scope.logout = function(){
        zalert('确定要退出登录吗?','提示', function () {
            window.client = {};
            $location.url('login');
            $scope.$apply();
        });
        //history.go(1-history.length-1);
    };

    $.init();
});
/**
 * 新增预约
 */
app.controller('addappointmentController',function($scope){
    console.log('addappointment');
    var dd = new Date(),dm = new Date(),
        d = new Date((dd/1000+86400*1)*1000);
        dm.setMonth(d.getMonth() + 1);
    $scope.minDate = d.format("yyyy-MM-dd");
    $scope.maxDate = dm.format("yyyy-MM-dd");

    $("#date-picker").calendar({
        value: [$scope.minDate],
        minDate: $scope.minDate,
        maxDate: $scope.maxDate
    });

    $scope.submitappointment = function () {
        var a_info = getFormToJson('#appointmentform');
        console.log(a_info);

        if(a_info.address == ""){
            zalert('地址不能为空!');
            return false;
        }

        zpost('addappointment',{
            doctorid:window.client.id,
            date:new Date(a_info['date']).format("yyyy-MM-dd"),
            time:a_info['time'],
            address:a_info['address'],
            number:a_info['number'],
            department:window.client.department
        },function(data){
            zinfo(data.msg);
            console.log(data);
        })
    };

    $.init();
});
/**
 * 预约日历
 */
app.controller('calendarController',function($scope){
    console.log('calendar');
    var d = new Date(),dm = new Date();
    dm.setMonth(d.getMonth() + 1);
    $scope.minDate = d.format("yyyy-MM-dd");
    $scope.maxDate = dm.format("yyyy-MM-dd");
    $scope.dateList = [];

    //初始化日历
    $("#calendardetail").calendar({
        value: [$scope.minDate],
        minDate: $scope.minDate,
        maxDate: $scope.maxDate
    });

    //获取存在订单的日期
    zpost('getCalendar',{doctorid:window.client.id}, function (data) {
        //console.log(data);
        if (data.code == 500){
            zinfo(data.msg);
            return false;
        }

        var arr = data.data;
        arr.forEach(function (e) {
            var item = e.date,selector;
            item = item.split('-');
            item[1] = +item[1] - 1;
            item[2] = +item[2];
            e.date = item.join('-');
            selector = '#calendardetail div[data-date="' + e.date + '"] span';
            //$(selector).css({
            //    'background':"#e43e56",
            //    'color':'#fff'
            //});
            $(selector).addClass('active');
            $(selector).attr('status','1');
        });
        console.log(arr);
    });

    //点击获取该日期的订单
    $('#calendar #calendardetail .picker-calendar-day').off('click','span');
    $('#calendar #calendardetail .picker-calendar-day').on('click','span',function(){
        //console.log('点击日期');
        var status = $(this).attr('status'),
        //    date = new Date($(this).parent()[0].dataset.date);
        //date.setMonth(date.getMonth() + 1);
        //date = date.format("yyyy-M-d");
            date = $(this).parent()[0].dataset.date.split('-');
        date[1] = +date[1] + 1;
        date = date.join('-');
        console.log(date);
        if(status == '1') {
            //console.log('可查询单元');
            $('#calendar #calendardetail .picker-calendar-day span.active').removeClass('selected');
            $(this).addClass('selected');
            zpost('getDateList',{date:date,doctorid:window.client.id}, function (data) {
                if(data.code == 500){
                    zinfo(data.msg);
                } else {
                    console.log(data);

                    data.result.forEach(function (item) {
                        item.name == null && (item.name = '暂无患者');
                        item.telephone == null && (item.telephone = '暂无联系方式');
                    });

                    $scope.dateList = data.result;
                    $scope.$apply();
                }
            })
        } else {
            $('#calendar #calendardetail .picker-calendar-day span.active').removeClass('selected');
            $scope.dateList = [];
            $scope.$apply();
        }
    });

    $scope.showDatsListDetail = function () {
        $.modal({
            title:  '预约单详情',
            text: '<p style="margin: 0 1rem;text-align: left">编号:' + this.item.id + '</p>' +
                  '<p style="margin: 0 1rem;text-align: left">就诊时间:' + this.item.time + '</p>' +
                  '<p style="margin: 0 1rem;text-align: left">就诊地点:' + this.item.address + '</p>' +
                  '<p style="margin: 0 1rem;text-align: left">患者姓名:' + this.item.name + '</p>' +
                  '<p style="margin: 0 1rem;text-align: left">患者手机:' + this.item.telephone + '</p>' +
                  '<p style="margin: 0 1rem;text-align: left">预约状态:' + this.item.status + '</p>' ,
            buttons: [{text: '确定'}]
        })
    };

    $.init();
});
/**
 * 健康教育
 */
app.controller('healtheducationController',function($scope,$location){
    console.log('healtheducation');

    $scope.tabIndex = !!0;
    $scope.lifeList = [];
    $scope.busnessList = [];
    $scope.ifload = 0;
    $scope.lifeStartNum = 1;
    $scope.busnessStartNum = 1;

    //tab切换
    $scope.switchTab = function(){
        $scope.tabIndex = !$scope.tabIndex;
        $.refreshScroller();
    };

    //跳转详情页
    $scope.goToInformationDetail = function(){
        var id = this.item.id,
            path = '/informationDetail?id=' + id + "&type=1";
        $location.url(path);
    };

    // 添加'refresh'监听器
    $(document).off('refresh', '.pull-to-refresh-content');
    $(document).on('refresh', '.pull-to-refresh-content',function(e) {
        $scope.ifload = 0;
        $scope.lifeStartNum = 0;
        $scope.busnessStartNum = 0;

        console.log('loadInformationList');

        //初始化生活资讯
        $.ajax({
            type: 'POST',
            url: $lifeArticleUrl + $scope.lifeStartNum,
            dataType: 'jsonp',
            timeout: 7500,
            success: function(data){
                $scope.lifeList = data.body;
                $scope.ifload < 2 && $scope.ifload++;
                console.log('A:' + $scope.ifload);
                $scope.$apply();
            },
            error: function(xhr, type){
                zalert('加载失败,请重新加载...!');
                $.pullToRefreshDone('.pull-to-refresh-content');
            }
        });

        //初始化行业资讯
        $.ajax({
            type: 'POST',
            url: $busnessArticleUrl + $scope.busnessStartNum,
            dataType: 'jsonp',
            timeout: 7500,
            success: function(data){
                $scope.busnessList = data.body;
                $scope.ifload < 2 && $scope.ifload++;
                console.log('B:' + $scope.ifload);
                $scope.$apply();
            },
            error: function(xhr, type){
                zalert('加载失败,请重新加载...!');
                $.pullToRefreshDone('.pull-to-refresh-content');
            }
        });

    });

    //无限滚动
    var loading = false;
    $(document).off('infinite', '.infinite-scroll-bottom');
    $(document).on('infinite', '.infinite-scroll-bottom',function() {

        // 如果正在加载，则退出
        if (loading) return;

        //tabindex - false : life , true : busnes
        if ($scope.tabIndex){
            console.log('load more busness article');
            $scope.busnessStartNum++;
            $.ajax({
                type: 'POST',
                url: $busnessArticleUrl + $scope.busnessStartNum,
                dataType: 'jsonp',
                timeout: 7500,
                success: function(data){
                    loading = !loading;

                    data.body.length == 0 && $.detachInfiniteScroll('.infinite-scroll-bottom');

                    $scope.busnessList = $scope.busnessList.concat(data.body);
                    $scope.$apply();
                    $.refreshScroller();
                },
                error: function(xhr, type){
                    zalert('加载失败,请重新加载...!');
                    $.refreshScroller();
                }
            });
            loading = !loading;

        } else {
            console.log('load more life article');
            $scope.lifeStartNum = $scope.lifeStartNum + 1;
            console.log( $scope.lifeStartNum);
            $.ajax({
                type: 'POST',
                url: $lifeArticleUrl + $scope.lifeStartNum,
                dataType: 'jsonp',
                timeout: 7500,
                success: function(data){
                    loading = !loading;

                    data.body.length == 0 && $.detachInfiniteScroll('.infinite-scroll-bottom');

                    $scope.lifeList = $scope.lifeList.concat(data.body);
                    $scope.$apply();
                    $.refreshScroller();
                },
                error: function(xhr, type){
                    zalert('加载失败,请重新加载...!');

                }
            });
            loading = !loading;
        }

        console.log('刷新');
        $.refreshScroller();
    });


    $scope.$watch("ifload",function(newValue, oldValue) {
        // 加载完毕需要重置
        newValue == 2 && $.pullToRefreshDone('.pull-to-refresh-content');
    });

    $.init();//放最后

    //初始化触发;
    $('.pull-to-refresh-content').trigger('refresh');
});
/**
 * 医生个人信息
 */
app.controller('doctorintroController', function ($scope) {
    console.log('doctorintro');
    $scope.myintro = {
        '姓名':window.client.name,
        '性别':window.client.gender,
        '手机':window.client.telephone,
        '职称':window.client.title,
        '科室':window.client.department,
        '医生编号':window.client.id
    };
    $scope.intro = window.client.intro;
    $.init();
});
/**
 * 医生个人简介
 */
app.controller('editintroController', function ($scope)   {
    console.log('editintro');

    $scope.intro = window.client.intro;

    $scope.submiteditintro = function(){
        var d_intro = $('[name=editintro]').val();
        zpost('editintro',{doctorid:window.client.id,intro:d_intro}, function (data) {
            console.log(data);
            if (data.code == 200){
                zinfo(data.msg);
                window.client.intro = d_intro;
            } else {
                zinfo(data.msg);
            }
      });
    };
    $.init();
});
