var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpUtil = require('gulp-util');
var babel = require('gulp-babel');
//var minify = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('js', function() {
   gulp.src(['jvscript/*.js','jvscript/**/*.js','jvscript/**/**/*.js'])
   .pipe(concat('script.js'))
   .pipe(babel({ presets: ['es2015'] }))
   .pipe(ngAnnotate())
   //.pipe(uglify()).on('error', gulpUtil.log)
   .pipe(gulp.dest('build/scripts/'));
});
