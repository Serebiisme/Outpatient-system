/**
 * Created by apple on 2018/4/21.
 */
/**
 * 路由配置
 */
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login',{
            templateUrl:'login.html',
            controller:'loginController'
        })
        .when('/help',{
            templateUrl:'help.html',
            controller:'helpAndVersionController'
        })
        .when('/version',{
            templateUrl:'version.html',
            controller:'helpAndVersionController'
        })
        .when('/modifypsd',{
            templateUrl:'modifypsd.html',
            controller:'modifypsdController'
        })

        //居民端路由
        .when('/index',{
            templateUrl:'html/index.html',
            controller:'indexController'
        })
        .when('/hospital',{
            templateUrl: 'html/hospital.html',
            controller: 'hospitalController'
        })
        .when('/appointment',{
            templateUrl: 'html/appointment.html',
            controller:'appointmentController'
        })
        .when('/search',{
            templateUrl:'html/search.html',
            controller:'searchController'
        })
        .when('/myintro',{
            templateUrl:'html/myintro.html',
            controller:'myintroController'
        })
        .when('/information',{
            templateUrl:'html/information.html',
            controller:'informationController'
        })
        .when('/concern',{
            templateUrl:'html/concern.html',
            controller:'concernController'
        })
        .when('/informationDetail',{
            templateUrl:'html/informationDetail.html',
            controller:'informationDetailController'
        })
        .when('/myintrodetail',{
            templateUrl:'html/myintrodetail.html',
            controller:'myintrodetailController'
        })
        .when('/doctorlist',{
            templateUrl:'html/doctorList.html',
            controller:'doctorlistController'
        })
        .when('/doctordetail',{
            templateUrl:'html/doctorDetail.html',
            controller:'doctordetailController'
        })
        .when('/searchresult',{
            templateUrl:'html/searchResult.html',
            controller:'searchresultController'
        })
        .when('/mycase',{
            templateUrl:'html/myCase.html',
            controller:'mycaseController'
        })

        //医生端路由
        .when('/doctor',{
            templateUrl:'doctor/doctor.html',
            controller:'doctorController'
        })
        .when('/manage',{
            templateUrl:'doctor/manager.html',
            controller:'manageController'
        })
        .when('/setting',{
            templateUrl:'doctor/setting.html',
            controller:'settingController'
        })
        .when('/addappointment',{
            templateUrl:'doctor/addappointment.html',
            controller:'addappointmentController'
        })
        .when('/calendar',{
            templateUrl:'doctor/calendar.html',
            controller:'calendarController'
        })
        .when('/healtheducation',{
            templateUrl:'doctor/healtheducation.html',
            controller:'healtheducationController'
        })
        .when('/doctorintrodetail',{
            templateUrl:'doctor/doctorintrodetail.html',
            controller:'doctorintroController'
        })
        .when('/editintro',{
            templateUrl:'doctor/editintro.html',
            controller:'editintroController'
        })

        //管理端路由
        .when('/manager',{
            templateUrl:'manager/manager.html',
            controller:'managerController'
        })
        .when('/docmanage',{
            templateUrl:'manager/doctorManage.html',
            controller:'docmanagerController'
        })
        .when('/patmanage',{
            templateUrl:'manager/patientManage.html',
            controller:'patmanagerController'
        })
        .when('/appointmanage',{
            templateUrl:'manager/appointmentManage.html',
            controller:'appointController'
        })
        .when('/officemanage',{
            templateUrl:'manager/officeManage.html',
            controller:'officeController'
        })
        .when('/infomanage',{
            templateUrl:'manager/infoManage.html',
            controller:'infoController'
        })
        .when('/bannermanage',{
            templateUrl:'manager/bannerManage.html',
            controller:'bannerController'
        })

        .otherwise({redirectTo:'/login'});
}]);