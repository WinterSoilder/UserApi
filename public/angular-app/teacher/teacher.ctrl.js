angular
.module('eClass')
.controller('teacherCtrl', teacherCtrl)

function teacherCtrl($http){
    vm.register = function(){
        var postRegisterData = {
            firstName : vm.firstName,
            lastName : vm.lastName,
            userName : vm.userName,
            password : vm.password
        };

        $http({
            method  : 'POST',
            url     : '/api/students',
            data    : $.param(postRegisterData),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
           }).then(function(response){
            if(response.status == 200){
                $route.reload();
                console.log(response);
            }
        }).catch(function(error){
            console.log(error);
        });
};
}