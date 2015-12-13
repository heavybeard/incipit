/**
 * GULP CONFIG
 * @description All variables here
 * @see https://blog.simpleblend.net/gulp-organization-structure/
 */

module.exports = {
    domain: 'www.incipit.local',
    path: {
        project: './',
        style: {
            source: 'source/style',
            asset:  'dist/public_html/asset/style',
        },
        script: {
            source: 'source/script',
            asset:  'dist/public_html/asset/script',
        },
        image: {
            source: 'source/image',
            asset:  'dist/public_html/asset/image',
        },
        video: {
            source: 'source/video',
            asset:  'dist/public_html/asset/video',
        },
        font: {
            source: 'source/font',
            asset:  'dist/public_html/asset/font',
        },
        sourcemap: 'sourcemaps',
    },
};
