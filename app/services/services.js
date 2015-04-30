carApp.factory('getRidesService', function($http) {
    var urlBase = 'http://localhost/car_pooling/api/index.php/services/';
    var dataFactory = {};

    dataFactory.getUserDetails=function(id){
        return $http({method:'GET', url:urlBase+'getUserDetails', params:{id:id}});
    }
    
    dataFactory.nativeLogin = function(data) {
        return $http({method:'GET', url:urlBase+'user', params:{username:data.username,password:data.password}});
    }
    
    dataFactory.nativeSignUp = function(data) {
        return $http.post(urlBase+'userSignUp',data);
    }

    dataFactory.getRides = function (origin,destination) {
        return $http({method:'GET', url:urlBase+'getRides', params:{origin:origin,destination:destination}});
    };

    dataFactory.getRidesDetails=function(id){
        return $http({method:'GET', url:urlBase+'getRideDetails', params:{id:id}});

    }
    dataFactory.postOffers=function(data){

        return $http.post(urlBase+'offerRides',data);
    };
    dataFactory.storeUidSession=function(id){
        var cust = {
            ID: id
        };
        return $http.post(urlBase+'storeUsersIdSession',cust);
    }
    dataFactory.destorySession=function(){
        return $http.get(urlBase+'destorySession');
    }

    return dataFactory;

});