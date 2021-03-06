angular.module('MyApp')
  .component('headerLogin', {
    controller: function($location) {
      this.isRoute = function(route) {
        console.log($location.path());
        if($location.path() == route) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    template: 
      `<nav class="navbar navbar-custom">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">Image Hoster. Your free image hosting site</a>
          </div>
          <ul class="nav navbar-nav navbar-right">
            <li class="{{$ctrl.isRoute('/upload') ? 'active':''}}"><a href="#/upload">UPLOAD</a></li>
            <li class="{{$ctrl.isRoute('/gallery') ? 'active':''}}"><a href="#/gallery">IMAGE GALLERY</a></li>
            <li><a href="#/logout">LOG OUT</a></li>
          </ul>
        </div>
      </nav>`
  });
