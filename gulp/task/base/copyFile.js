/**
 * COPY FILE
 * @description Copy files from source in assets (if no optimization for the file is enable)
 */

var gulp = require('gulp'),
    config = require('../../config'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed'),
    notify = require("gulp-notify");

gulp.task('copyVideo', function () {
    return gulp.src(config.path.video.source + '/**/*')
        .pipe(changed(config.path.video.asset))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'File copied',
        }))
        .pipe(gulp.dest(config.path.video.asset))
        .pipe(livereload());
});

gulp.task('copyFont', function () {
    return gulp.src(config.path.font.source + '/**/*')
        .pipe(changed(config.path.font.asset))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'File copied',
        }))
        .pipe(gulp.dest(config.path.font.asset))
        .pipe(livereload());
});
