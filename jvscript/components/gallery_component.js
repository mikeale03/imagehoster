angular.module('MyApp').component('myGallery', {
    bindings : {
        imgs : '<'
    }, 
    controller : function(Ajax,$location,$rootScope) {
        var ctrl = this;
        ctrl.isShowModal = false;
        var length;
        ctrl.index = 0;
        ctrl.path = $location.protocol()+"://"+$location.host();
        this.$onInit = function() {
            ctrl.images = ctrl.imgs.data;
            length = ctrl.images.length;
        }
        
        ctrl.deleteImage = function(image) {
            Ajax.deleteImage(image).then(function(response) {
                console.log(response);
                if(response.data.deleted) {
                    var index = ctrl.images.indexOf(image);
                    ctrl.images.splice(index,1);
                }
            });
        }
        ctrl.renameImage = function(image) {
            $http({
                method:"POST",
                url:"/ImageGallery/php/rename_image.php",
                data: {
                    imageId: image.image_id,
                    imageName: image.image_name
                },
                transformRequest: angular.identity,
                headers:{"Content-Type":"application/x-www-form-urlencoded"}
            }).then(function(response) {
                console.log(response);
                if(response.data.updated) {
                    var index = ctrl.images.indexOf(image);
                    ctrl.images[index].image_name = image.image_name;
                }
            });
        }

        ctrl.showModal = function(image) {
            ctrl.index = ctrl.images.indexOf(image);
            ctrl.isShowModal = true;
        }

        ctrl.nextImage = function() {
            if( (ctrl.index+1) < length) {
                ctrl.index++;
            }
        }

        ctrl.prevImage = function() {
            if( (ctrl.index-1) > -1) {
                ctrl.index--;
            }
        }
        ctrl.closeModal = function() {
            ctrl.isShowModal = false;
        }

    },
    template: 
    `<div>
        <br>
        <h1>My Image Gallery</h1>
        <br>
        <h3 ng-if="$ctrl.images.length == 0">You have no images!</h3>
        <div class="upload-images">
            <div ng-repeat="img in $ctrl.images track by img.image_id" class="image-container">
                <div class="image-wrap" ng-click="$ctrl.showModal(img)">
                    <img ng-src="{{img.image_url}}">
                    <div class="image-name">{{img.image_name}}</div>
                </div>
                <div style="position:relative">
                    <button ng-click="$ctrl.deleteImage(img)">delete</button>
                </div>
            </div>
            <div class="mod" ng-show="$ctrl.isShowModal" >
                <div class="mod-content" tabindex="-1">
                    <div class="url">
                        URL: <input type="text" value="{{$ctrl.path +'/'+ $ctrl.images[$ctrl.index].image_url}}"/ readonly>
                    </div>
                    <img ng-src="{{$ctrl.images[$ctrl.index].image_url}}" >
                    <button ng-click="$ctrl.prevImage()" class="prevBtn"><span>&#60;</span></button>
                    <button ng-click="$ctrl.nextImage()" class="nxtBtn"><span>&#62;</span></button>
                    <button ng-click="$ctrl.closeModal()" class="closeBtn">X</button>
                    <div class="modal-image-name">{{$ctrl.images[$ctrl.index].image_name}}</div>
                </div>
            </div>
        </div>
    </div>`
})