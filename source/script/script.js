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
        /** int */
        trackPercentageFire: e.trackPercentageFire || 25,
        /** string */
        videoSelector: e.videoSelector || 'video',
    };

    /**
     * DOWNLOAD STYLE
     * @description Download all style files
     * @param string Selector
     */
    var downloadStyle = function (selector) {
        var DOMstyles = document.querySelectorAll(selector);

        /** On window.load set media to element */
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
     * VIDEO PLAYER
     * @description Init VideoJS for custom player
     */
    var videoPlayer = function (selector) {
        /** Remove Cookie for improve */
        window.HELP_IMPROVE_VIDEOJS = false;

        var DOMvideos = document.body.querySelectorAll(selector);

        /** Init */
        Array.prototype.forEach.call(DOMvideos, function (element, index) {
            videojs(element);
        });
    };

    /**
     * GA EVENT TRACK
     * @description Track on GA the events
     * @param string selector
     */
    var trackEvent = function (selector) {
        var DOMtrackers = document.body.querySelectorAll(selector);

        /** Attach click event on each element */
        Array.prototype.forEach.call(DOMtrackers, function (element, index) {
            element.addEventListener('click', function () {
                gaEventTrack(element);
            }, false);
        });
    };

    /**
     * GA EVENT TRACK SCROLL
     * @description Track scroll in different fire points
     * @param double fireHeight The height for calculate fire point (max 100)
     */
    var trackEventScroll = function (fireHeight) {
        gaScrollPercentageEventTrack(document.body, fireHeight);
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
        trackEventScroll(option.trackPercentageFire);
        videoPlayer();
    };

    /** INIT */
    this.init();
}

var incipit = new Incipit();
