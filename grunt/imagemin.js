/**
 * IMAGEMIN
 * Run grunt tasks concurrently
 */

module.exports = {
    options: {
        cache: false
    },
    default: {
        files: [{
            expand: true,
            cwd: 'source/image/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'dist/public_html/asset/img/',
        }],
    },
};
