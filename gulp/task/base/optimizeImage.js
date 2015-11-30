/**
 * OPTIMIZE IMAGE
 * @description Optimize the images in source
 */

var gulp = require('gulp'),
    config = require('../../config'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload');

gulp.task('optimizeImage', function () {
    return gulp.src(config.path.image.source + '/**/*')
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(gulp.dest(config.path.image.asset))
        .pipe(livereload());
});
