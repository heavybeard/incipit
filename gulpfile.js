/**
 * GULP
 * @description Gulp file for automate tasks
 * @see https://teamtreehouse.com/library/gulp-basics/
 */

var requireDir = require('require-dir');

requireDir('gulp/task', {
    recurse: true
});
