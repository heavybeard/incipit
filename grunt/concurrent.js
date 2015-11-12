/**
 * CONCURRENT
 * Run grunt tasks concurrently
 */

module.exports = {
    /**
     * DEV
     * dev1: uglify js and compile compass
     * dev2: combine js and combine mq
     */
    dev1: [
        'newer:uglify:dev',
        'newer:compass:dev',
    ],
    dev2: [
        'newer:uglify:all',
        'newer:combine_mq',
    ],

    /**
     * DIST
     * dist1: uglify js and compile compass
     * dist2: combine js and combine mq
     */
    dist1: [
        'uglify:dist',
        'compass:dist',
        'imagemin',
    ],
    dist2: [
        'uglify:all',
        'combine_mq:dist',
    ],
};
