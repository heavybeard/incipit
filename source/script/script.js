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
     * GA EVENT TRACK
     * @description Track on GA the events
     * @param string selector
     */
    var trackEvent = function (selector) {
        var DOMtrackers = document.querySelectorAll(selector);

        /** Attach click event on each element */
        Array.prototype.forEach.call(DOMtrackers, function (element, index) {
            element.addEventListener('click', function () {
                gaEventTrack(element);
            }, false);
        });
    };

    /**
     * GA EVENT TRACK SCROLL
     */
    var trackEventScroll = function (fireHeight) {
        /** Set currentYPosition */
        var currentYPosition = window.pageYOffset;
        /** Store percentage to fire */
        var percentageFired = {};
        for (var i = 0; i <= (100 / fireHeight); i++) {
            percentageFired[fireHeight * i] = false;
        }

        /** Attach scroll event */
        window.addEventListener('scroll', function() {
            var currentHeightPercent = document.documentElement.scrollTop || document.body.scrollTop / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100 | 0;

            /** Only scroll down*/
            if (window.pageYOffset > currentYPosition) {
                /** Set approx fired percentage */
                var currentApproxHeightPercentage;
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    currentApproxHeightPercentage = 100;
                } else {
                    for (var i = 1; i <= (100 / fireHeight); i++) {
                        if (currentHeightPercent <= fireHeight * i) {
                            currentApproxHeightPercentage = fireHeight * i - fireHeight;
                            break;
                        }
                    }
                }

                /** Track only once */
                if (!percentageFired[currentApproxHeightPercentage]) {
                    gaEventTrack(document.body, {
                        label: currentApproxHeightPercentage
                    });
                    /** Set fired */
                    percentageFired[currentApproxHeightPercentage] = true;
                }
            }

            /** Set new currentYPosition*/
            currentYPosition = window.pageYOffset;
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
        trackEventScroll(option.trackPercentageFire);
    };

    /** INIT */
    this.init();
}

var incipit = new Incipit();
