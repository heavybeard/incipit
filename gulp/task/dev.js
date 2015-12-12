/**
 * GULP DEV
 * @description Task for development
 */

var gulp = require('gulp');

gulp.task('dev', [
    'concatScript',
    'compileStyle',
    'optimizeImage',
], function () {
    gulp.start([
        'webpImage'
    ]);
});
