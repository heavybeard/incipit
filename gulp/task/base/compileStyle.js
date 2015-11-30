/**
 * COMPILA SASS
 * @description Compiling all sass file; combining media queries; autoprefixing css and generating a sourcemap
 */

var gulp = require('gulp'),
    config = require('../../config'),
    maps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    combine = require('gulp-combine-mq'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    notify = require("gulp-notify");

gulp.task('compileStyle', function () {
    return gulp.src(config.path.style.source + '/style.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(combine())
        .pipe(notify('Style compiled'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(maps.write(config.path.sourcemap))
        .pipe(gulp.dest(config.path.style.asset))
        .pipe(livereload());
});
