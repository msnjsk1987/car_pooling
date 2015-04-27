var carApp = angular.module('carPoolingApp', ['ngRoute','ngMap','ui.slider','ui.bootstrap','ngFacebook']);

carApp.config( function( $facebookProvider ) {
    $facebookProvider.setAppId('278307552320713');
})

    .run( function( $rootScope ) {
        // Load the facebook SDK asynchronously
        (function(){
            // If we've already installed the SDK, we're done
            if (document.getElementById('facebook-jssdk')) {return;}

            // Get the first script element, which we'll use to find the parent node
            var firstScriptElement = document.getElementsByTagName('script')[0];

            // Create a new script element and set its id
            var facebookJS = document.createElement('script');
            facebookJS.id = 'facebook-jssdk';

            // Set the new script's source to the source of the Facebook JS SDK
            facebookJS.src = '//connect.facebook.net/en_US/sdk.js';

            // Insert the Facebook JS SDK into the DOM
            firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
        }());
    })

// configure our routes
carApp.config(function($routeProvider) {

    $routeProvider
        .when('/',{
            templateUrl: 'app/views/home.html',
            controller:'homeController'
        })
        .when('/howitWorks', {
            templateUrl: 'app/views/how-does-it-work.html',
            controller: 'mainController'
        })
        .when('/search-result/:query', {
            templateUrl: 'app/views/search-result.html',
            controller: 'searchResultController'
        })
        .when('/ride-detail/:id', {
            templateUrl: 'app/views/ride-details.html',
            controller: 'rideDetailController'
        })
        .when('/my-account', {
            templateUrl: 'app/views/my-account.html',
            controller: 'myAccountController'
        })
         .when('/offer-rides', {
                templateUrl: 'app/views/offer-rides.html',
                controller: 'offerRidesController'
            })
        .otherwise({
            redirectTo: '/'
         });
});


