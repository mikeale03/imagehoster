angular.module("MyApp")
  .directive("myUpload", function() {
    return {
      restrict: "A",
      scope: {
        images:"="
      },
      templateUrl: "template/images.html",
      controller: function($scope) {
        var ctrl = this;
        ctrl.images = $scope.images;

      },
      controllerAs: "upCtrl",

    }
  })
