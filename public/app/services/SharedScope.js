angular
    .module('userApp')
    .factory('SharedScope', function() {
        this.documentData;

        this.setData = function(data) {
            this.documentData = data;
        };
        this.getData = function() {
            return this.documentData;
        };
        return {
            getData: this.getData,
            setData: this.setData
        };

    });
