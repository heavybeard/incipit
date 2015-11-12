/**
 * REGISTER TASKS
 * Register all tasks for every test o environment
 * The order is important
 *
 * ALL: for all environments
 * DEV: for development environment - grunt
 * PROD: for production environment - grunt prod
 */

module.exports = {
    'default': [
        'concurrent:dev1',
        'concurrent:dev2',
    ],
    'dist': [
        'concurrent:dist1',
        'concurrent:dist2',
    ],
};
