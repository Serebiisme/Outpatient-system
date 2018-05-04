/**
 * 首页
 */
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log('index');
    $scope.arr = null;


    //初始化banner
    $(".swiper-container").swiper({
        autoplay : 3000,
        pagination : '.swiper-pagination',
        loop: true
    });

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

    $.init();//放最后
});
/**
 * 医院页
 */
app.controller('hospitalController',function($scope,$compile){
    console.log('hospital');

    $scope.hospital = {
        '医院简介':{
            stretchFlag:false,
            content:'某某市妇幼保健院是一所政府公立医院，同时也是某某市妇女儿童医院、某某市各县市区新农合定点医院、医保定点医院、某某医学院教学医院。医院拥有职工280余人（其中专业技术人员179人）、床位155张、各种大型医疗设备40余台件，是集医疗、保健、科研、教学为一体的现代化的三级乙等妇幼保健院。医院设临床部和保健部。临床部设有妇科、产科、儿科、新生儿科、无痛人流科、乳腺科、优生优育科、生殖保健科、内科、外科等10余个临床科室及B超室、放射科、输血科、药械科、检验科、心电图室等10余个医技科室，保健部设基层保健科、妇女保健科、儿童保健科等。 某某市妇幼保健院将始终坚持“患者至上，质量第一”的服务理念，秉承“低廉收费，优质服务”的办院宗旨，为广大市民朋友提供优质高效的医疗保健服务，为某某市妇幼保健事业做出更大的贡献。'
        },
        '医院荣誉':{
            stretchFlag:false,
            content:'1988年某某市政府命名为“某某市妇产医院”； 1995年获卫生部“二级甲等医院”和“爱婴医院”； 1999年医院荣获“省级文明单位”； 2000年荣获“某某省卫生行业文明示范”单位； 2002年获某某省首批“百姓放心医院”； 2005年获“某某省消费者放心医院”、“公安法医创伤医院”； 2006年获“某某省护理工作先进集体”； 2007年获“某某省先进集体”； 2007年获全省卫生系统“创佳评差”竞赛活动最佳单位 2009年荣获某某省诚信单位。 2010年被某某省中医管理局授予“三级甲等中西医结合医院” 2011年荣获“最受市民信赖的医疗机构”； 2011年荣获某某高校巾帼建功标兵岗。 2011年荣获某某市卫生工作先进单位。 2012年被国家中医药管理局授予“三级甲等中西医结合医院” 2014年～2015年被市卫生局评为“行风建设先进集体” 获全市卫生系统“创佳选优评差”竞赛活动先进单位 2016年被省教育工委评为“先进基层党组织”'
        },
        '医院特色':{
            stretchFlag:false,
            content:'医院现有国家级、省级重点建设专学科17个，省级二级实验室1个，国医堂、名老中医工作室5个，国家级师承导师、省级名老中医殷克敬教授工作室1个。重点专科和学科分布在心血管病、脑病、糖尿病、血液病、肿瘤、脾胃病、肺病、妇产科、重症医学、治未病、中医康复学、介入治疗、新生儿科、儿科、儿保科、乳腺科、骨伤骨病、心脏外科和泌尿外科等重大疑难疾病和社会急需的专业，并开设国医堂和名老中医工作室5个，名老中医传承工作室1个，包括国医大师张学文教授和郭诚杰教授等一批全国著名中医药专家长期座诊和查房。妇产学科在某某省医疗卫生系统中居于前列，是卫计委指定的全省危重孕产妇救治与转诊中心定点医院，被誉为本地区的“母婴健康的保护神”。'
        }
    };

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

    $scope.department = ['内科','外科','儿科','妇科','眼科','耳鼻喉科','口腔科','皮肤科','中医科','针灸推拿科','心理咨询室'];

    $scope.showdoctorlist = function () {
        //console.log(this);
        $location.url('/doctorlist?department=' + this.x);
    };

    $.init();//放最后
});

/**
 * 预约医生列表页
 */
app.controller('doctorlistController', function ($scope,$location) {
    console.log('doctorlist');
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

    $scope.historyArr = $locals.getObject('historySearch').history && $locals.getObject('historySearch').history.reverse().slice(0,5);
    //console.log($scope.historyArr);

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
 * 关注医生页
 */
app.controller('concernController',function($scope){
   console.log('concern');

    $.init();
});