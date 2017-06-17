angular.module('MyApp')
  .component('signUp', {
    controller: function(Ajax, $rootScope, $location) {
      var ctrl = this;
      ctrl.user = {};
      ctrl.isMatch = true;
      ctrl.hasError = false;
      ctrl.errorMsg = "";
      this.signUp = function(email,pass,ver) {
        ctrl.hasError = false;
        if(pass!== ver) {
          ctrl.isMatch = false;
          ctrl.errorMsg = "Password don't match!";
        } else {
          ctrl.isMatch = true;
          Ajax.signUp(ctrl.user)
          /*$http({
            method:"POST",
            url:"/ImageGallery/php/sign_up.php",
            data: ctrl.user,
            //transformRequest: angular.identity,
            headers:{"Content-Type":"application/x-www-form-urlencoded"}*/
          .then(function(response) {
            if(response.data.log_in) {
              $rootScope.userData = response.data;
              $location.path("/upload");
            } else {
              ctrl.errorMsg = response.data.error_msg;
              ctrl.hasError = true;
            }
          }, function(response) {
              ctrl.errorMsg = "Server Error!";
          });
        }
      }
    },
    template: 
      `<div class="sign-form">
        <br>
        <h1>Create Your Account</h1>
        <br>
        <form class="form-group" ng-submit="$ctrl.signUp($ctrl.user.email,$ctrl.user.password,$ctrl.confirm)" method="post">
          <div class="{{$ctrl.hasError ? 'has-error':''}}">
            <input class="form-control" type="email" placeholder="Enter your email address" ng-model="$ctrl.user.email" required>
          </div>
          <div class="{{!$ctrl.isMatch ? 'has-error':''}}">
            <input class="form-control" type="password" placeholder="Enter your password" ng-model="$ctrl.user.password" required>
          </div>
          <div class="{{!$ctrl.isMatch ? 'has-error':''}}">
            <input class="form-control" type="password" placeholder="Confirm password" ng-model="$ctrl.confirm" required>
          </div>
          <p style="color:red;">{{$ctrl.errorMsg}}</p>
          <button class="btn btn-primary btn-block" type="submit">SUBMIT</button>
        </form>
      </div>`
  });
