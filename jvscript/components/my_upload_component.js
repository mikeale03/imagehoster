angular.module('MyApp').component('myUpload', {
    bindings: {
        imgs : '<',
        onDelete : '&',
        onAddFiles: '&'
    },
    controller: function() {
        var ctrl = this;
        ctrl.$onChanges = function (changes) {
            if (changes.imgs) {
                ctrl.imgs = changes.imgs.currentValue;
            }
        };
        ctrl.delete = function(img) {
            ctrl.onDelete({
                $event: {
                    image:img
                }
            });
        };
        ctrl.addFiles = function(ev) {
            ctrl.onAddFiles({
                $event: ev
            })
        }
    },
    template: 
    `<div style="text-align:center" class="file-input">
        <br>
        <h1>Upload Your Images</h1>
        <div style="display:inline-block">
            <br>
            <b>Browse Your Images<b>
            <input type="file" multiple accept="image/*" on-file-input="$ctrl.addFiles($event)" />
            <br>
            <b>Or Drag and Drop Your Images Here</b>
        </div>
    </div>
    <div class="upload-images">
            <drop-image ng-repeat="img in $ctrl.imgs track by img.id" img="img" delete="$ctrl.delete(img)"></drop-image>
    </div>`
});