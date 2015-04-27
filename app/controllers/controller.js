    var windowHeight;
    var windowWidth;
    var contentHeight;
    var contentWidth;   
    function windowResizeHandler() {
        windowHeight = window.innerHeight;
        contentHeight = windowHeight;
        $('#wrapper').height(contentHeight);
        $('#mapView').height(contentHeight);
        $('map').height(contentHeight);
        $('#content').height(contentHeight-70);

    }








    carApp.controller('loginController',function($scope,$facebook,$modal,$location,getRidesService){
    console.log($facebook);
    $scope.isLoggedIn = true;
    $scope.isLoggedOut = false;
    $scope.login = function() {
        $facebook.login().then(function() {
            refresh();
        });
    }


    $scope.logout=function(){
        $facebook.logout().then(function(){
            refresh();
        })
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
                getRidesService.storeUidSession(response.id).success(function(data){
                    console.log(data);

                });
            },
            function(err) {
                //$scope.welcomeMsg = "Please log in";
                $scope.isLoggedOut = false;
                $scope.isLoggedIn = true;
                getRidesService.destorySession().success(function(data){
                    console.log(data);

                });
            });
    }
    refresh();
    
    
    
    
    
    $scope.openModel = function (size) {
    $scope.status = $facebook.isConnected()
       
    if( $scope.status){
         $location.path('/offer-rides');
    }else{
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl'
        });
         modalInstance.result.then(function (logArray) {

             if(logArray.logStatus){

                       $scope.isLoggedIn = false;
                       $scope.isLoggedOut = true;
                         $scope.profilePic="http://graph.facebook.com/"+logArray.logResponse.id+"/picture?type=large";
                         $scope.welcomeMsg = "Welcome " + logArray.logResponse.name;
                         $scope.loginMailId=logArray.logResponse.email;
                       $location.path('/offer-rides');
             }
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
    }
        
   

  };
    
    
});


carApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance ,$facebook) {
    
 $scope.loginFacebook=function(){
    
      $facebook.login().then(function() {
      $facebook.api("/me").then(
            function(response) {

                $scope.logArray={
                    logStatus:true,
                    logResponse:response
                }
                $modalInstance.close($scope.logArray);

               
            },
            function(err) {
               $modalInstance.close($scope.loggedStatus=false);
            });
      });
 }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
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
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': data[0].departure}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                $scope.mapCenter= (results[0].geometry.location);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });




    });



});

/** price slider controller
 * search result page
 */
carApp.controller('pricingCtrl',function($scope){
    $scope.position = {
        name: 'Potato Master',
        minAge: 0,
        maxAge: 600
    };
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
