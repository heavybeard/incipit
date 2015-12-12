/**
 * GULP DEV
 * @description Task for development
 */

var gulp = require('gulp');

gulp.task('dev', [
    'concatScript',
    'compileStyle',
    'optimizeImage',
    'copyVideo',
    'copyFont'
], function () {
    gulp.start([
        'webpImage'
    ]);
});
