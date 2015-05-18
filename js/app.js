if (typeof cordova === 'object') {
        document.addEventListener("deviceready", function() {

                angular.bootstrap(document, ["explore"]);  
                
        },false);

} else {        
        angular.element(document).ready(function() {
                angular.bootstrap(document, ["explore"]);
        });
}

app = angular.module('explore', ['ionic', 'monospaced.qrcode']);