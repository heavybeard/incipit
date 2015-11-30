/**
 * GULP WATCH
 * @description Run watched tasks
 */

var gulp = require('gulp'),
    config = require('../../config'),
    livereload = require('gulp-livereload');

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(config.path.style.source + '/**/*.scss', ['compileStyle']);
    gulp.watch(config.path.script.source + '/**/*.js', ['concatScript']);
    gulp.watch(config.path.image.source + '/**', ['optimizeImage']);
});
