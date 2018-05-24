angular.module('eClass')
.controller("loginCtrl", function($location){
    vm.login() = function(){
        $http({
            method  : 'GET',
            url     : '/api/students',
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
           }).then(function(response){
            if(response.status == 200){
                for(var i = 0; i < response.data.length; i++){
                    vm.userArr = [];
                    vm.userArr.push(response.data[i].userName);
                    vm.pwd = [];
                    vm.pwd.push(response.data[i].password); 
                    
                    for(var k = 0; k < userArr.length; k++){
                        if(vm.userName[k] == vm.userNameLog && vm.pwd[k] == vm.passwordLog){
                            $location.path("/students")
                        }
                    }
                }
            }
        }).catch(function(error){
            console.log(error);
        });
    }  
})