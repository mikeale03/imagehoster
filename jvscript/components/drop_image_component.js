angular.module('MyApp').component('dropImage', {
    bindings: {
        img : '<',
        delete: '&'
    },
    controller: function($http) {
        var ctrl = this;
        ctrl.isUploading = false;
        ctrl.isUploadComplete = false;
        ctrl.uploadPercent = 0;
        ctrl.uploadUrl = ""

        ctrl.$onChanges = function (changes) {
            if (changes.img) {
                ctrl.img = changes.img.currentValue;
            }
        };
        
        ctrl.upload = function(image, e) {
          console.log(e.target);
          e.target.disabled = true;
          var fd = new FormData();
          fd.append("file",image);
          console.log(image);
          $http({
            method:"POST",
            url:"/ImageGallery/php/upload.php",
            eventHandlers: {
              progress: function(c) {
                console.log('Progress -> ' + c);
                console.log(c);
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                ctrl.isUploading = true;
                ctrl.uploadMsg = "Uploading:";
                if(e.lengthComputable) {
                  ctrl.uploadPercent = parseInt(e.loaded / e.total * 100)
                  console.log('UploadProgress -> ' + e);
                  console.log(e);
                }
              }
            },
            data: fd,
            transformRequest: angular.identity,
            headers:{"Content-Type":undefined}
          }).then(function(response) {
            console.log(response.data);
            if(response.data.success) {
              ctrl.isUploadComplete = true;
              ctrl.uploadMsg = response.data.message;
              ctrl.uploadUrl = response.data.url;
            } else {
              ctrl.isUploadComplete = true;
              ctrl.uploadMsg = response.data;
            }
          });
        }
        
    },
    template: 
    `<div class="image-container">
        <a ng-if = "$ctrl.isUploadComplete"  href="{{$ctrl.uploadUrl}}" target="_blank">
            <div class="image-wrap">
                <img ng-src="{{$ctrl.img.src}}">
            </div>
        </a>
        <div ng-hide = "$ctrl.isUploadComplete" class="image-wrap">
            <img ng-src="{{$ctrl.img.src}}">
        </div>
        <div class="upload-stat" ng-if="$ctrl.isUploading">
            {{$ctrl.uploadMsg}} <span ng-hide="$ctrl.isUploadComplete"> {{$ctrl.uploadPercent+"%"}}</span>
        </div>
        <div>
            <button ng-click="$ctrl.delete($ctrl.img)">delete</button>
            <button type="button" name="button" ng-hide="$ctrl.isUploadComplete" ng-click="$ctrl.upload($ctrl.img.file, $event)">upload</button>
        </div>
    </div>`
});