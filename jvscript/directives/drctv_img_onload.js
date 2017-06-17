angular.module("MyApp")
  .directive("imgOnload", function() {
    return {
      restrict: "A",

      controller: function($scope) {

      },
      controllerAs: "imgOnloadCtrl",
      link: function($scope, element, attr, ctrl) {
          console.log(element);
          element.on("load", function() {
            var height = this.naturalHeight;
            var width = this.naturalWidth;
            console.log(height);
            console.log(width);
            if(height > width) {
              //ctrl.isPortrait = true;
              this.className = "portrait";
            }
            else {
              this.className = "landscape";
              //ctrl.isPortrait = false;
            }
            console.log(ctrl.isPortrait);
          });
          //if(height>width) {
        //    $scope.isPortrait = true;
          //}

      }

    }
  })
