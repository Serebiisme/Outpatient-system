/**
 * Created by apple on 2018/5/14.
 */
app.controller('managerController', function ($scope) {
    console.log('manager');

    $.init();
});

app.controller('docmanagerController', function ($scope,$timeout) {
    console.log('doctor manage');

    $scope.alldoctor = null; //医生列表
    $scope.searchdoctor = []; //搜索结果列表
    var department = ['内科','外科','儿科','妇科','眼科','耳鼻喉科','口腔科','皮肤科','中医科','针灸推拿科','心理咨询室'];

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
                            data.code == '200' && zpost('getAllDoctor',{}, function (data) {
                                $scope.alldoctor = data.result;
                                $scope.$apply();
                            });

                        });
                    }
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

    //添加医生
    department.forEach(function(item){
        $("[name=d_department]").append('<option value="' + item + '">' + item + '</option>') ;
    });

    $.init();
});

app.controller('patmanagerController', function ($scope) {
    console.log('patient manage');

    $.init();
});

app.controller('appointController', function ($scope) {
    console.log('appointment manage');

    $.init();
});

app.controller('officeController', function ($scope) {
    console.log('office manage');

    $.init();
});

app.controller('infoController', function ($scope) {
    console.log('hospital info manage');

    $.init();
});

app.controller('bannerController', function ($scope) {
    console.log('banner manage');

    $.init();
});