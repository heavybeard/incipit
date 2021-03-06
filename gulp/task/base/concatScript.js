/**
 * CONCAT SCRIPT
 * @description Concat all javascripts file in source and generate a sourcemap
 */

var gulp = require('gulp'),
    config = require('../../config'),
    maps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    notify = require("gulp-notify");

gulp.task('concatScript', function () {
    return gulp.src([
            config.path.script.source + '/vendor/_extend.js',
            config.path.script.source + '/vendor/_picturefill.js',
            config.path.script.source + '/vendor/_videojs.js',
            config.path.script.source + '/vendor/_lazysizes.js',
            config.path.script.source + '/vendor/_zoom.js',
            config.path.script.source + '/plugin/_async-style.js',
            config.path.script.source + '/plugin/_ga-event-track.js',
            config.path.script.source + '/script.js',
        ])
        .pipe(maps.init())
        .pipe(concat('script.js'))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'Script concatenated'
        }))
        .pipe(maps.write(config.path.sourcemap))
        .pipe(gulp.dest(config.path.script.asset))
        .pipe(livereload());
});
