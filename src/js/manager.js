/**
 * Created by apple on 2018/5/14.
 */
app.controller('managerController', function ($scope) {
    console.log('manager');

    //$scope.departmentArr = null;

    $scope.initCountDepart = function () {
      zpost('countDepartment',{}, function (data) {
          //$scope.departmentArr = data.data;
          //$scope.$apply();

          var result = data.data,
              obj = {};
          result.forEach(function (e) {
              obj[e.department] = e.num;
          });

          initDepartCount(obj);
      });
    };

    $scope.initCountAppoint = function () {
        zpost('countAppointment',{}, function (data) {
            console.log(data);
            var result = data.data;
            initAppointmentCount(result.todayAppoint.length,result.weekAppoint.length,result.monthAppoint.length);
            var monthCount = {};
            result.monthCount.forEach(function (e) {
               monthCount[e.time] = e.num;
            });
            var todayCount = {};
            result.todayCount.forEach(function (e) {
                todayCount[e.time] = e.num;
            });

            var times = ["8:00 ~ 9:00","9:00 ~ 10:00","10:00 ~ 11:00","14:00 ~ 15:00","15:00 ~ 16:00","16:00 ~ 17:00"];
            times.forEach(function (time) {
                todayCount[time] || (todayCount[time] =  0);
                monthCount[time] || (monthCount[time] =  0);
            });


            initMonthTimeCount(monthCount);

            initTodayTimeCount(todayCount);

        })
    };

    $.init();
    $scope.initCountAppoint();

    function initAppointmentCount(day,week,month){
        var myChart = echarts.init(document.getElementById('countAppoint'));
        var option = {
            title: {
                text: '医院预约统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0,0.01]
            },
            yAxis: {
                type: 'category',
                data: ['日预约量','周预约量','月预约量']
            },
            series: [
                {
                    name: '预约量',
                    type: 'bar',
                    data: [day, week, month]
                }
            ]
        };
        myChart.setOption(option);
    }

    function initMonthTimeCount(obj) {
        var myChart = echarts.init(document.getElementById('weekTime'));
        var option = {
            tooltip: {},
            title: [{
                text: '周预约时段统计',
                x: '25%',
                textAlign: 'center'
            }],
            grid: [{
                top: 50,
                width: '50%',
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
                //max: 10,
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
                    return obj[key];
                })
            }, {
                type: 'pie',
                radius: [0, '30%'],
                center: ['75%', '25%'],
                data: Object.keys(obj).map(function (key) {
                    return {
                        name: key,
                        value: obj[key]
                    }
                })
            }]
        };

        myChart.setOption(option);
    }

    function initTodayTimeCount(obj) {
        var myChart = echarts.init(document.getElementById('todayTime'));
        var option = {
            tooltip: {},
            title: [{
                text: '日预约时段统计',
                x: '25%',
                textAlign: 'center'
            }],
            grid: [{
                top: 50,
                width: '50%',
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
                //max: 10,
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
                    return obj[key];
                })
            }, {
                type: 'pie',
                radius: [0, '30%'],
                center: ['75%', '25%'],
                data: Object.keys(obj).map(function (key) {
                    return {
                        name: key,
                        value: obj[key]
                    }
                })
            }]
        };
        myChart.setOption(option);
    }

    function initDepartCount(obj){
        var myChart = echarts.init(document.getElementById('countDepart'));
        var option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : Object.keys(obj),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:Object.keys(obj).map(function (key) {
                        return obj[key]
                    })
                }
            ]
        };
        myChart.setOption(option);
    }

    //登录绑定退出事件
    $(document).on('click','.exit', function () {
        location.hash = '#/login';
        $(document).off('click','.exit');
    });
});

app.controller('docmanagerController', function ($scope,$timeout) {
    console.log('doctor manage');

    $scope.alldoctor = null; //医生列表
    $scope.searchdoctor = []; //搜索结果列表
    var department = [];

    //初始化科室
    zpost('getAllDepartment',{}, function (data) {
        department = data.result.map(function (item) {
            return item.department;
        });
        //添加医生
        department.forEach(function(item){
            $("[name=d_department]").append('<option value="' + item + '">' + item + '</option>') ;
        });

    });

    //获取搜索结果
    $scope.getSearchResult = function () {
      var keyword = $('#search').val();
        $scope.searchdoctor = [];

        if (keyword == ''){
            return false
        }

        $scope.alldoctor.forEach(function (doctor) {
            if (doctor.id == keyword) {
                $scope.searchdoctor.push(doctor);
            } else if (doctor.department == keyword) {
                $scope.searchdoctor.push(doctor);
            } else if (doctor.name.indexOf(keyword) != -1) {
                $scope.searchdoctor.push(doctor);
            }
        });

        console.log($scope.searchdoctor);

        $('#search').val("");
    };

    //编辑弹窗
    $scope.editDoctorInfo = function () {
        $.modal({
            title:'编辑信息',
            text:$('#editModel').html(),
            buttons:[
                {
                    text:'<span style="color: #e43e56">取消</span>',
                    close:true
                },
                {
                    text:'保存',
                    bold:true,
                    onClick: function () {
                        var u_info = getFormToJson('#u_info');

                        if (u_info.u_name == "") {
                            zalert("名字不能为空!");
                            return false;
                        }

                        if(!isCorrectName(u_info.u_name)){
                            zalert("请输入10或10个以内汉字.");
                            return false;
                        }

                        if (u_info.u_password == "") {
                            zalert("密码不能为空!");
                            return false;
                        }

                        if (u_info.u_telephone == "") {
                            zalert("手机号不能为空!");
                            return false;
                        }

                        if (!isMobile(u_info.u_telephone)) {
                            zalert("请填写正确的手机号！");
                            return false;
                        }

                        if (u_info.u_id == "") {
                            zalert("编号号不能为空!");
                            return false;
                        }

                        console.log(u_info);

                        zpost('updateDoctor',u_info,function(data){
                            zinfo(data.msg);
                            //data.code == '200' && zpost('getAllDoctor',{}, function (data) {
                            //    $scope.alldoctor = data.result;
                            //    $scope.$apply();
                            //});

                            if (data.code == '200') {
                                $scope.alldoctor[this.$index].id = u_info.u_id;
                                $scope.alldoctor[this.$index].name = u_info.u_name;
                                $scope.alldoctor[this.$index].password = u_info.u_password;
                                $scope.alldoctor[this.$index].gender = u_info.u_gender;
                                $scope.alldoctor[this.$index].telephone = u_info.u_telephone;
                                $scope.alldoctor[this.$index].department = u_info.u_department;
                            }

                            $scope.$apply();
                        }.bind(this));
                    }.bind(this)
                }
            ],
            extraClass:'editdoctor'
        });

        //渲染弹窗
        department.forEach(function(item){
            $("[name=u_department]").append('<option value="' + item + '">' + item + '</option>') ;
        });
        $('[name=u_name]').val(this.doctor.name);
        $('[name=u_password]').val(this.doctor.password);
        $('[name=u_telephone]').val(this.doctor.telephone);
        $('[name=u_id]').val(this.doctor.id);
        $('[name=u_gender]').find('[value=' + this.doctor.gender + ']').attr('selected','true');
        $('[name=u_department]').find('[value=' + this.doctor.department + ']').attr('selected','true');
    };

    //删除医生
    $scope.deleteDoctorInfo = function () {
        zcomfirm('确定要删除该医生吗?','温馨提示', function () {
            zpost('deleteDoctor',{id:this.doctor.id}, function (data) {
                zinfo(data.msg);
                zpost('getAllDoctor',{}, function (data) {
                    $scope.alldoctor = data.result;
                    $scope.$apply();
                });
            })
        }.bind(this))
    };

    //注册医生
    $scope.registerDoctor = function(){

        var d_info = getFormToJson('#d_info');

        if (d_info.d_name == "") {
            zalert("名字不能为空!");
            return false;
        }

        if(!isCorrectName(d_info.d_name)){
            zalert("请输入10或10个以内汉字.");
            return false;
        }

        if (d_info.d_password == "") {
            zalert("密码不能为空!");
            return false;
        }

        if (d_info.d_telephone == "") {
            zalert("手机号不能为空!");
            return false;
        }

        if (!isMobile(d_info.d_telephone)) {
            zalert("请填写正确的手机号！");
            return false;
        }

        if (d_info.d_id == "") {
            zalert("编号号不能为空!");
            return false;
        }

        zpost('registerDoctor',d_info,function(data){
            zinfo(data.msg);
            data.code == '200' && $timeout(function(){
                $.closeModal();
            },2100);

            zpost('getAllDoctor',{}, function (data) {
                $scope.alldoctor = data.result;
                $scope.$apply();
            });

        });

        $('#d_info')[0].reset();
    };

    //获取医生列表
    zpost('getAllDoctor',{}, function (data) {
        $scope.alldoctor = data.result;
        $scope.$apply();
    });

    $.init();
});

app.controller('patmanagerController', function ($scope,$timeout) {
    console.log('patient manage');

    $scope.allpatient = null;
    $scope.searchpatient = [];

    //编辑患者信息
    $scope.editPatientInfo = function () {
        $.modal({
            title:'编辑信息',
            text:$('#editModel').html(),
            buttons:[
                {
                    text:'<span style="color: #e43e56">取消</span>',
                    close:true
                },
                {
                    text:'保存',
                    bold:true,
                    onClick: function () {
                        var p_info = getFormToJson('#p_info');

                        if (p_info.p_name == "") {
                            zalert("名字不能为空!");
                            return false;
                        }

                        if(!isCorrectName(p_info.p_name)){
                            zalert("请输入10或10个以内汉字.");
                            return false;
                        }

                        if (p_info.p_password == "") {
                            zalert("密码不能为空!");
                            return false;
                        }

                        if (p_info.p_birthday == "") {
                            zalert("请填写生日!");
                            return false;
                        }

                        if (p_info.p_telephone == "") {
                            zalert("手机号不能为空!");
                            return false;
                        }

                        if (!isMobile(p_info.p_telephone)) {
                            zalert("请填写正确的手机号！");
                            return false;
                        }

                        if (p_info.p_id == "") {
                            zalert("编号不能为空!");
                            return false;
                        }

                        zpost('updatePatient',p_info,function(data){
                            zinfo(data.msg);
                            //data.code == '200' && $timeout(function(){
                            //    $.closeModal();
                            //    $scope.searchpatient = [];
                            //},2100);
                            //
                            ////获取患者列表
                            //zpost('getAllPatient',{}, function (data) {
                            //    $scope.allpatient = data.result;
                            //    $scope.$apply();
                            //});

                            if (data.code == '200') {
                                $scope.allpatient[this.$index].id = p_info.p_id;
                                $scope.allpatient[this.$index].name = p_info.p_name;
                                $scope.allpatient[this.$index].password = p_info.p_password;
                                $scope.allpatient[this.$index].gender = p_info.p_gender;
                                $scope.allpatient[this.$index].telephone = p_info.p_telephone;
                                //$scope.allpatient[this.$index].department = u_info.u_department;
                            }

                            $scope.$apply();
                        }.bind(this));
                    }.bind(this)
                }
            ],
            extraClass:'editdoctor'
        });

        $('[name=p_name]').val(this.patient.name);
        $('[name=p_password]').val(this.patient.password);
        $('[name=p_telephone]').val(this.patient.telephone);
        $('[name=p_id]').val(this.patient.id);
        $('[name=p_gender]').find('[value=' + this.patient.gender + ']').attr('selected','true');
        //$('[name=u_department]').find('[value=' + this.doctor.department + ']').attr('selected','true');
    };

    //获取搜索结果
    $scope.getSearchResult = function () {
        var keyword = $('#search').val();
        $scope.searchpatient = [];

        if (keyword == ''){
            return false
        }

        $scope.allpatient.forEach(function (patient) {
            if (patient.id == keyword) {
                $scope.searchpatient.push(patient);
            } else if (patient.name.indexOf(keyword) != -1) {
                $scope.searchpatient.push(patient);
            }
        });

        $('#search').val("");
    };

    //获取患者列表
    zpost('getAllPatient',{}, function (data) {
        $scope.allpatient = data.result;
        $scope.$apply();
    });

    $.init();
});

app.controller('appointController', function ($scope) {
    console.log('appointment manage');

    $.init();
});

app.controller('officeController', function ($scope) {
    console.log('office manage');

    $scope.departments = [];
    $scope.showadd = false;
    $scope.showedit = false;
    $scope.selectDepartment = '';

    var ifexist = false;

    $scope.showAdd = function () {
        $scope.showadd = true;
        $scope.showedit = false;
    };

    $scope.cancelAddDepartment = function () {
        $scope.showadd = false;
    };

    $scope.addDepartment = function () {
        var depName = $('[name=a_department]').val();
        var d = new RegExp ('[\u4e00-\u9fa5]');


        if (depName == "" || !d.test(depName)){
            zalert('请输入正确的科室名');
            return false;
        }

        $scope.departments.forEach(function (item) {
            item.department == depName && (ifexist = true);
        });

        if  (ifexist){
            zalert('该科室已经存在!');
            ifexist = false;
            return false;
        }

        zpost('addDepartment',{department:depName}, function (data) {
            zinfo(data.msg);
            zpost('getAllDepartment',{type:1}, function (data) {
                $scope.departments = data.result;
                $scope.showedit = false;
                $scope.$apply();
            });
        });

        $scope.showadd = false;
    };

    $scope.showEdit = function () {
        $scope.showedit = true;
        $scope.showadd = false;
        $scope.selectDepartment = this.department.department;
        $scope.initEdit();
    };

    $scope.initEdit = function () {
        $('[name=e_department]').val($scope.selectDepartment);
    };

    $scope.cancelEditDepartment = function () {
        $scope.showedit = false;
    };

    $scope.saveDepartment = function () {
        var oldName = $scope.selectDepartment,
            newName = $('[name=e_department]').val();

        zpost('editDepartment',{oldName:oldName,newName:newName}, function (data) {
            if (data.code == 500) {
                zinfo(data.msg);
            } else {
                zinfo(data.msg);
                //初始化科室
                zpost('getAllDepartment',{type:1}, function (data) {
                    $scope.departments = data.result;
                    $scope.showedit = false;
                    $scope.$apply();
                });
            }
        });
    };

    $scope.toggleShow = function () {
        zpost('ifDepartmentShow',{ifshow:!this.department.ifshow,department:this.department.department}, function (data) {
           if (data.code == 500) {
               zinfo(data.msg);
           } else {
               $scope.departments[this.$index].ifshow = !this.department.ifshow;
               $scope.$apply();
           }
        }.bind(this));
    };

    //初始化科室
    zpost('getAllDepartment',{type:1}, function (data) {
        $scope.departments = data.result;
        $scope.$apply();
    });


    $.init();
});

app.controller('infoController', function ($scope) {
    console.log('hospital info manage');

    $scope.hospital = null;

    $scope.saveHospitalInfo = function () {
        var s_hospital = getFormToJson("#s_hospital");

        zpost('saveHospitalInfo',s_hospital, function (data) {
            zinfo(data.msg);
            zpost('getHospitalInfo',{}, function (data) {
                $scope.hospital = data.data[0];
                $scope.$apply();
            });
        });
    };

    zpost('getHospitalInfo',{}, function (data) {
        $scope.hospital = data.data[0];
        $scope.$apply();
    });


    $.init();
});

app.controller('bannerController', function ($scope) {
    console.log('banner manage');

    $.init();
});