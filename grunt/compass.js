/**
 * COMPASS
 * Use the compass plugin for compile sass/scss files
 */

module.exports = {
    dev: {
        options: {
            sassDir: 'source/style',        //search files in this folder
            cssDir: 'source/.temp',         //output them here
            environment: 'development',
            outputStyle: 'expanded',
        },
    },
    dist: {
        options: {
            sassDir: 'source/style',        //search files in this folder
            cssDir: 'source/.temp',         //output them here
            environment: 'production',
            outputStyle: 'compressed',
        },
    },
};
