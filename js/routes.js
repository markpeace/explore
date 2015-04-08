explore.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('connect', {
                url: '/connect',
                controller:'Connect',
                templateUrl: 'pages/connect.html'
        })
        $urlRouterProvider.otherwise("/connect");

})