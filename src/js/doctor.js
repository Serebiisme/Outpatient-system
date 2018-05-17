/**
 * Created by apple on 2018/4/21.
 */


/**
 * 首页
 */
app.controller('doctorController',function($scope){
    console.log('doctor');

    //初始化banner
    $(".swiper-container").swiper({
        autoplay : 3000,
        pagination : '.swiper-pagination',
        loop: true
    });

    $.init();
});
/**
 * 预约管理
 */
app.controller('managerController',function($scope){
    console.log('manager');
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

        //zcomfirm('确实该患者已完成就诊?',"", function () {
        //    zpost('complateAppointment',{id:this.x.id}, function (data) {
        //        zinfo(data.msg);
        //        if(data.code == 200 ){
        //            $scope.appointmentList.splice(index,1);
        //            $scope.$apply();
        //        }
        //    });
        //
        //}.bind(this));
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
    var d = new Date(),dm = new Date();
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
app.controller('healtheducationController',function($scope){
    console.log('healtheducation');

    $.init();
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
