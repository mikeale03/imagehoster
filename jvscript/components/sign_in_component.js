angular.module('MyApp')
  .component('signIn', {
    controller: function(Ajax,$rootScope,$location) {
      var ctrl = this;
      ctrl.errorNum = 0;
      ctrl.user = {};
      ctrl.isInvalid = false;

      this.signIn = function() {
        Ajax.signIn(ctrl.user)
        .then(function(response) {
          console.log(response.data);
          if(response.data.log_in) {
            $rootScope.userData = response.data;
            $location.path("/login");
          } else {
            ctrl.isInvalid = true;
            ctrl.errorNum = response.data.error_num;
            ctrl.errMsg = response.data.error_msg;
          }
        }, function(resp) {
          ctrl.isInvalid = true;
          ctrl.errMsg = "Server Error!";
        });
      }
    },
    template:
      `<div class="sign-form" >
        <br>
        <h1>Sign In To Your Account</h1>
        <br>
        <form class="form-group" ng-submit="$ctrl.signIn()" method="post">
          <div class="form-group {{$ctrl.errorNum == 1? 'has-error':'' }}">
            <input type="email" class="form-control"  ng-model="$ctrl.user.email" placeholder="Email Address">
          </div>
          <div class="form-group {{$ctrl.errorNum == 2? 'has-error':''}}">
            <input type="password"  class="form-control" ng-model="$ctrl.user.password" placeholder="Password">
          </div>
            <p style="color:red;" ng-if="$ctrl.isInvalid">{{$ctrl.errMsg}}</p>
          <button class="btn btn-primary btn-block" type="submit">LOG IN</button>
        </form>
      </div>`
  });
