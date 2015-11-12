/**
 * WATCH
 * Start this plugin with 'grunt watch': on save it start 'grunt' task
 */

module.exports = {
    js: {
        files: ['source/script/**/*.js'],
        tasks: ['uglify:dev'],
        options: {
            livereload: true
        },
    },
    compass: {
        files: ['source/style/**/*.{scss,sass}'],
        tasks: ['compass:dev'],
        options: {
            livereload: true
        },
    },
    css: {
        files: ['source/.temp/*.css'],
        tasks: ['combine_mq'],
        options: {
            livereload: true
        },
    },
};
