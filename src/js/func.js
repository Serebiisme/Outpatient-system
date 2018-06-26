/**
 * 首页
 */
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log('index');
    $scope.arr = null;
    $scope.bannerArr = null;

    $.init();//放最后

    //初始化推荐医生
    zpost('recommendDoctor',{}, function (data) {
        if(data.code == 500 ){
            zinfo(data.msg);
        } else {
            data.data.forEach(function (e) {
                e.intro == null && (e.intro = '暂无简介') ;
            });
            $scope.arr = data.data;
            $scope.$apply();
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
});
/**
 * 医院页
 */
app.controller('hospitalController',function($scope,$compile){
    console.log('hospital');

    $scope.hospital = null;
    $scope.hospinfo = null;

    zpost('getHospitalInfo',{}, function (data) {
        $scope.hospital = {
            '医院简介':{
                stretchFlag:false,
                content:data.data[0].hospIntroduction
            },
            '医院荣誉':{
                stretchFlag:false,
                content:data.data[0].hospHonor
            },
            '医院特色':{
                stretchFlag:false,
                content:data.data[0].hospFeature
            }
        };

        $scope.hospinfo = {
            name : data.data[0].hospName,
            address : data.data[0].hospAddress,
            phone : data.data[0].hospPhone
        };

        $scope.$apply();
    });

    $scope.toggleStretch = function (){
        this.val.stretchFlag = !this.val.stretchFlag;
    };

    $.init();//放最后
});
/**
 * 预约挂号页
 */
app.controller('appointmentController',function($scope,$location){
    console.log('appointment');

    $scope.department = null;
    $scope.hospinfo = null;

    $scope.showdoctorlist = function () {
        //console.log(this);
        $location.url('/doctorlist?department=' + this.x);
    };

    //初始化科室
    zpost('getAllDepartment',{}, function (data) {

        $scope.department = data.result.map(function (item) {
            return item.department;
        });
        $scope.$apply();
    });

    //zpost('getHospitalInfo',{}, function (data) {
    //
    //    $scope.hospinfo = {
    //        name : data.data[0].hospName,
    //        address : data.data[0].hospAddress,
    //        phone : data.data[0].hospPhone
    //    };
    //
    //    $scope.$apply();
    //});

    $.init();//放最后
});

/**
 * 预约医生列表页
 */
app.controller('doctorlistController', function ($scope,$location) {
    console.log('doctorlist');
    //日期计算
    var dateArr = [];
    for (var i = 0 ; i < 7 ;  i++){
        (function(i){
            var d = new Date();
            d.setDate(d.getDate() + i);
            d = d.format('yyyy-MM-dd').slice(5);
            dateArr.push({
                day:"周"+"日一二三四五六".charAt(new Date(d).getDay()),
                date:d
            });
        })(i)
    }

    $scope.dateArr = dateArr;
    $scope.department =  $location.search().department;
    $scope.doctorlist = null;
    $scope.currentDate = null;
    //console.log('科室选择:' + $scope.department );

    //初始化
    $scope.checkLast = function($last){
        var today = new Date().format('yyyy-MM-dd');
        if($last){
            $('#doctorlist .btn-group .button').eq(0).addClass('active');
            $scope.currentDate = today;
            zpost('getDoctorlist',{date:today,department:$scope.department}, function (data) {
                if(data.code == 500){
                    zinfo(data.msg);
                } else {
                    $scope.doctorlist = data.data;
                    $scope.$apply();
                }
            })
        }
    };

    //选择日期
    $scope.selectDate = function () {
        $('#doctorlist .btn-group .button').removeClass('active').eq(this.$index).addClass('active');

        var d = new Date();
            d = d.format('yyyy');
        var date = d + "-" + this.date.date,
            department = $scope.department;
        $scope.currentDate = date ;
        zpost('getDoctorlist',{date:date,department:department}, function (data) {
            if(data.code == 500){
                zinfo(data.msg);
            } else {
                $scope.doctorlist = data.data;
                $scope.$apply();
            }
        })
    };

    //点击进入医生详情
    $scope.showDoctorDetail = function () {
        console.log('showdetail');
        var doctorid = this.doctor.doctorid,
            date = $scope.currentDate;

        $location.url('doctordetail?doctorid='+doctorid+"&date="+date);
    };

    $.init();
});

/**
 * 医生具体预约列表
 */
app.controller('doctordetailController', function ($scope,$location) {
    console.log('doctordetail');
    var doctorid = $location.search().doctorid,
        date = $location.search().date;

    zpost('getDoctorinfo',{doctorid:doctorid}, function (data) {
        $scope.doctroInfo = data.data[0];
        updateCurrent(doctorid,date);

    });

    function updateCurrent(doctorid,date){
        zpost('getCurrentAppointment',{doctorid:doctorid,date:date}, function (data) {
            $scope.d_appointlist = data.data;
            $scope.$apply();
        });
    }

    $scope.doctroInfo = null;
    $scope.d_appointlist = [];
    $scope.selectedDate = date;

    $scope.confirmAppointment = function(){
        zcomfirm('确认预约该门诊订单?','提示', function () {
            zpost('confirmAppointment',{id:this.item.id,patientid:window.client.id},function(data){
                if (data.code == 500) {
                    zinfo(data.msg);
                } else {
                    updateCurrent(doctorid,date);
                    zinfo('预约成功!');
                }
            });
        }.bind(this));
    };

    $.init();
});

/**
 * 医生搜索页面
 */
app.controller('searchController',function($scope,$locals,$location){
    console.log('search');

    //获取历史搜索医生列表
    $scope.historyArr = $locals.getObject('historySearch').history && $locals.getObject('historySearch').history.reverse().slice(0,5);

    //搜索医生
    $scope.foundDoctor = function () {
        var keyValues = $('#search').val(),
            historySearch = $locals.getObject('historySearch');
        document.activeElement.blur();  //移动端收齐键盘

        //输入不等于空
        if (keyValues != "" && isCorrectName(keyValues)){
            //点击搜索后续操作
            JSON.stringify(historySearch) == '{}' ? (function () {
                historySearch.history = [];
                historySearch.history.push(keyValues);
            })():(function () {
                historySearch.history.push(keyValues);
            })();

            $locals.setObject('historySearch',historySearch);

            $location.url('searchresult?keyval=' + keyValues);
        } else {
            zinfo('输入有误,请重新输入!');
        }
    };

    //历史记录搜索
    $scope.goToSearch = function () {
        $location.url('searchresult?keyval=' + this.history);
    };

    //清理历史记录
    $scope.clearHistory = function () {
        $scope.historyArr = [];
        $locals.setObject('historySearch',{});
    };

    $.init();//放最后
});

/**
 * 搜索详情页
 */
app.controller('searchresultController', function ($scope,$location) {
    console.log('searchresult');

    $scope.allresult = null;
    $scope.nodata = false;
    $scope.whichtitle = $location.search().status;

    var searchname = $location.search().keyval;

    showLoading('搜索中');
    zpost('searchDoctor',{keyval:searchname}, function (data) {
        hideLoading();
        if (data.code == 500){
            zinfo(data.msg);
        } else {
            $scope.allresult = data.data;
            $scope.nodata = JSON.stringify($scope.allresult) == '{}';
            $scope.$apply();
        }
    });

    $scope.goToAppointment = function () {
        var date = this.date,
            doctorid = this.$parent.key;

        $location.url('doctordetail?doctorid='+doctorid+"&date="+date);
    };

    $.init();
});

/**
 * 个人信息页面
 */
app.controller('myintroController',function($scope,$location){
    console.log('myintro');
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

    $.init();//放最后
});

/**
 * 我的信息
 */
app.controller('myintrodetailController',function($scope){
    console.log('myintrodetail');
    $scope.myintro = {
        '姓名':window.client.name,
        '性别':window.client.gender,
        '生日':window.client.birthday,
        '手机':window.client.telephone,
        '医保编号':window.client.id
    };

    $.init();
});

/**
 * 健康咨询页
 */
app.controller('informationController',function($scope,$location){
    console.log('information');

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
            path = '/informationDetail?id=' + id;
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
 * 资讯详情页
 */
app.controller('informationDetailController',function($scope,$location){
    console.log('informationDetail');

    $scope.id = $location.search().id;
    $scope.article = {};
    $scope.type = $location.search().type;

    //初始化资讯详情
    $.ajax({
        type: 'POST',
        url: $articleDetailUrl+ $scope.id +'&pubver=1',
        dataType: 'jsonp',
        timeout: 7500,
        success: function(data){
            $scope.article = data.body;
            $scope.$apply();
        },
        error: function(xhr, type){
            alert('Ajax error!')
        }
    });

    $.init();//放最后
});
/**
 * 我的预约页
 */
app.controller('concernController',function($scope){
   console.log('concern');

    $scope.appointmentList = null;

    $(document).off('refresh', '.pull-to-refresh-content');
    $(document).on('refresh', '.pull-to-refresh-content',function(e) {
        zpost('getMyAppointment',{patientid:window.client.id}, function (data) {
            if(data.code == 500){
                zinfo(data.msg);
            } else {
                $scope.appointmentList = data.data;
                $scope.$apply();
            }
            // 加载完毕需要重置
            $.pullToRefreshDone('.pull-to-refresh-content');
        });
    });

    $scope.cancelAppointment = function () {
        var index = this.$index;

        console.log(index);

        zcomfirm('确实取消该预约?',"温馨提示", function () {
            zpost('cancelMyAppointment',{id:this.x.id}, function (data) {
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

//我的病历
app.controller('mycaseController', function ($scope,$location) {
    console.log('mycase');

    $scope.historyAppointment = null;
    $scope.patid = $location.search() && $location.search().id;
    console.log($scope.patid);

    $(document).off('refresh', '.pull-to-refresh-content');
    $(document).on('refresh', '.pull-to-refresh-content',function(e) {
        zpost('getHistroyAppointment',{patientid:$scope.patid || window.client.id}, function (data) {
            if(data.code == 500){
                zinfo(data.msg);
            } else {
                $scope.historyAppointment = data.data;
                $scope.$apply();
            }
            // 加载完毕需要重置
            $.pullToRefreshDone('.pull-to-refresh-content');
        });
    });

    //zpost('getHistroyAppointment',{patientid:window.client.id}, function (data) {
    //    if(data.code == 500){
    //        zinfo(data.msg);
    //    } else {
    //        $scope.historyAppointment = data.data;
    //        $scope.$apply();
    //    }
    //    // 加载完毕需要重置
    //    $.pullToRefreshDone('.pull-to-refresh-content');
    //});

    $.init();

    //初始化触发;
    $('.pull-to-refresh-content').trigger('refresh');
});

//自我诊断
app.controller('examineController', function ($scope) {
    console.log('examine');

    $scope.partlist = null;

    zpost('getExamine',{}, function (data) {
        $scope.partlist = data.data;
        $scope.$apply();
    });

    $.init();
});

app.controller('examinedetailController', function ($scope,$location) {
    console.log('examinedatail');

    var param =  $location.search().id;

    $scope.symptom = null;
    $scope.alldisease = null;

    $scope.getDisease = function () {
        var resultObj = {};
        var arr = Array.from($('[name=symptoms]'));
        var selecteditem = [];
        arr.forEach(function(e){
            if (e.checked == true) {
                selecteditem.push(e.value);
            }
        });

        console.log(selecteditem);


        selecteditem.forEach(function (selectItem) {
            $scope.alldisease.forEach(function (disease) {
                //存在
                if (disease.symptom.indexOf(selectItem) != -1){
                    resultObj[disease.disease] ? (function () {
                        resultObj[disease.disease].count++;
                        resultObj[disease.disease].probability = (resultObj[disease.disease].count / disease.symptom.length).toFixed(2);
                    })(): (function () {
                        resultObj[disease.disease] = {};
                        resultObj[disease.disease].count = 1;
                        resultObj[disease.disease].name = disease.disease;
                        resultObj[disease.disease].id = disease.id;
                        resultObj[disease.disease].probability = (resultObj[disease.disease].count / disease.symptom.length).toFixed(2);
                    })();
                }
            })
        });

        console.log(selecteditem);

        selecteditem.length != 0 ? (function (obj){
            var myChart = echarts.init(document.getElementById('examineresult'));
            var option = {
                baseOption: {
                    tooltip: {},
                    title: [{
                        text: '自我诊断结果',
                        x: '50%',
                        textAlign: 'center'
                    }],
                    grid: [{
                        top: 50,
                        width: '90%',
                        bottom: '45%',
                        left: 10,
                        containLabel: true
                    }, {
                        top: '55%',
                        width: '50%',
                        bottom: 0,
                        left: 10,
                        containLabel: true
                    }],
                    xAxis: [{
                        type: 'value',
                        max: 100,
                        splitLine: {
                            show: false
                        }
                    }],
                    yAxis: [{
                        type: 'category',
                        data: Object.keys(obj),
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    series: [{
                        type: 'bar',
                        stack: 'chart',
                        z: 3,
                        label: {
                            normal: {
                                position: 'right',
                                show: true
                            }
                        },
                        data: Object.keys(obj).map(function (key) {
                            return Math.floor(obj[key].probability * 100);
                        })
                    }, {
                        type: 'pie',
                        radius: [0, '30%'],
                        center: ['75%', '35%'],
                        data: Object.keys(obj).map(function (key) {
                            return {
                                name: key,
                                value: Math.floor(obj[key].probability * 100)
                            }
                        })
                    }]
                },
                media: [
                    {
                        option: {
                            legend: {
                                right: 'center',
                                bottom: 0,
                                orient: 'horizontal'
                            },
                            series: [
                                {
                                    radius: [20, '50%'],
                                    center: ['25%', '50%']
                                },
                                {
                                    radius: [30, '50%'],
                                    center: ['75%', '50%']
                                }
                            ]
                        }
                    },
                    {
                        query: {
                            minAspectRatio: 1
                        },
                        option: {
                            legend: {
                                right: 'center',
                                bottom: 0,
                                orient: 'horizontal'
                            },
                            series: [
                                {
                                    radius: [20, '50%'],
                                    center: ['25%', '50%']
                                },
                                {
                                    radius: [30, '50%'],
                                    center: ['75%', '50%']
                                }
                            ]
                        }
                    },
                    {
                        query: {
                            maxAspectRatio: 1
                        },
                        option: {
                            legend: {
                                right: 'center',
                                bottom: 0,
                                orient: 'horizontal'
                            },
                            series: [
                                {
                                    radius: [20, '50%'],
                                    center: ['50%', '30%']
                                },
                                {
                                    radius: [30, '50%'],
                                    center: ['50%', '70%']
                                }
                            ]
                        }
                    },
                    {
                        query: {
                            maxWidth: 500
                        },
                        option: {
                            legend: {
                                right: 10,
                                top: '15%',
                                orient: 'vertical'
                            },
                            series: [
                                {
                                    radius: [20, '50%'],
                                    center: ['50%', '30%']
                                },
                                {
                                    radius: [30, '50%'],
                                    center: ['50%', '75%']
                                }
                            ]
                        }
                    }
                ]
            };
            $.popup('.popup-result');
            myChart.setOption(option);
        })(resultObj) : zalert('请选择症状!');

    };

    $scope.closeExamine = function (){
        $.closeModal('.popup-result');
    };

    zpost('getSymptom',{id:param}, function (data) {
        $scope.symptom = data.data.symptom;
        $scope.alldisease = data.data.disease;
        $scope.alldisease.forEach(function (disease) {
            disease.symptom = disease.symptom.split(',');
        });
        $scope.$apply();
    });

    $.init();
});