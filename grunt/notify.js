/**
 * NOTIFY
 * Automatic desktop notifications for Grunt errors and warnings 
 */

module.exports = {
    default: {
        options: {
            enabled: true,
            success: true,
            title: 'Build complete',
            message: '<%= pkg.name %> build finished successfully.',
        },
    },
};
