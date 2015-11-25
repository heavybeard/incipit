/**
 * UGLIFY
 * Combine and uglify all javascripts
 */
var files = {
    'dist/public_html/asset/script/script.min.js': [
        'source/script/script.js',
        'source/script/vendor/_example.js',
    ],
};

module.exports = {
    dev: {
        files: files,
        options: {
            beautify: true,
            mangle: false,
            compress: false,
            preserveComments: 'all',
        },
    },
    dist: {
        files: files,
        options: {
            beautify: false,
            mangle: true,
            compress: true,
            preserveComments: false,
        },
    },
};
