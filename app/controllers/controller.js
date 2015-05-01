    var windowHeight;
    var windowWidth;
    var contentHeight;
    var contentWidth;   
    function windowResizeHandler() {
        windowHeight = window.innerHeight;
        contentHeight = windowHeight;
        $('#wrapper').height(contentHeight-70);
        $('#mapView').height(contentHeight-70);
        $('map').height(contentHeight-70);
        $('#content').height(contentHeight-70);

    }




    carApp.controller('loginController',function($scope,$facebook,$modal,$location,getRidesService){
    $scope.loader=true;

    $scope.isLoggedIn = true;
    $scope.isLoggedOut = false;
        var userId=sessionStorage.uid;
     if(sessionStorage.logType=="native") {
         getRidesService.getUserDetails(userId).success(function (data) {
             console.log(data);
             $scope.isLoggedIn = false;
             $scope.isLoggedOut = true;
             $scope.profilePic=data[0].profile_picture;
             $scope.welcomeMsg = "Welcome " + data[0].first_name;
             $scope.loginMailId=data[0].email_id;
         });
     }else{
         refresh();
     }

   
    
    $scope.login = function() {

        $facebook.login().then(function() {
            $scope.loader=true;
            refresh();

        });
    }


    $scope.logout=function(){
        $scope.fStatus = $facebook.isConnected();
        if($scope.fStatus) {
            $facebook.logout().then(function () {
                refresh();
                sessionStorage.clear();
                $location.path('/');
            });
        }else{
            sessionStorage.clear();
            $scope.isLoggedIn = true;
            $scope.isLoggedOut = false;
            $location.path('/');
        }
    }

    function refresh() {
        $facebook.api("/me").then(
            function(response) {

                $scope.profilePic="http://graph.facebook.com/"+response.id+"/picture?type=large";
                $scope.welcomeMsg = "Welcome " + response.name;
                $scope.loginMailId=response.email;
                $scope.isLoggedIn = false;
                $scope.isLoggedOut = true;
                sessionStorage.uid=response.id;
                $scope.loader=false;
            },
            function(err) {
                //$scope.welcomeMsg = "Please log in";
                $scope.isLoggedOut = false;
                $scope.isLoggedIn = true;
                $scope.loader=false;

            });
    }

    
    
    
    
    
    $scope.openModel = function (size) {
    if(!sessionStorage.length>0) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function (logArray) {

            if (logArray.logStatus) {
                var loginType = logArray.logType;
                if (loginType == "facebook") {
                    $scope.isLoggedIn = false;
                    $scope.isLoggedOut = true;
                    $scope.profilePic = "http://graph.facebook.com/" + logArray.logResponse.id + "/picture?type=large";
                    $scope.welcomeMsg = "Welcome " + logArray.logResponse.name;
                    $scope.loginMailId = logArray.logResponse.email;

                    sessionStorage.uid = logArray.logResponse.id;
                    sessionStorage.logType = 'facebook';
                } else {
                    $scope.isLoggedIn = false;
                    $scope.isLoggedOut = true;
                    $scope.profilePic = logArray.logResponse.pic;
                    $scope.welcomeMsg = "Welcome " + logArray.logResponse.firstname;
                    $scope.loginMailId = logArray.logResponse.email;

                    sessionStorage.uid = logArray.logResponse.userid;
                    sessionStorage.logType = 'native';

                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    }else{
        $location.path('/offer-rides');
    }
   

  };
    
    
});


carApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance,$facebook, getRidesService) {
    
    $scope.loginNative = function($dataItms) {    
     getRidesService.nativeLogin($dataItms).success(function(data){
           if(data.error){
               $scope.loginErrorMsg=data.error;
           }else{
               console.log(data);
                $scope.logArray={ logStatus:true, logResponse:data ,logType:"native" }
                $modalInstance.close($scope.logArray);
           }
        });
    }               
   
    $scope.signUpNative = function($dataItms) {    
     getRidesService.nativeSignUp($dataItms).success(function(data){
            $scope.logArray={ logStatus:true, logResponse:data }
            $modalInstance.close($scope.logArray);            
        });               
    }
    
 $scope.loginFacebook=function(){
    
      $facebook.login().then(function() {
      $facebook.api("/me").then(
            function(response) {

                $scope.logArray={
                    logStatus:true,
                    logResponse:response,
                    logType:"facebook"
                };
                
                $modalInstance.close($scope.logArray);

               
            },
            function(err) {
               $modalInstance.close($scope.loggedStatus=false);
            });
      });
 }

 
});


/**home page controller
 * search functionality
 */

carApp.controller('homeController', function($scope,$location) {

    $scope.searchRides=function(){
        var origin=$scope.originPlaceField;
        var destination=$scope.destinationPlaceField;

        $location.path('/search-result/'+origin+'to'+destination);
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

});

/** search result controller
 * gmap height adjustment
 * ride available markers in gmap
 * filter functionality
 */
carApp.controller('searchResultController', function($scope,$location,getRidesService,$routeParams) {
   
    
    windowResizeHandler();



    $scope.markers = [
        ['Bondi Beach', 12.9700, 77.7500, 4],
        ['Coogee Beach', 12.9441261, 77.60519840, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    $scope.applyFilter=function(){
        $scope.loader=true;
        getRidesService.getRides($scope.originPlace,$scope.destinationPlace).success(function(data){
            console.log(data);
            $scope.cards=data;
            $scope.loader=false;
        });

    }


    var searchQuery=($routeParams.query).split('to');
    var fromParam=searchQuery[0];
    var toParam=searchQuery[1];
    $scope.originPlace=fromParam;
    $scope.destinationPlace=toParam;
    $scope.loader=true;
    
 



    getRidesService.getRides(fromParam,toParam).success(function(data){
        $scope.cards=data;
        var priceArray=[];
        for(var i=0; i<data.length;i++){
                priceArray.push(data[i].price);
        }
       
         $scope.minPrice=Math.min.apply(null, priceArray);
         $scope.maxPrice=Math.max.apply(null, priceArray);

        $scope.loader=false;
    });



});



/** Ride detail page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('rideDetailController',function($scope,getRidesService,$routeParams,$modal){

    $scope.loader=true;

    $scope.max = 5;
    $scope.isReadonly = true;
    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';



    var rideId=$routeParams.id;
    getRidesService.getRidesDetails(rideId).success(function(data){

        /** get distance and time from google map
         * @type {google.maps.DirectionsService}
         */
        directionsService = new google.maps.DirectionsService()
        var request = {
            origin: data[0].departure,
            destination:data[0].arrival,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status)
        {
            if (status == google.maps.DirectionsStatus.OK)
            {
                console.log(response);
                $scope.distance=response.routes[0].legs[0].distance.text;
                $scope.travelTime=response.routes[0].legs[0].duration.text;
            }
        });



        $scope.origin = data[0].departure;
        $scope.destination =data[0].arrival;
        $scope.originPlace= data[0].departure;
        $scope.destinationPlace =data[0].arrival;
        $scope.dep_date =data[0].departure_date;
        $scope.dep_time =data[0].departure_time;
        $scope.price =data[0].price;
        $scope.seats =data[0].seats;
        $scope.car_model ="Ford endovure";
        $scope.distance ="200";
        $scope.future_detail =data[0].further_details;
        $scope.detour =data[0].detour;
        $scope.leave =data[0].leave;
        $scope.luggage =data[0].luggage_size;
        $scope.user_type=data[0].user_type;
        if($scope.user_type=="facebook"){
            $scope.profilePicture="http://graph.facebook.com/" + data[0].userid + "/picture?type=large";
            $scope.loader=false;
        }else{
            getRidesService.getUserDetails(data[0].userid).success(function (data) {
                $scope.profilePicture=data[0].profile_picture;
                $scope.userName=data[0].first_name;

                var birthYear=data[0].birth_year;
                var d = new Date();
                var n = d.getFullYear();
                $scope.age=n-birthYear;
                $scope.rate = data[0].rating;
                $scope.createdDate=data[0].created_date;
                $scope.mobileNumber=data[0].mobile_number;
                if(data[0].mobile_verified==0){
                    $scope.mobileVerifiedStatus="notVerified";
                    $scope.mobileVerifiedMsg='Phone number not verified';
                }else{
                    $scope.mobileVerifiedStatus="verified";
                    $scope.mobileVerifiedMsg="Phone number verified";
                }
                if(data[0].email_verified==0){
                    $scope.emailVerifiedStatus="notVerified";
                    $scope.emailVerifiedMsg='Email address not verified';
                }else{
                    $scope.emailVerifiedStatus="verified";
                    $scope.emailVerifiedMsg="Email address verified";
                }
                $scope.loader=false;
            });


        }
    });

    //contactDriver controller
    $scope.contactDriver=function(){
        if(!sessionStorage.length>0) {
               $scope.openModel();
        }else{
            $scope.driverDetails = [{'diverName':$scope.userName,'driverNumber':$scope.mobileNumber}];

            var modalInstance  = $modal.open({
                templateUrl: 'contactDriverModal.html',
                controller: 'contactDriverModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.driverDetails;
                    }
                }
            });
        }
    }

});

    /**contact driver modal controller
     */
carApp.controller('contactDriverModalInstanceCtrl', function ($scope, $modalInstance , getRidesService,items) {
    $scope.isCollapsed = true;
    $scope.driverName=items[0].diverName;
    $scope.driverMobileNumber=items[0].driverNumber;
});



/**Offer rides page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('offerRidesController',function($scope,getRidesService){
   
    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';
    $scope.rideChange=function(){
        $scope.origin =  $scope.ride.departureField;
        $scope.destination = $scope.ride.arrivalField;
        $scope.departurePlace=$scope.ride.departureField;
        $scope.arrivalPlace=$scope.ride.arrivalField;
        $scope.displayPath=true;
    }
    
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    
    $scope.mytime = new Date();
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.hstep = 1;
    $scope.mstep = 5;
    $scope.ismeridian = true;


    /*** save offer function ***/
    $scope.publishOffer=function($dataItms){
        var uid=sessionStorage.uid;
        var data=$dataItms;
        data.userid=uid;

            getRidesService.postOffers(data).success(function(data){
                    console.log(data);
            });

    }
});


/**Offer rides page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('myAccountController',function($scope,getRidesService){
    $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];
});
