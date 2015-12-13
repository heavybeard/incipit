/**
 * COMPILE FONT
 * @description Copy fonts from source to asset
 */

var gulp = require('gulp'),
    config = require('../../config'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed'),
    notify = require("gulp-notify");

gulp.task('compileFont', function () {
    return gulp.src(config.path.font.source + '/**/*')
        .pipe(changed(config.path.font.asset))
        .pipe(notify({
            title: '<%= file.relative %>',
            message: 'Font compiled',
        }))
        .pipe(gulp.dest(config.path.font.asset))
        .pipe(livereload());
});
