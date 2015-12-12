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
        'optimizeImage',
        'copyVideo',
        'copyFont'
    ], function () {
        gulp.start([
            'webpImage'
        ]);
    });
});
