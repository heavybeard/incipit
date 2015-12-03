/**
 * OPTIMIZE IMAGE
 * @description Optimize the images in source
 */

var gulp = require('gulp'),
    config = require('../../config'),
    imageminWebp = require('imagemin-webp'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify');
 
gulp.task('webpImage', function () {
    return gulp.src([config.path.image.asset + '/**/*.{jpg,png}', '!' + config.path.image.asset + '/web-app/**'])
        .pipe(imageminWebp({
            quality: 50
        })())
        .pipe(notify('Image converted in webp'))
        .pipe(gulp.dest(config.path.image.asset))
        .pipe(livereload());
});
