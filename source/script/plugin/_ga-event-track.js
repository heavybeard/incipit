/**
 * GA EVENT TRACK
 * @description Plugin for tracking event
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * @param DOM element The tracker element
 */

var gaEventTrack = function (element, options) {
    'use strict';

    var eventTrack = {
        category: element.getAttribute('data-event-category') || 'scroll',
        action: element.getAttribute('data-event-action'),
        label: element.getAttribute('data-event-label') || options.label || element.getAttribute('title') || element.getAttribute('href') ,
    };

    /** 
     * Track default
     * @description The default ga.send function
     * @param string category
     * @param string action
     * @param string label
     */
    var gaSend = function (category, action, label) {
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label
        });
    };

    /** Track pdf */
    var pdf = function (label) {
        gaSend('PDF', 'view', label);
    };

    /** Track link */
    var link = function (label) {
        gaSend('Link', 'click', label);
    };

    /** Track scroll */
    var scroll = function (label) {
        label = (label === null) ? 0 : label;

        gaSend('View', 'scroll', label);
    };

    /** Track event by category */
    switch (eventTrack.category) {
        case 'pdf':
            pdf(eventTrack.label);
            break;
        case 'link':
            link(eventTrack.label);
            break;
        case 'scroll':
            scroll(eventTrack.label);
            break;
        default:
            gaSend(eventTrack.category, eventTrack.action, eventTrack.label);
            break;
    }
};

/**
 * GA SCROLL PERCENTAGE EVENT TRACK
 * @description Plugin for tracking scroll event on selected fire points
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * @param object elementToScroll The DOM element to scroll
 * @param double fireHeight The percentage on send event track
 */
var gaScrollPercentageEventTrack = function (elementToScroll, fireHeight) {
    'use strict';

    /** Set currentYPosition */
    var currentYPosition = window.pageYOffset;
    /** Store percentage to fire */
    var firePoints = {};
    for (var i = 0; i <= (100 / fireHeight); i++) {
        firePoints[fireHeight * i] = false;
    }

    /** Attach scroll event */
    window.addEventListener('scroll', function () {
        /** Only scroll down*/
        if (window.pageYOffset > currentYPosition) {
            /** Set current height in percent */
            var currentHeightPercent = document.documentElement.scrollTop || document.body.scrollTop / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100 | 0;

            /** Set approx fired percentage from the current height in percentage */
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
            if (!firePoints[currentApproxHeightPercentage]) {
                gaEventTrack(elementToScroll, {
                    label: currentApproxHeightPercentage
                });
                /** Set fired */
                firePoints[currentApproxHeightPercentage] = true;
            }
        }

        /** Set new currentYPosition*/
        currentYPosition = window.pageYOffset;
    });
};
