/**
 * REGISTER TASKS
 * Register all tasks for every test or environment
 * The order is important
 */

module.exports = {
    'default': [
        'concurrent:dev1',
        'concurrent:dev2',
        'notify',
    ],
    'dist': [
        'concurrent:dist1',
        'concurrent:dist2',
    ],
};
