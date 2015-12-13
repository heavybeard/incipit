/**
 * GULP DEV
 * @description Task for development
 */

var gulp = require('gulp');

gulp.task('dev', [
    'concatScript',
    'compileStyle',
    'optimizeImage',
    'compileVideo',
    'compileFont'
], function () {
    gulp.start([
        'webpImage'
    ]);
});
