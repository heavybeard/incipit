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
        sourcemap: 'sourcemaps',
    },
};
