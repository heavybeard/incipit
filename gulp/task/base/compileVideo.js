/**
 * COMPILE VIDEO
 * @description Copy video from source in asset
 */

var gulp = require('gulp'),
    config = require('../../config'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed'),
    notify = require("gulp-notify"),
    imagemin = require('gulp-imagemin');

/** Optimize poster image */
gulp.task('optimizeImagePoster', function () {
    return gulp.src(config.path.video.source + '/**/*.{jpg,png}')
        .pipe(changed(config.path.video.asset))
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'Poster Image optimized',
        }))
        .pipe(gulp.dest(config.path.video.asset))
        .pipe(livereload());
});

/** Copy Video */
gulp.task('compileVideo', ['optimizeImagePoster'], function () {
    return gulp.src([config.path.video.source + '/**/*.*', '!' + config.path.video.source + '/**/*.{jpg,png}'])
        .pipe(changed(config.path.video.asset + '/**/*'))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'File copied',
        }))
        .pipe(gulp.dest(config.path.video.asset))
        .pipe(livereload());
});
