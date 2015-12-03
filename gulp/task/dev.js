/**
 * GULP DEV
 * @description Concat scripts and compile styles
 */

var gulp = require('gulp');

gulp.task('dev', [
    'concatScript',
    'compileStyle',
    'optimizeImage',
    'webpImage'
]);
