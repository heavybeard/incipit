/**
 * ASYNC STYLE
 * @description Add "media" attribute to selected tag relative to "data-media". Default is "all"
 * @see http://keithclark.co.uk/articles/loading-css-without-blocking-render/
 * @param DOM element link[rel="stylesheet"] to download
 */

var asyncStyle = function (element) {
    'use strict';
    
    /** Set media to all */
    if (element.media === 'none') {
        element.media = element.getAttribute('data-media') || 'all';
    }
};
