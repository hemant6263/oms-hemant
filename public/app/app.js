angular
.module('userApp',['appRoutes','userServices', 'authServices','ngFileUpload'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});