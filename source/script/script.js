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
        stylesheetSelector: e.stylesheetSelector || 'link[rel="stylesheet"]',
        /** string */
        trackerSelector: e.trackerSelector || '[data-event-category]',
    };

    /**
     * DOWNLOAD STYLE
     * @description Download all style files
     * @param string Selector
     */
    var downloadStyle = function (selector) {
        var DOMstyles = document.querySelectorAll(selector);

        Array.prototype.forEach.call(DOMstyles, function (element, index) {
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
     * GA EVENT TRACK
     * @description Track on GA the events
     * @param string selector
     */
    var trackEvent = function (selector) {
        var DOMtrackers = document.querySelectorAll(selector);

        Array.prototype.forEach.call(DOMtrackers, function (element, index) {
            element.addEventListener('click', function () {
                gaEventTrack(element);
            }, false);
        });
    };

    /**
     * GA EVENT TRACK SCROLL
     */
    var trackEventScroll = function () {
        window.addEventListener('scroll', function() {
            var heightPercent = document.documentElement.scrollTop || document.body.scrollTop / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100 | 0;
            if (heightPercent % 10 === 0) {
                gaEventTrack(document.body, {
                    label: heightPercent
                });
            }
        });
    };

    /**
     * INIT
     * @description Functions for init the application
     */
    this.init = function () {
        downloadStyle(option.stylesheetSelector);
        pictureFill();
        zoomjs();
        lazySizes.init();
        trackEvent(option.trackerSelector);
        trackEventScroll();
    };

    /** INIT */
    this.init();
}

var incipit = new Incipit();
