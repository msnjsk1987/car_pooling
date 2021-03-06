carApp.factory('getRidesService', function($http) {
    var urlBase = 'http://localhost/car_pooling/api/index.php/services/';
    var dataFactory = {};

    dataFactory.getMessageCount=function(uid,userType){
        return $http({method:'GET', url:urlBase+'getMessageCount', params:{id:uid,userType:userType}});
    }

    dataFactory.getMessageDetail=function(uid,userType){
        return $http({method:'GET', url:urlBase+'getMessageDetail', params:{id:uid,userType:userType}});
    }

    dataFactory.sendMessage=function(uid, driverId, contactDriver){
        var data = {
            sender: uid,
            reciver:driverId,
            message:contactDriver
        };
        return $http.post(urlBase+'sendMessage',data);

    }

    dataFactory.confirmMobileCode=function(userId,userType,mobile,code){
        var data = {
            id: userId,
            userType:userType,
            mobile:mobile,
            code:code
        };

        return $http({method:'GET', url:urlBase+'confirmCode', params:data});
    }

    dataFactory.storeMobileData=function(userId,userType,mobile,randomCode){

        var data = {
            id: userId,
            userType:userType,
            mobile:mobile,
            code:randomCode
        };
        return $http.post(urlBase+'storeMobileData',data);


    }

    dataFactory.deleteRideDb=function(userId,rideId){
        return $http({method:'GET', url:urlBase+'deleteRidesByUser', params:{id:userId,rideId:rideId}});
    }

    dataFactory.getRidesByUser=function(userId){
        return $http({method:'GET', url:urlBase+'getRidesByUser', params:{id:userId}});
    }
    
    dataFactory.getUserCarDetails=function(userId){
          return $http({method:'GET', url:urlBase+'getUserCarDetails', params:{id:userId}});
    }
    
    dataFactory.saveCar=function(data){
       
         return $http.post(urlBase+'saveCar',data);
    }
    
    dataFactory.getCarDetails=function(){
        return $http({method:'GET', url:urlBase+'carAllModels'});
    }

    dataFactory.getUserDetails=function(id,type){
        return $http({method:'GET', url:urlBase+'getUserDetails', params:{id:id,uType:type}});
    }
    dataFactory.storeFacebookUser=function(data){

        var gender="";
        if(data.logResponse.gender=='male'){
            gender=1
        }else{
            gender=2
        }
        var facebookUserData = {
            social_id: data.logResponse.id,
            first_name:data.logResponse.first_name,
            last_name:data.logResponse.last_name,
            gender:gender,
            email_id:data.logResponse.email
        };

        return $http.post(urlBase+'facebookUserSignUp',facebookUserData);

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