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
            base(eventTrack.category, eventTrack.action, eventTrack.label);
            break;
    }
};
