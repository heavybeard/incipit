/**
 * SCRIPTS
 * Use the script
 */

/**
 * INCIPIT
 * @description Object for manage the application
 * @param object extend list of variables
 */
function Incipit(extend) {
    'use strict';

    /** Define extend variables */
    var e = extend || {};

    /**
     * OPTION
     * @description Variables extended by variable extend
     */
    var option = {
        /** string */
        linkSelector: e.linkSelector || 'link[rel="stylesheet"]'
    };

    /**
     * DOWNLOAD STYLE
     * @description Download all style files
     * @param string stylesheetSelector
     */
    var downloadStyle = function (stylesheetSelector) {
        var DOMstyle = document.querySelectorAll(stylesheetSelector);

        Array.prototype.forEach.call(DOMstyle, function (element, index) {
            window.addEventListener('load', function () {
                asyncStyle(element);
            }, false);
        });
    };

    /**
     * PICTUREFILL
     * @description Polyfill for picture tag
     */
    var pictureFill = function () {
        document.createElement('picture');
    };

    /**
     * LAZY LOAD IMAGE
     * @description Lazy loading image
     */
    var lazyLoadImage = function () {
        var bLazy = new Blazy({ 
            selector: 'img'
        });
    };

    /**
     * INIT
     * @description Functions for init the application
     */
    this.init = function () {
        downloadStyle(option.linkSelector);
        pictureFill();
    };

    /** INIT */
    this.init();
}
