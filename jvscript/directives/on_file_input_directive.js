angular.module("MyApp")
  .directive("onFileInput",function() {
    return function ($scope, element, attr, ctrl) {
      element.bind("change", function(e) {
          var files = e.target.files;
          $scope.$eval(attr.onFileInput, { $event: {files:files} });
    });
  }
});
