/**
 * CLEAN
 * @description Clean files for a new dist version
 */

var gulp = require('gulp'),
    config = require('../../config'),
    del = require('del');

gulp.task('clean', function () {
    del([
        config.path.style.asset,
        config.path.script.asset,
        config.path.image.asset,
    ]);
});
