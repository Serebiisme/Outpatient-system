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

        //医生端路由
        .when('/doctor',{
            templateUrl:'doctor/doctor.html',
            controller:'doctorController'
        })
        .when('/manager',{
            templateUrl:'doctor/manager.html',
            controller:'managerController'
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
        .otherwise({redirectTo:'/login'});
}]);