angular.module('eClass', ['ngRoute']).config(config)

function config($routeProvider) {
    $routeProvider
      .when('/teacher', {
        templateUrl: 'teacher/teacher.html',
        controller: teacherCtrl,
        controllerAs: 'vm'
      })
  }