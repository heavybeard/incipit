/**
 * UGLIFY SCRIPTS
 * @description Uglify all javascripts file in asset
 * @depend concatScripts
 */

var gulp = require('gulp'),
    config = require('../../config'),
    uglify = require('gulp-uglify');

gulp.task('uglifyScript', ['concatScripts'], function () {
    return gulp.src(config.path.script.asset + '/script.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.path.script.asset));
});
