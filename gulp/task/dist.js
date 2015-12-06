/**
 * GULP DIST
 * @description Clean all asset files; concat than uglify scripts; compile Sass
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
