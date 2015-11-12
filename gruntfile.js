module.exports = function (grunt) {
    'use strict';

    /**
     * GET TIME
     * Display the elapsed execution time of grunt tasks
     */
    require('time-grunt')(grunt);

    /**
     * LOAD PLUGINS
     * Load all plugins installed
     */
    require('load-grunt-config')(grunt);

};
