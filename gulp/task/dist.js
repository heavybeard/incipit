/**
 * GULP DIST
 * @description Task for distribution
 */

var gulp = require('gulp');

gulp.task('dist', [
    'clean'
], function () {
    gulp.start([
        'uglifyScript',
        'compileStyle',
        'optimizeImage'
    ], function () {
        gulp.start([
            'webpImage'
        ]);
    });
});
