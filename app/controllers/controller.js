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

            },
            function(err) {
                //$scope.welcomeMsg = "Please log in";
                $scope.isLoggedOut = false;
                $scope.isLoggedIn = true;

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
        getRidesService.getRides($scope.originPlace,$scope.destinationPlace).success(function(data){
            console.log(data);
            $scope.cards=data;
        });

    }


    var searchQuery=($routeParams.query).split('to');
    var fromParam=searchQuery[0];
    var toParam=searchQuery[1];
    $scope.originPlace=fromParam;
    $scope.destinationPlace=toParam;
    
 



    getRidesService.getRides(fromParam,toParam).success(function(data){
        $scope.cards=data;
        var priceArray=[];
        for(var i=0; i<data.length;i++){
                priceArray.push(data[i].price);
        }
       
         $scope.minPrice=Math.min.apply(null, priceArray);
         $scope.maxPrice=Math.max.apply(null, priceArray);
       

       
      

    });



});



/** Ride detail page controller
 * gmap height adjustment
 * gmap direction service
 */
carApp.controller('rideDetailController',function($scope,getRidesService,$routeParams){
   
    
    windowResizeHandler();
    var directionsService = new google.maps.DirectionsService();
    $scope.meter = 7;
    $scope.travelMode='DRIVING';

    var rideId=$routeParams.id;

    getRidesService.getRidesDetails(rideId).success(function(data){
        console.log(data);
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
    });





    
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
