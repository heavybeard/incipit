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
    gulp.watch(config.path.video.source + '/**/*.{jpg,png}', ['optimizeImagePoster']);
    gulp.watch([config.path.video.source + '/**/*', '!' + config.path.video.source + '/**/*.{jpg,png}'], ['compileVideo']);
    gulp.watch(config.path.font.source + '/**/*', ['compileFont']);
});
