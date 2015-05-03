document.addEventListener("deviceready", function() {
        alert("trying");
        try {
                app = angular.module('explore', ['ionic']);
        } catch(ex){
                alert(ex);
        }        
}, false);
