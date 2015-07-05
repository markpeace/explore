if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["explore"]);  

        },false);

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["explore"]);
        });
}

app = angular.module('explore', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ionic.service.push', 'monospaced.qrcode', 'parseconnector']);

app
        .config(['$ionicAppProvider', function($ionicAppProvider) {
                $ionicAppProvider.identify({
                        app_id: '592f2161',
                        api_key: 'ebd1f1ccf6fb01eb76f8e404e05716573dc3b3eacfcb6a37',
                        //dev_push: true
                });
        }])
        .run(['$ionicAnalytics', '$ionicPush', function($ionicAnalytics, $ionicPush) {
                $ionicAnalytics.register();
        }])