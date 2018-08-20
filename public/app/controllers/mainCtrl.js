angular
.module('userApp')
.controller('mainCtrl', function(Auth, $location, $timeout, $http, $rootScope) {
    var app = this;

    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {

            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {

                app.username = data.data.username;
                app.email = data.data.email;
                //app.loadme = true;
            });
        } else {

            app.isLoggedIn = false;
            app.username = '';
            //app.loadme = true;

        }
    });

    this.doLogin = function(loginData) {
        app.errorMsg = false;
        Auth.login(app.loginData).then(function(data) {
            if (data.data.success) {
                app.successMsg = data.data.message;
                $location.path('/about')
                app.loginData = '';
                app.successMsg = false;
            } else {
                app.errorMsg = data.data.message;

            }
        });
    };

    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(function() {
            $location.path('/');
        }, 2000);
    };
})
