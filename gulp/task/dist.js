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
        'compileVideo',
        'compileFont'
    ], function () {
        gulp.start([
            'webpImage'
        ]);
    });
});
