/**
 * ASYNC STYLE
 * @description Add "media" attribute to selected tag relative to "data-media". Default is "all"
 * @see http://keithclark.co.uk/articles/loading-css-without-blocking-render/
 * @param DOM el link[rel="stylesheet"] to download
 */
asyncStyle = function (el) {
    if (el.media == 'none')
        el.media = el.getAttribute('data-media') || 'all';
};
