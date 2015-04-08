explore.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

                .state('connect', {
                url: '/connect',
                controller:'Connect',
                templateUrl: 'pages/connect.html'
        })

                .state('menu', {
                url: '/menu',
                abstract: true,
                //controller:'MainUI',
                templateUrl: 'pages/mainUI.html'
        })
                .state('menu.clues', {
                url: '/clues',
                views: {
                        'centre-panel': {
                                templateUrl: 'pages/clues.html',
                        },
                        'left-panel': {
                                templateUrl: 'pages/menu.html'
                        }
                }
        })
         .state('menu.badges', {
                url: '/badges',
                views: {
                        'centre-panel': {
                                templateUrl: 'pages/badges.html',
                        },
                        'left-panel': {
                                templateUrl: 'pages/menu.html'
                        }
                }
        })
         .state('menu.notifications', {
                url: '/notifications',
                views: {
                        'centre-panel': {
                                templateUrl: 'pages/notifications.html',
                        },
                        'left-panel': {
                                templateUrl: 'pages/menu.html'
                        }
                }
        })
         .state('menu.leaguetable', {
                url: '/leaguetable',
                views: {
                        'centre-panel': {
                                templateUrl: 'pages/leaguetable.html',
                        },
                        'left-panel': {
                                templateUrl: 'pages/menu.html'
                        }
                }
        })
         .state('menu.groups', {
                url: '/groups',
                views: {
                        'centre-panel': {
                                templateUrl: 'pages/groups.html',
                        },
                        'left-panel': {
                                templateUrl: 'pages/menu.html'
                        }
                }
        })



        $urlRouterProvider.otherwise("/connect");

})