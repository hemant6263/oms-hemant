angular.module('appRoutes', [ 'ngRoute' ])
.config(function($routeProvider, $locationProvider) 
 {
            $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/users/login.html',
                controller: 'mainCtrl'
            })
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })
            .when('/register',{
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register'
            })
            .when('/viewer',{
                templateUrl: 'app/views/pages/viewer.html',
                controller: 'pdfViewCtrl',
                controllerAs: 'pvc'
            })
            .when('/blah', {
                templateUrl: 'app/views/pages/blah.html'
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html'
            })
            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html'
            })


        .otherwise({redirectTo : '/'});
        $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     });
 });
 
      
    




      


