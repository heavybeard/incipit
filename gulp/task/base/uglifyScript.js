/**
 * UGLIFY SCRIPTS
 * @description Uglify all javascripts file in asset
 * @depend concatScripts
 */

var gulp = require('gulp'),
    config = require('../../config'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('uglifyScript', ['concatScript'], function () {
    return gulp.src(config.path.script.asset + '/script.js')
        .pipe(uglify())
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'Script uglified'
        }))
        .pipe(gulp.dest(config.path.script.asset));
});
