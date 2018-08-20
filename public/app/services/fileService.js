angular
    .module('userApp')
    .factory('FileService', function($q, $http) {
        var task = this;

        this.getAllDocuments = function() {
            var defer = $q.defer();
            $http({
                url: '/file',
            }).then(function(response) {
                defer.resolve(response);
            }, function(err) {
                defer.reject(err);
            });

            return defer.promise;
        };
        this.getDocumentById = function(fileName) {
            var defer = $q.defer();
            $http({
                url: '/file/' + fileName,
            }).then(function(response) {
                defer.resolve(response);
            }, function(err) {
                defer.reject(err);
            });

            return defer.promise;
        };

        return task;
    });
