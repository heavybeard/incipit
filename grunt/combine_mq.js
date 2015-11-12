/**
 * COMBINE MEDIA QUERY
 * Combines mediaqueries
 */

module.exports = {
    default_options: {
        expand: true,
        beautify: true,
        cwd: 'source/.temp',                            //go in this folder
        src: '*.css',                                   //take files
        dest: 'dist/public_html/asset/style/',          //output them here
    },
    dist: {
        beautify: false,
    },
};
