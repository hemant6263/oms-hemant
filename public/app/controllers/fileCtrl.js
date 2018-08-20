angular
    .module('userApp')

.controller('appUploadController', 
    ['$scope', '$location', 'Upload', 'FileService','SharedScope','$window','$http', 
      function($scope, $location, Upload, FileService, SharedScope,$window,$http) {

    var vm = this;
    vm.showProgressBar = false;
    vm.successMsg = '';
    vm.errorMsg = '';
    vm.documentList = [];

    vm.init = function() {
        vm.getAllDocuments();
    }

    vm.submit = function() {
        if (vm.uploadForm.file.$valid && vm.file) {
            vm.showProgressBar = true;
            vm.uploadFile(vm.file);
        }
    };

    vm.uploadFile = function(file) {
        Upload.upload({
                url: '/upload',
                data: { file: file }
            })
            .then(function(resp) {
                vm.successMsg = 'File successfully uploaded !';
            }, function(resp) {
                vm.errorMsg = 'Error uploading file !';
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                vm.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + vm.progressPercentage + '% ' + evt.config.data.file.name);
            });
            vm.getAllDocuments();
    };

    vm.getAllDocuments = function() {
        FileService.getAllDocuments()
            .then(function(res) {
                vm.documentList = res.data;
                //console.log(res.data);
            }, function(err) {
                console.log("Error : ", err);
            });
    }
    vm.openPdfDocument = function(fileName) {
        // SharedScope.setData(fileName);
        // $location.path('/viewer');
        $http.get("/file/"+fileName)
        .then(function(response) 
    {
       var c = response.data.records;

       var d = JSON.stringify(c);
       
        var host = $window.location.host;
       
        var landingUrl = "http://" + host + "/"+ "app/views/pages/web/viewer.html?file="+d;
        console.log(landingUrl);
        $window.location.href = landingUrl;
       //$location.path("app/views/pages/web/viewer.html");
    
});
    }

    vm.init();
}]);
