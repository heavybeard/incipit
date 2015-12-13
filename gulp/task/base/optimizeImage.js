/**
 * OPTIMIZE IMAGE
 * @description Optimize the images in source
 */

var gulp = require('gulp'),
    config = require('../../config'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed'),
    notify = require('gulp-notify');

gulp.task('optimizeImage', function () {
    return gulp.src(config.path.image.source + '/**/*')
        .pipe(changed(config.path.image.asset))
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'Image optimized',
        }))
        .pipe(gulp.dest(config.path.image.asset))
        .pipe(livereload());
});
