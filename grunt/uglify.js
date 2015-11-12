/**
 * UGLIFY
 * Combine and uglify all javascripts
 */

module.exports = {
    all: {
        files: {
            'dist/public_html/asset/script/script.min.js': [
                'source/script/script.js',
                //'js/main.js'
            ],
        },
    },
    dev: {
        options: {
            beautify: true,
            mangle: false,
            compress: false,
            preserveComments: 'all',
        },
        src: 'source/script/*.js',
        dest: 'dist/public_html/asset/script/script.min.js',
    },
    dist: {
        options: {
            beautify: false,
            mangle: true,
            compress: true,
            preserveComments: false,
        },
        src: 'source/script/*.js',
        dest: 'dist/public_html/asset/script/script.min.js',
    },
};
