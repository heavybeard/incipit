/**
 * PICTUREFILL
 * @description Add IE compatibility for picture html tag
 * @see https://scottjehl.github.io/picturefill/
 */

/*! Picturefill - v3.0.1 - 2015-09-30
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
/*! Gecko-Picture - v1.0
 * https://github.com/scottjehl/picturefill/tree/3.0/src/plugins/gecko-picture
 * Firefox's early picture implementation (prior to FF41) is static and does
 * not react to viewport changes. This tiny module fixes this.
 */
(function(window) {
    /*jshint eqnull:true */
    var ua = navigator.userAgent;

    if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 41) ) {
        addEventListener("resize", (function() {
            var timer;

            var dummySrc = document.createElement("source");

            var fixRespimg = function(img) {
                var source, sizes;
                var picture = img.parentNode;

                if (picture.nodeName.toUpperCase() === "PICTURE") {
                    source = dummySrc.cloneNode();

                    picture.insertBefore(source, picture.firstElementChild);
                    setTimeout(function() {
                        picture.removeChild(source);
                    });
                } else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
                    img._pfLastSize = img.offsetWidth;
                    sizes = img.sizes;
                    img.sizes += ",100vw";
                    setTimeout(function() {
                        img.sizes = sizes;
                    });
                }
            };

            var findPictureImgs = function() {
                var i;
                var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
                for (i = 0; i < imgs.length; i++) {
                    fixRespimg(imgs[i]);
                }
            };
            var onResize = function() {
                clearTimeout(timer);
                timer = setTimeout(findPictureImgs, 99);
            };
            var mq = window.matchMedia && matchMedia("(orientation: landscape)");
            var init = function() {
                onResize();

                if (mq && mq.addListener) {
                    mq.addListener(onResize);
                }
            };

            dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

            if (/^[c|i]|d$/.test(document.readyState || "")) {
                init();
            } else {
                document.addEventListener("DOMContentLoaded", init);
            }

            return onResize;
        })());
    }
})(window);

/*! Picturefill - v3.0.1
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt;
 *  License: MIT
 */

(function( window, document, undefined ) {
    // Enable strict mode
    "use strict";

    // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
    document.createElement( "picture" );

    var warn, eminpx, alwaysCheckWDescriptor, evalId;
    // local object for method references and testing exposure
    var pf = {};
    var noop = function() {};
    var image = document.createElement( "img" );
    var getImgAttr = image.getAttribute;
    var setImgAttr = image.setAttribute;
    var removeImgAttr = image.removeAttribute;
    var docElem = document.documentElement;
    var types = {};
    var cfg = {
        //resource selection:
        algorithm: ""
    };
    var srcAttr = "data-pfsrc";
    var srcsetAttr = srcAttr + "set";
    // ua sniffing is done for undetectable img loading features,
    // to do some non crucial perf optimizations
    var ua = navigator.userAgent;
    var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35 );
    var curSrcProp = "currentSrc";
    var regWDesc = /\s+\+?\d+(e\d+)?w/;
    var regSize = /(\([^)]+\))?\s*(.+)/;
    var setOptions = window.picturefillCFG;
    /**
     * Shortcut property for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
     */
    // baseStyle also used by getEmValue (i.e.: width: 1em is important)
    var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
    var fsCss = "font-size:100%!important;";
    var isVwDirty = true;

    var cssCache = {};
    var sizeLengthCache = {};
    var DPR = window.devicePixelRatio;
    var units = {
        px: 1,
        "in": 96
    };
    var anchor = document.createElement( "a" );
    /**
     * alreadyRun flag used for setOptions. is it true setOptions will reevaluate
     * @type {boolean}
     */
    var alreadyRun = false;

    // Reusable, non-"g" Regexes

    // (Don't use \s, to avoid matching non-breaking space.)
    var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
        regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
        regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
        regexTrailingCommas = /[,]+$/,
        regexNonNegativeInteger = /^\d+$/,

        // ( Positive or negative or unsigned integers or decimals, without or without exponents.
        // Must include at least one digit.
        // According to spec tests any decimal point must be followed by a digit.
        // No leading plus sign is allowed.)
        // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
        regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

    var on = function(obj, evt, fn, capture) {
        if ( obj.addEventListener ) {
            obj.addEventListener(evt, fn, capture || false);
        } else if ( obj.attachEvent ) {
            obj.attachEvent( "on" + evt, fn);
        }
    };

    /**
     * simple memoize function:
     */

    var memoize = function(fn) {
        var cache = {};
        return function(input) {
            if ( !(input in cache) ) {
                cache[ input ] = fn(input);
            }
            return cache[ input ];
        };
    };

    // UTILITY FUNCTIONS

    // Manual is faster than RegEx
    // http://jsperf.com/whitespace-character/5
    function isSpace(c) {
        return (c === "\u0020" || // space
                c === "\u0009" || // horizontal tab
                c === "\u000A" || // new line
                c === "\u000C" || // form feed
                c === "\u000D");  // carriage return
    }

    /**
     * gets a mediaquery and returns a boolean or gets a css length and returns a number
     * @param css mediaqueries or css length
     * @returns {boolean|number}
     *
     * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
     */
    var evalCSS = (function() {

        var regLength = /^([\d\.]+)(em|vw|px)$/;
        var replace = function() {
            var args = arguments, index = 0, string = args[0];
            while (++index in args) {
                string = string.replace(args[index], args[++index]);
            }
            return string;
        };

        var buildStr = memoize(function(css) {

            return "return " + replace((css || "").toLowerCase(),
                // interpret `and`
                /\band\b/g, "&&",

                // interpret `,`
                /,/g, "||",

                // interpret `min-` as >=
                /min-([a-z-\s]+):/g, "e.$1>=",

                // interpret `max-` as <=
                /max-([a-z-\s]+):/g, "e.$1<=",

                //calc value
                /calc([^)]+)/g, "($1)",

                // interpret css values
                /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
                //make eval less evil
                /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
            ) + ";";
        });

        return function(css, length) {
            var parsedLength;
            if (!(css in cssCache)) {
                cssCache[css] = false;
                if (length && (parsedLength = css.match( regLength ))) {
                    cssCache[css] = parsedLength[ 1 ] * units[parsedLength[ 2 ]];
                } else {
                    /*jshint evil:true */
                    try{
                        cssCache[css] = new Function("e", buildStr(css))(units);
                    } catch(e) {}
                    /*jshint evil:false */
                }
            }
            return cssCache[css];
        };
    })();

    var setResolution = function( candidate, sizesattr ) {
        if ( candidate.w ) { // h = means height: || descriptor.type === 'h' do not handle yet...
            candidate.cWidth = pf.calcListLength( sizesattr || "100vw" );
            candidate.res = candidate.w / candidate.cWidth ;
        } else {
            candidate.res = candidate.d;
        }
        return candidate;
    };

    /**
     *
     * @param opt
     */
    var picturefill = function( opt ) {
        var elements, i, plen;

        var options = opt || {};

        if ( options.elements && options.elements.nodeType === 1 ) {
            if ( options.elements.nodeName.toUpperCase() === "IMG" ) {
                options.elements =  [ options.elements ];
            } else {
                options.context = options.elements;
                options.elements =  null;
            }
        }

        elements = options.elements || pf.qsa( (options.context || document), ( options.reevaluate || options.reselect ) ? pf.sel : pf.selShort );

        if ( (plen = elements.length) ) {

            pf.setupRun( options );
            alreadyRun = true;

            // Loop through all elements
            for ( i = 0; i < plen; i++ ) {
                pf.fillImg(elements[ i ], options);
            }

            pf.teardownRun( options );
        }
    };

    /**
     * outputs a warning for the developer
     * @param {message}
     * @type {Function}
     */
    warn = ( window.console && console.warn ) ?
        function( message ) {
            console.warn( message );
        } :
        noop
    ;

    if ( !(curSrcProp in image) ) {
        curSrcProp = "src";
    }

    // Add support for standard mime types.
    types[ "image/jpeg" ] = true;
    types[ "image/gif" ] = true;
    types[ "image/png" ] = true;

    function detectTypeSupport( type, typeUri ) {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var image = new window.Image();
        image.onerror = function() {
            types[ type ] = false;
            picturefill();
        };
        image.onload = function() {
            types[ type ] = image.width === 1;
            picturefill();
        };
        image.src = typeUri;
        return "pending";
    }

    // test svg support
    types[ "image/svg+xml" ] = document.implementation.hasFeature( "http://wwwindow.w3.org/TR/SVG11/feature#Image", "1.1" );

    /**
     * updates the internal vW property with the current viewport width in px
     */
    function updateMetrics() {

        isVwDirty = false;
        DPR = window.devicePixelRatio;
        cssCache = {};
        sizeLengthCache = {};

        pf.DPR = DPR || 1;

        units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
        units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

        units.vw = units.width / 100;
        units.vh = units.height / 100;

        evalId = [ units.height, units.width, DPR ].join("-");

        units.em = pf.getEmValue();
        units.rem = units.em;
    }

    function chooseLowRes( lowerValue, higherValue, dprValue, isCached ) {
        var bonusFactor, tooMuch, bonus, meanDensity;

        //experimental
        if (cfg.algorithm === "saveData" ){
            if ( lowerValue > 2.7 ) {
                meanDensity = dprValue + 1;
            } else {
                tooMuch = higherValue - dprValue;
                bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

                bonus = tooMuch * bonusFactor;

                if (isCached) {
                    bonus += 0.1 * bonusFactor;
                }

                meanDensity = lowerValue + bonus;
            }
        } else {
            meanDensity = (dprValue > 1) ?
                Math.sqrt(lowerValue * higherValue) :
                lowerValue;
        }

        return meanDensity > dprValue;
    }

    function applyBestCandidate( img ) {
        var srcSetCandidates;
        var matchingSet = pf.getSet( img );
        var evaluated = false;
        if ( matchingSet !== "pending" ) {
            evaluated = evalId;
            if ( matchingSet ) {
                srcSetCandidates = pf.setRes( matchingSet );
                pf.applySetCandidate( srcSetCandidates, img );
            }
        }
        img[ pf.ns ].evaled = evaluated;
    }

    function ascendingSort( a, b ) {
        return a.res - b.res;
    }

    function setSrcToCur( img, src, set ) {
        var candidate;
        if ( !set && src ) {
            set = img[ pf.ns ].sets;
            set = set && set[set.length - 1];
        }

        candidate = getCandidateForSrc(src, set);

        if ( candidate ) {
            src = pf.makeUrl(src);
            img[ pf.ns ].curSrc = src;
            img[ pf.ns ].curCan = candidate;

            if ( !candidate.res ) {
                setResolution( candidate, candidate.set.sizes );
            }
        }
        return candidate;
    }

    function getCandidateForSrc( src, set ) {
        var i, candidate, candidates;
        if ( src && set ) {
            candidates = pf.parseSet( set );
            src = pf.makeUrl(src);
            for ( i = 0; i < candidates.length; i++ ) {
                if ( src === pf.makeUrl(candidates[ i ].url) ) {
                    candidate = candidates[ i ];
                    break;
                }
            }
        }
        return candidate;
    }

    function getAllSourceElements( picture, candidates ) {
        var i, len, source, srcset;

        // SPEC mismatch intended for size and perf:
        // actually only source elements preceding the img should be used
        // also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector
        var sources = picture.getElementsByTagName( "source" );

        for ( i = 0, len = sources.length; i < len; i++ ) {
            source = sources[ i ];
            source[ pf.ns ] = true;
            srcset = source.getAttribute( "srcset" );

            // if source does not have a srcset attribute, skip
            if ( srcset ) {
                candidates.push( {
                    srcset: srcset,
                    media: source.getAttribute( "media" ),
                    type: source.getAttribute( "type" ),
                    sizes: source.getAttribute( "sizes" )
                } );
            }
        }
    }

    /**
     * Srcset Parser
     * By Alex Bell |  MIT License
     *
     * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
     *
     * Based super duper closely on the reference algorithm at:
     * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
     */

    // 1. Let input be the value passed to this algorithm.
    // (TO-DO : Explain what "set" argument is here. Maybe choose a more
    // descriptive & more searchable name.  Since passing the "set" in really has
    // nothing to do with parsing proper, I would prefer this assignment eventually
    // go in an external fn.)
    function parseSrcset(input, set) {

        function collectCharacters(regEx) {
            var chars,
                match = regEx.exec(input.substring(pos));
            if (match) {
                chars = match[ 0 ];
                pos += chars.length;
                return chars;
            }
        }

        var inputLength = input.length,
            url,
            descriptors,
            currentDescriptor,
            state,
            c,

            // 2. Let position be a pointer into input, initially pointing at the start
            //    of the string.
            pos = 0,

            // 3. Let candidates be an initially empty source set.
            candidates = [];

        /**
        * Adds descriptor properties to a candidate, pushes to the candidates array
        * @return undefined
        */
        // (Declared outside of the while loop so that it's only created once.
        // (This fn is defined before it is used, in order to pass JSHINT.
        // Unfortunately this breaks the sequencing of the spec comments. :/ )
        function parseDescriptors() {

            // 9. Descriptor parser: Let error be no.
            var pError = false,

            // 10. Let width be absent.
            // 11. Let density be absent.
            // 12. Let future-compat-h be absent. (We're implementing it now as h)
                w, d, h, i,
                candidate = {},
                desc, lastChar, value, intVal, floatVal;

            // 13. For each descriptor in descriptors, run the appropriate set of steps
            // from the following list:
            for (i = 0 ; i < descriptors.length; i++) {
                desc = descriptors[ i ];

                lastChar = desc[ desc.length - 1 ];
                value = desc.substring(0, desc.length - 1);
                intVal = parseInt(value, 10);
                floatVal = parseFloat(value);

                // If the descriptor consists of a valid non-negative integer followed by
                // a U+0077 LATIN SMALL LETTER W character
                if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

                    // If width and density are not both absent, then let error be yes.
                    if (w || d) {pError = true;}

                    // Apply the rules for parsing non-negative integers to the descriptor.
                    // If the result is zero, let error be yes.
                    // Otherwise, let width be the result.
                    if (intVal === 0) {pError = true;} else {w = intVal;}

                // If the descriptor consists of a valid floating-point number followed by
                // a U+0078 LATIN SMALL LETTER X character
                } else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

                    // If width, density and future-compat-h are not all absent, then let error
                    // be yes.
                    if (w || d || h) {pError = true;}

                    // Apply the rules for parsing floating-point number values to the descriptor.
                    // If the result is less than zero, let error be yes. Otherwise, let density
                    // be the result.
                    if (floatVal < 0) {pError = true;} else {d = floatVal;}

                // If the descriptor consists of a valid non-negative integer followed by
                // a U+0068 LATIN SMALL LETTER H character
                } else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

                    // If height and density are not both absent, then let error be yes.
                    if (h || d) {pError = true;}

                    // Apply the rules for parsing non-negative integers to the descriptor.
                    // If the result is zero, let error be yes. Otherwise, let future-compat-h
                    // be the result.
                    if (intVal === 0) {pError = true;} else {h = intVal;}

                // Anything else, Let error be yes.
                } else {pError = true;}
            } // (close step 13 for loop)

            // 15. If error is still no, then append a new image source to candidates whose
            // URL is url, associated with a width width if not absent and a pixel
            // density density if not absent. Otherwise, there is a parse error.
            if (!pError) {
                candidate.url = url;

                if (w) { candidate.w = w;}
                if (d) { candidate.d = d;}
                if (h) { candidate.h = h;}
                if (!h && !d && !w) {candidate.d = 1;}
                if (candidate.d === 1) {set.has1x = true;}
                candidate.set = set;

                candidates.push(candidate);
            }
        } // (close parseDescriptors fn)

        /**
        * Tokenizes descriptor properties prior to parsing
        * Returns undefined.
        * (Again, this fn is defined before it is used, in order to pass JSHINT.
        * Unfortunately this breaks the logical sequencing of the spec comments. :/ )
        */
        function tokenize() {

            // 8.1. Descriptor tokeniser: Skip whitespace
            collectCharacters(regexLeadingSpaces);

            // 8.2. Let current descriptor be the empty string.
            currentDescriptor = "";

            // 8.3. Let state be in descriptor.
            state = "in descriptor";

            while (true) {

                // 8.4. Let c be the character at position.
                c = input.charAt(pos);

                //  Do the following depending on the value of state.
                //  For the purpose of this step, "EOF" is a special character representing
                //  that position is past the end of input.

                // In descriptor
                if (state === "in descriptor") {
                    // Do the following, depending on the value of c:

                  // Space character
                  // If current descriptor is not empty, append current descriptor to
                  // descriptors and let current descriptor be the empty string.
                  // Set state to after descriptor.
                    if (isSpace(c)) {
                        if (currentDescriptor) {
                            descriptors.push(currentDescriptor);
                            currentDescriptor = "";
                            state = "after descriptor";
                        }

                    // U+002C COMMA (,)
                    // Advance position to the next character in input. If current descriptor
                    // is not empty, append current descriptor to descriptors. Jump to the step
                    // labeled descriptor parser.
                    } else if (c === ",") {
                        pos += 1;
                        if (currentDescriptor) {
                            descriptors.push(currentDescriptor);
                        }
                        parseDescriptors();
                        return;

                    // U+0028 LEFT PARENTHESIS (()
                    // Append c to current descriptor. Set state to in parens.
                    } else if (c === "\u0028") {
                        currentDescriptor = currentDescriptor + c;
                        state = "in parens";

                    // EOF
                    // If current descriptor is not empty, append current descriptor to
                    // descriptors. Jump to the step labeled descriptor parser.
                    } else if (c === "") {
                        if (currentDescriptor) {
                            descriptors.push(currentDescriptor);
                        }
                        parseDescriptors();
                        return;

                    // Anything else
                    // Append c to current descriptor.
                    } else {
                        currentDescriptor = currentDescriptor + c;
                    }
                // (end "in descriptor"

                // In parens
                } else if (state === "in parens") {

                    // U+0029 RIGHT PARENTHESIS ())
                    // Append c to current descriptor. Set state to in descriptor.
                    if (c === ")") {
                        currentDescriptor = currentDescriptor + c;
                        state = "in descriptor";

                    // EOF
                    // Append current descriptor to descriptors. Jump to the step labeled
                    // descriptor parser.
                    } else if (c === "") {
                        descriptors.push(currentDescriptor);
                        parseDescriptors();
                        return;

                    // Anything else
                    // Append c to current descriptor.
                    } else {
                        currentDescriptor = currentDescriptor + c;
                    }

                // After descriptor
                } else if (state === "after descriptor") {

                    // Do the following, depending on the value of c:
                    // Space character: Stay in this state.
                    if (isSpace(c)) {

                    // EOF: Jump to the step labeled descriptor parser.
                    } else if (c === "") {
                        parseDescriptors();
                        return;

                    // Anything else
                    // Set state to in descriptor. Set position to the previous character in input.
                    } else {
                        state = "in descriptor";
                        pos -= 1;

                    }
                }

                // Advance position to the next character in input.
                pos += 1;

            // Repeat this step.
            } // (close while true loop)
        }

        // 4. Splitting loop: Collect a sequence of characters that are space
        //    characters or U+002C COMMA characters. If any U+002C COMMA characters
        //    were collected, that is a parse error.
        while (true) {
            collectCharacters(regexLeadingCommasOrSpaces);

            // 5. If position is past the end of input, return candidates and abort these steps.
            if (pos >= inputLength) {
                return candidates; // (we're done, this is the sole return path)
            }

            // 6. Collect a sequence of characters that are not space characters,
            //    and let that be url.
            url = collectCharacters(regexLeadingNotSpaces);

            // 7. Let descriptors be a new empty list.
            descriptors = [];

            // 8. If url ends with a U+002C COMMA character (,), follow these substeps:
            //      (1). Remove all trailing U+002C COMMA characters from url. If this removed
            //         more than one character, that is a parse error.
            if (url.slice(-1) === ",") {
                url = url.replace(regexTrailingCommas, "");
                // (Jump ahead to step 9 to skip tokenization and just push the candidate).
                parseDescriptors();

            //  Otherwise, follow these substeps:
            } else {
                tokenize();
            } // (close else of step 8)

        // 16. Return to the step labeled splitting loop.
        } // (Close of big while loop.)
    }

    /*
     * Sizes Parser
     *
     * By Alex Bell |  MIT License
     *
     * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
     *
     * Reference algorithm at:
     * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
     *
     * Most comments are copied in directly from the spec
     * (except for comments in parens).
     *
     * Grammar is:
     * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
     * <source-size> = <media-condition> <source-size-value>
     * <source-size-value> = <length>
     * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
     *
     * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
     * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
     *
     * Returns the first valid <css-length> with a media condition that evaluates to true,
     * or "100vw" if all valid media conditions evaluate to false.
     *
     */

    function parseSizes(strValue) {

        // (Percentage CSS lengths are not allowed in this case, to avoid confusion:
        // https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
        // CSS allows a single optional plus or minus sign:
        // http://www.w3.org/TR/CSS2/syndata.html#numbers
        // CSS is ASCII case-insensitive:
        // http://www.w3.org/TR/CSS2/syndata.html#characters )
        // Spec allows exponential notation for <number> type:
        // http://dev.w3.org/csswg/css-values/#numbers
        var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

        // (This is a quick and lenient test. Because of optional unlimited-depth internal
        // grouping parens and strict spacing rules, this could get very complicated.)
        var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

        var i;
        var unparsedSizesList;
        var unparsedSizesListLength;
        var unparsedSize;
        var lastComponentValue;
        var size;

        // UTILITY FUNCTIONS

        //  (Toy CSS parser. The goals here are:
        //  1) expansive test coverage without the weight of a full CSS parser.
        //  2) Avoiding regex wherever convenient.
        //  Quick tests: http://jsfiddle.net/gtntL4gr/3/
        //  Returns an array of arrays.)
        function parseComponentValues(str) {
            var chrctr;
            var component = "";
            var componentArray = [];
            var listArray = [];
            var parenDepth = 0;
            var pos = 0;
            var inComment = false;

            function pushComponent() {
                if (component) {
                    componentArray.push(component);
                    component = "";
                }
            }

            function pushComponentArray() {
                if (componentArray[0]) {
                    listArray.push(componentArray);
                    componentArray = [];
                }
            }

            // (Loop forwards from the beginning of the string.)
            while (true) {
                chrctr = str.charAt(pos);

                if (chrctr === "") { // ( End of string reached.)
                    pushComponent();
                    pushComponentArray();
                    return listArray;
                } else if (inComment) {
                    if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
                        inComment = false;
                        pos += 2;
                        pushComponent();
                        continue;
                    } else {
                        pos += 1; // (Skip all characters inside comments.)
                        continue;
                    }
                } else if (isSpace(chrctr)) {
                    // (If previous character in loop was also a space, or if
                    // at the beginning of the string, do not add space char to
                    // component.)
                    if ( (str.charAt(pos - 1) && isSpace( str.charAt(pos - 1) ) ) || !component ) {
                        pos += 1;
                        continue;
                    } else if (parenDepth === 0) {
                        pushComponent();
                        pos +=1;
                        continue;
                    } else {
                        // (Replace any space character with a plain space for legibility.)
                        chrctr = " ";
                    }
                } else if (chrctr === "(") {
                    parenDepth += 1;
                } else if (chrctr === ")") {
                    parenDepth -= 1;
                } else if (chrctr === ",") {
                    pushComponent();
                    pushComponentArray();
                    pos += 1;
                    continue;
                } else if ( (chrctr === "/") && (str.charAt(pos + 1) === "*") ) {
                    inComment = true;
                    pos += 2;
                    continue;
                }

                component = component + chrctr;
                pos += 1;
            }
        }

        function isValidNonNegativeSourceSizeValue(s) {
            if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) {return true;}
            if (regexCssCalc.test(s)) {return true;}
            // ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
            // "-0 is equivalent to 0 and is not a negative number." which means that
            // unitless zero and unitless negative zero must be accepted as special cases.)
            if ((s === "0") || (s === "-0") || (s === "+0")) {return true;}
            return false;
        }

        // When asked to parse a sizes attribute from an element, parse a
        // comma-separated list of component values from the value of the element's
        // sizes attribute (or the empty string, if the attribute is absent), and let
        // unparsed sizes list be the result.
        // http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values

        unparsedSizesList = parseComponentValues(strValue);
        unparsedSizesListLength = unparsedSizesList.length;

        // For each unparsed size in unparsed sizes list:
        for (i = 0; i < unparsedSizesListLength; i++) {
            unparsedSize = unparsedSizesList[i];

            // 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
            // ( parseComponentValues() already omits spaces outside of parens. )

            // If unparsed size is now empty, that is a parse error; continue to the next
            // iteration of this algorithm.
            // ( parseComponentValues() won't push an empty array. )

            // 2. If the last component value in unparsed size is a valid non-negative
            // <source-size-value>, let size be its value and remove the component value
            // from unparsed size. Any CSS function other than the calc() function is
            // invalid. Otherwise, there is a parse error; continue to the next iteration
            // of this algorithm.
            // http://dev.w3.org/csswg/css-syntax/#parse-component-value
            lastComponentValue = unparsedSize[unparsedSize.length - 1];

            if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
                size = lastComponentValue;
                unparsedSize.pop();
            } else {
                continue;
            }

            // 3. Remove all consecutive <whitespace-token>s from the end of unparsed
            // size. If unparsed size is now empty, return size and exit this algorithm.
            // If this was not the last item in unparsed sizes list, that is a parse error.
            if (unparsedSize.length === 0) {
                return size;
            }

            // 4. Parse the remaining component values in unparsed size as a
            // <media-condition>. If it does not parse correctly, or it does parse
            // correctly but the <media-condition> evaluates to false, continue to the
            // next iteration of this algorithm.
            // (Parsing all possible compound media conditions in JS is heavy, complicated,
            // and the payoff is unclear. Is there ever an situation where the
            // media condition parses incorrectly but still somehow evaluates to true?
            // Can we just rely on the browser/polyfill to do it?)
            unparsedSize = unparsedSize.join(" ");
            if (!(pf.matchesMedia( unparsedSize ) ) ) {
                continue;
            }

            // 5. Return size and exit this algorithm.
            return size;
        }

        // If the above algorithm exhausts unparsed sizes list without returning a
        // size value, return 100vw.
        return "100vw";
    }

    // namespace
    pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

    // srcset support test
    pf.supSrcset = "srcset" in image;
    pf.supSizes = "sizes" in image;
    pf.supPicture = !!window.HTMLPictureElement;

    if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
        (function(image2) {
            image.srcset = "data:,a";
            image2.src = "data:,a";
            pf.supSrcset = image.complete === image2.complete;
            pf.supPicture = pf.supSrcset && pf.supPicture;
        })(document.createElement("img"));
    }

    // using pf.qsa instead of dom traversing does scale much better,
    // especially on sites mixing responsive and non-responsive images
    pf.selShort = "picture>img,img[srcset]";
    pf.sel = pf.selShort;
    pf.cfg = cfg;

    if ( pf.supSrcset ) {
        pf.sel += ",img[" + srcsetAttr + "]";
    }

    /**
     * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
     */
    pf.DPR = (DPR  || 1 );
    pf.u = units;

    // container of supported mime types that one might need to qualify before using
    pf.types =  types;

    alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

    pf.setSize = noop;

    /**
     * Gets a string and returns the absolute URL
     * @param src
     * @returns {String} absolute URL
     */

    pf.makeUrl = memoize(function(src) {
        anchor.href = src;
        return anchor.href;
    });

    /**
     * Gets a DOM element or document and a selctor and returns the found matches
     * Can be extended with jQuery/Sizzle for IE7 support
     * @param context
     * @param sel
     * @returns {NodeList}
     */
    pf.qsa = function(context, sel) {
        return context.querySelectorAll(sel);
    };

    /**
     * Shortcut method for matchMedia ( for easy overriding in tests )
     * wether native or pf.mMQ is used will be decided lazy on first call
     * @returns {boolean}
     */
    pf.matchesMedia = function() {
        if ( window.matchMedia && (matchMedia( "(min-width: 0.1em)" ) || {}).matches ) {
            pf.matchesMedia = function( media ) {
                return !media || ( matchMedia( media ).matches );
            };
        } else {
            pf.matchesMedia = pf.mMQ;
        }

        return pf.matchesMedia.apply( this, arguments );
    };

    /**
     * A simplified matchMedia implementation for IE8 and IE9
     * handles only min-width/max-width with px or em values
     * @param media
     * @returns {boolean}
     */
    pf.mMQ = function( media ) {
        return media ? evalCSS(media) : true;
    };

    /**
     * Returns the calculated length in css pixel from the given sourceSizeValue
     * http://dev.w3.org/csswg/css-values-3/#length-value
     * intended Spec mismatches:
     * * Does not check for invalid use of CSS functions
     * * Does handle a computed length of 0 the same as a negative and therefore invalid value
     * @param sourceSizeValue
     * @returns {Number}
     */
    pf.calcLength = function( sourceSizeValue ) {

        var value = evalCSS(sourceSizeValue, true) || false;
        if (value < 0) {
            value = false;
        }

        return value;
    };

    /**
     * Takes a type string and checks if its supported
     */

    pf.supportsType = function( type ) {
        return ( type ) ? types[ type ] : true;
    };

    /**
     * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
     * @param sourceSizeStr
     * @returns {*}
     */
    pf.parseSize = memoize(function( sourceSizeStr ) {
        var match = ( sourceSizeStr || "" ).match(regSize);
        return {
            media: match && match[1],
            length: match && match[2]
        };
    });

    pf.parseSet = function( set ) {
        if ( !set.cands ) {
            set.cands = parseSrcset(set.srcset, set);
        }
        return set.cands;
    };

    /**
     * returns 1em in css px for html/body default size
     * function taken from respondjs
     * @returns {*|number}
     */
    pf.getEmValue = function() {
        var body;
        if ( !eminpx && (body = document.body) ) {
            var div = document.createElement( "div" ),
                originalHTMLCSS = docElem.style.cssText,
                originalBodyCSS = body.style.cssText;

            div.style.cssText = baseStyle;

            // 1em in a media query is the value of the default font size of the browser
            // reset docElem and body to ensure the correct value is returned
            docElem.style.cssText = fsCss;
            body.style.cssText = fsCss;

            body.appendChild( div );
            eminpx = div.offsetWidth;
            body.removeChild( div );

            //also update eminpx before returning
            eminpx = parseFloat( eminpx, 10 );

            // restore the original values
            docElem.style.cssText = originalHTMLCSS;
            body.style.cssText = originalBodyCSS;

        }
        return eminpx || 16;
    };

    /**
     * Takes a string of sizes and returns the width in pixels as a number
     */
    pf.calcListLength = function( sourceSizeListStr ) {
        // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
        //
        //                           or (min-width:30em) calc(30% - 15px)
        if ( !(sourceSizeListStr in sizeLengthCache) || cfg.uT ) {
            var winningLength = pf.calcLength( parseSizes( sourceSizeListStr ) );

            sizeLengthCache[ sourceSizeListStr ] = !winningLength ? units.width : winningLength;
        }

        return sizeLengthCache[ sourceSizeListStr ];
    };

    /**
     * Takes a candidate object with a srcset property in the form of url/
     * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
     *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
     *     "images/pic-small.png"
     * Get an array of image candidates in the form of
     *      {url: "/foo/bar.png", resolution: 1}
     * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
     * If sizes is specified, res is calculated
     */
    pf.setRes = function( set ) {
        var candidates;
        if ( set ) {

            candidates = pf.parseSet( set );

            for ( var i = 0, len = candidates.length; i < len; i++ ) {
                setResolution( candidates[ i ], set.sizes );
            }
        }
        return candidates;
    };

    pf.setRes.res = setResolution;

    pf.applySetCandidate = function( candidates, img ) {
        if ( !candidates.length ) {return;}
        var candidate,
            i,
            j,
            length,
            bestCandidate,
            curSrc,
            curCan,
            candidateSrc,
            abortCurSrc;

        var imageData = img[ pf.ns ];
        var dpr = pf.DPR;

        curSrc = imageData.curSrc || img[curSrcProp];

        curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

        // if we have a current source, we might either become lazy or give this source some advantage
        if ( curCan && curCan.set === candidates[ 0 ].set ) {

            // if browser can abort image request and the image has a higher pixel density than needed
            // and this image isn't downloaded yet, we skip next part and try to save bandwidth
            abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

            if ( !abortCurSrc ) {
                curCan.cached = true;

                // if current candidate is "best", "better" or "okay",
                // set it to bestCandidate
                if ( curCan.res >= dpr ) {
                    bestCandidate = curCan;
                }
            }
        }

        if ( !bestCandidate ) {

            candidates.sort( ascendingSort );

            length = candidates.length;
            bestCandidate = candidates[ length - 1 ];

            for ( i = 0; i < length; i++ ) {
                candidate = candidates[ i ];
                if ( candidate.res >= dpr ) {
                    j = i - 1;

                    // we have found the perfect candidate,
                    // but let's improve this a little bit with some assumptions ;-)
                    if (candidates[ j ] &&
                        (abortCurSrc || curSrc !== pf.makeUrl( candidate.url )) &&
                        chooseLowRes(candidates[ j ].res, candidate.res, dpr, candidates[ j ].cached)) {

                        bestCandidate = candidates[ j ];

                    } else {
                        bestCandidate = candidate;
                    }
                    break;
                }
            }
        }

        if ( bestCandidate ) {

            candidateSrc = pf.makeUrl( bestCandidate.url );

            imageData.curSrc = candidateSrc;
            imageData.curCan = bestCandidate;

            if ( candidateSrc !== curSrc ) {
                pf.setSrc( img, bestCandidate );
            }
            pf.setSize( img );
        }
    };

    pf.setSrc = function( img, bestCandidate ) {
        var origWidth;
        img.src = bestCandidate.url;

        // although this is a specific Safari issue, we don't want to take too much different code paths
        if ( bestCandidate.set.type === "image/svg+xml" ) {
            origWidth = img.style.width;
            img.style.width = (img.offsetWidth + 1) + "px";

            // next line only should trigger a repaint
            // if... is only done to trick dead code removal
            if ( img.offsetWidth + 1 ) {
                img.style.width = origWidth;
            }
        }
    };

    pf.getSet = function( img ) {
        var i, set, supportsType;
        var match = false;
        var sets = img [ pf.ns ].sets;

        for ( i = 0; i < sets.length && !match; i++ ) {
            set = sets[i];

            if ( !set.srcset || !pf.matchesMedia( set.media ) || !(supportsType = pf.supportsType( set.type )) ) {
                continue;
            }

            if ( supportsType === "pending" ) {
                set = supportsType;
            }

            match = set;
            break;
        }

        return match;
    };

    pf.parseSets = function( element, parent, options ) {
        var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

        var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
        var imageData = element[ pf.ns ];

        if ( imageData.src === undefined || options.src ) {
            imageData.src = getImgAttr.call( element, "src" );
            if ( imageData.src ) {
                setImgAttr.call( element, srcAttr, imageData.src );
            } else {
                removeImgAttr.call( element, srcAttr );
            }
        }

        if ( imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset ) {
            srcsetAttribute = getImgAttr.call( element, "srcset" );
            imageData.srcset = srcsetAttribute;
            srcsetParsed = true;
        }

        imageData.sets = [];

        if ( hasPicture ) {
            imageData.pic = true;
            getAllSourceElements( parent, imageData.sets );
        }

        if ( imageData.srcset ) {
            imageSet = {
                srcset: imageData.srcset,
                sizes: getImgAttr.call( element, "sizes" )
            };

            imageData.sets.push( imageSet );

            isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

            // add normal src as candidate, if source has no w descriptor
            if ( !isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x ) {
                imageSet.srcset += ", " + imageData.src;
                imageSet.cands.push({
                    url: imageData.src,
                    d: 1,
                    set: imageSet
                });
            }

        } else if ( imageData.src ) {
            imageData.sets.push( {
                srcset: imageData.src,
                sizes: null
            } );
        }

        imageData.curCan = null;
        imageData.curSrc = undefined;

        // if img has picture or the srcset was removed or has a srcset and does not support srcset at all
        // or has a w descriptor (and does not support sizes) set support to false to evaluate
        imageData.supported = !( hasPicture || ( imageSet && !pf.supSrcset ) || isWDescripor );

        if ( srcsetParsed && pf.supSrcset && !imageData.supported ) {
            if ( srcsetAttribute ) {
                setImgAttr.call( element, srcsetAttr, srcsetAttribute );
                element.srcset = "";
            } else {
                removeImgAttr.call( element, srcsetAttr );
            }
        }

        if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) ||  element.src !== pf.makeUrl(imageData.src))) {
            if (imageData.src === null) {
                element.removeAttribute("src");
            } else {
                element.src = imageData.src;
            }
        }

        imageData.parsed = true;
    };

    pf.fillImg = function(element, options) {
        var imageData;
        var extreme = options.reselect || options.reevaluate;

        // expando for caching data on the img
        if ( !element[ pf.ns ] ) {
            element[ pf.ns ] = {};
        }

        imageData = element[ pf.ns ];

        // if the element has already been evaluated, skip it
        // unless `options.reevaluate` is set to true ( this, for example,
        // is set to true when running `picturefill` on `resize` ).
        if ( !extreme && imageData.evaled === evalId ) {
            return;
        }

        if ( !imageData.parsed || options.reevaluate ) {
            pf.parseSets( element, element.parentNode, options );
        }

        if ( !imageData.supported ) {
            applyBestCandidate( element );
        } else {
            imageData.evaled = evalId;
        }
    };

    pf.setupRun = function() {
        if ( !alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio) ) {
            updateMetrics();
        }
    };

    // If picture is supported, well, that's awesome.
    if ( pf.supPicture ) {
        picturefill = noop;
        pf.fillImg = noop;
    } else {

         // Set up picture polyfill by polling the document
        (function() {
            var isDomReady;
            var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

            var run = function() {
                var readyState = document.readyState || "";

                timerId = setTimeout(run, readyState === "loading" ? 200 :  999);
                if ( document.body ) {
                    pf.fillImgs();
                    isDomReady = isDomReady || regReady.test(readyState);
                    if ( isDomReady ) {
                        clearTimeout( timerId );
                    }

                }
            };

            var timerId = setTimeout(run, document.body ? 9 : 99);

            // Also attach picturefill on resize and readystatechange
            // http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
            var debounce = function(func, wait) {
                var timeout, timestamp;
                var later = function() {
                    var last = (new Date()) - timestamp;

                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        func();
                    }
                };

                return function() {
                    timestamp = new Date();

                    if (!timeout) {
                        timeout = setTimeout(later, wait);
                    }
                };
            };
            var lastClientWidth = docElem.clientHeight;
            var onResize = function() {
                isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
                lastClientWidth = docElem.clientHeight;
                if ( isVwDirty ) {
                    pf.fillImgs();
                }
            };

            on( window, "resize", debounce(onResize, 99 ) );
            on( document, "readystatechange", run );
        })();
    }

    pf.picturefill = picturefill;
    //use this internally for easy monkey patching/performance testing
    pf.fillImgs = picturefill;
    pf.teardownRun = noop;

    /* expose methods for testing */
    picturefill._ = pf;

    window.picturefillCFG = {
        pf: pf,
        push: function(args) {
            var name = args.shift();
            if (typeof pf[name] === "function") {
                pf[name].apply(pf, args);
            } else {
                cfg[name] = args[0];
                if (alreadyRun) {
                    pf.fillImgs( { reselect: true } );
                }
            }
        }
    };

    while (setOptions && setOptions.length) {
        window.picturefillCFG.push(setOptions.shift());
    }

    /* expose picturefill */
    window.picturefill = picturefill;

    /* expose picturefill */
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // CommonJS, just export
        module.exports = picturefill;
    } else if ( typeof define === "function" && define.amd ) {
        // AMD support
        define( "picturefill", function() { return picturefill; } );
    }

    // IE8 evals this sync, so it must be the last thing we do
    if ( !pf.supPicture ) {
        types[ "image/webp" ] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==" );
    }

} )( window, document );

/**
 * LAZY SIZES
 * @description Lazy loading for images, scripts and iframes
 * @see https://github.com/aFarkas/lazysizes
 */

(function(window, factory) {
    var lazySizes = factory(window, window.document);
    window.lazySizes = lazySizes;
    if(typeof module == 'object' && module.exports){
        module.exports = lazySizes;
    } else if (typeof define == 'function' && define.amd) {
        define(lazySizes);
    }
}(window, function(window, document) {
    'use strict';
    /*jshint eqnull:true */
    if(!document.getElementsByClassName){return;}

    var lazySizesConfig;

    var docElem = document.documentElement;

    var supportPicture = window.HTMLPictureElement && ('sizes' in document.createElement('img'));

    var _addEventListener = 'addEventListener';

    var addEventListener = window[_addEventListener];

    var setTimeout = window.setTimeout;

    var rAF = window.requestAnimationFrame || setTimeout;

    var regPicture = /^picture$/i;

    var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

    var regClassCache = {};

    var forEach = Array.prototype.forEach;

    var hasClass = function(ele, cls) {
        if(!regClassCache[cls]){
            regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        }
        return regClassCache[cls].test(ele.className) && regClassCache[cls];
    };

    var addClass = function(ele, cls) {
        if (!hasClass(ele, cls)){
            ele.className = ele.className.trim() + ' ' + cls;
        }
    };

    var removeClass = function(ele, cls) {
        var reg;
        if ((reg = hasClass(ele,cls))) {
            ele.className = ele.className.replace(reg, ' ');
        }
    };

    var addRemoveLoadEvents = function(dom, fn, add){
        var action = add ? _addEventListener : 'removeEventListener';
        if(add){
            addRemoveLoadEvents(dom, fn);
        }
        loadEvents.forEach(function(evt){
            dom[action](evt, fn);
        });
    };

    var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
        var event = document.createEvent('CustomEvent');

        event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

        elem.dispatchEvent(event);
        return event;
    };

    var updatePolyfill = function (el, full){
        var polyfill;
        if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
            polyfill({reevaluate: true, elements: [el]});
        } else if(full && full.src){
            el.src = full.src;
        }
    };

    var getCSS = function (elem, style){
        return (getComputedStyle(elem, null) || {})[style];
    };

    var getWidth = function(elem, parent, width){
        width = width || elem.offsetWidth;

        while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
            width =  parent.offsetWidth;
            parent = parent.parentNode;
        }

        return width;
    };

    var throttle = function(fn){
        var running;
        var lastTime = 0;
        var Date = window.Date;
        var run = function(){
            running = false;
            lastTime = Date.now();
            fn();
        };
        var afterAF = function(){
            setTimeout(run);
        };
        var getAF = function(){
            rAF(afterAF);
        };

        return function(){
            if(running){
                return;
            }
            var delay = 125 - (Date.now() - lastTime);

            running =  true;

            if(delay < 6){
                delay = 6;
            }
            setTimeout(getAF, delay);
        };
    };

    /*
    var throttle = function(fn){
        var running;
        var lastTime = 0;
        var Date = window.Date;
        var requestIdleCallback = window.requestIdleCallback;
        var gDelay = 125;
        var dTimeout = 999;
        var timeout = dTimeout;
        var run = function(){
            running = false;
            lastTime = Date.now();
            fn();
        };
        var afterAF = function(){
            setImmediate(run);
        };
        var getAF = function(){
            rAF(afterAF);
        };

        if(requestIdleCallback){
            gDelay = 99;
            getAF = function(){
                requestIdleCallback(run, timeout);
                if(timeout !== dTimeout){
                    timeout = dTimeout;
                }
            };
        }

        return function(isPriority){

            if((isPriority = isPriority === true)){
                timeout = 40;
            }

            if(running){
                return;
            }
            var delay = gDelay - (Date.now() - lastTime);

            running =  true;

            if(isPriority || delay < 0){
                getAF();
            } else {
                setTimeout(getAF, delay);
            }
        };
    };
    */

    var loader = (function(){
        var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

        var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

        var defaultExpand, preloadExpand;

        var regImg = /^img$/i;
        var regIframe = /^iframe$/i;

        var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

        var shrinkExpand = 0;
        var currentExpand = 0;

        var isLoading = 0;
        var lowRuns = 0;

        var resetPreloading = function(e){
            isLoading--;
            if(e && e.target){
                addRemoveLoadEvents(e.target, resetPreloading);
            }

            if(!e || isLoading < 0 || !e.target){
                isLoading = 0;
            }
        };

        var isNestedVisible = function(elem, elemExpand){
            var outerRect;
            var parent = elem;
            var visible = getCSS(elem, 'visibility') != 'hidden';

            eLtop -= elemExpand;
            eLbottom += elemExpand;
            eLleft -= elemExpand;
            eLright += elemExpand;

            while(visible && (parent = parent.offsetParent)){
                visible = ((getCSS(parent, 'opacity') || 1) > 0);

                if(visible && getCSS(parent, 'overflow') != 'visible'){
                    outerRect = parent.getBoundingClientRect();
                    visible = eLright > outerRect.left &&
                    eLleft < outerRect.right &&
                    eLbottom > outerRect.top - 1 &&
                    eLtop < outerRect.bottom + 1
                    ;
                }
            }

            return visible;
        };

        var checkElements = function() {
            var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

            if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

                i = 0;

                lowRuns++;

                if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 3 && loadMode > 2){
                    currentExpand = preloadExpand;
                    lowRuns = 0;
                } else if(loadMode > 1 && lowRuns > 2 && isLoading < 6){
                    currentExpand = defaultExpand;
                } else {
                    currentExpand = shrinkExpand;
                }

                for(; i < eLlen; i++){

                    if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

                    if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

                    if(!(elemExpandVal = lazyloadElems[i].getAttribute('data-expand')) || !(elemExpand = elemExpandVal * 1)){
                        elemExpand = currentExpand;
                    }

                    if(beforeExpandVal !== elemExpand){
                        eLvW = innerWidth + elemExpand;
                        elvH = innerHeight + elemExpand;
                        elemNegativeExpand = elemExpand * -1;
                        beforeExpandVal = elemExpand;
                    }

                    rect = lazyloadElems[i].getBoundingClientRect();

                    if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
                        (eLtop = rect.top) <= elvH &&
                        (eLright = rect.right) >= elemNegativeExpand &&
                        (eLleft = rect.left) <= eLvW &&
                        (eLbottom || eLright || eLleft || eLtop) &&
                        ((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
                        unveilElement(lazyloadElems[i]);
                        loadedSomething = true;
                        if(isLoading > 9){break;}
                        if(isLoading > 6){currentExpand = shrinkExpand;}
                    } else if(!loadedSomething && isCompleted && !autoLoadElem &&
                        isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
                        (preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
                        (preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i].getAttribute(lazySizesConfig.sizesAttr) != 'auto')))){
                        autoLoadElem = preloadElems[0] || lazyloadElems[i];
                    }
                }

                if(autoLoadElem && !loadedSomething){
                    unveilElement(autoLoadElem);
                }
            }
        };

        var throttledCheckElements = throttle(checkElements);

        var switchLoadingClass = function(e){
            addClass(e.target, lazySizesConfig.loadedClass);
            removeClass(e.target, lazySizesConfig.loadingClass);
            addRemoveLoadEvents(e.target, switchLoadingClass);
        };

        var changeIframeSrc = function(elem, src){
            try {
                elem.contentWindow.location.replace(src);
            } catch(e){
                elem.src = src;
            }
        };

        var handleSources = function(source){
            var customMedia, parent;

            var sourceSrcset = source.getAttribute(lazySizesConfig.srcsetAttr);

            if( (customMedia = lazySizesConfig.customMedia[source.getAttribute('data-media') || source.getAttribute('media')]) ){
                source.setAttribute('media', customMedia);
            }

            if(sourceSrcset){
                source.setAttribute('srcset', sourceSrcset);
            }

            if(customMedia){
                parent = source.parentNode;
                parent.insertBefore(source.cloneNode(), source);
                parent.removeChild(source);
            }
        };

        var rafBatch = (function(){
            var isRunning;
            var batch = [];
            var runBatch = function(){
                while(batch.length){
                    (batch.shift())();
                }
                isRunning = false;
            };
            return function(fn){
                batch.push(fn);
                if(!isRunning){
                    isRunning = true;
                    rAF(runBatch);
                }
            };
        })();

        var unveilElement = function (elem){
            var src, srcset, parent, isPicture, event, firesLoad, width;

            var isImg = regImg.test(elem.nodeName);

            //allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
            var sizes = isImg && (elem.getAttribute(lazySizesConfig.sizesAttr) || elem.getAttribute('sizes'));
            var isAuto = sizes == 'auto';

            if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

            if(isAuto){
                width = elem.offsetWidth;
            }

            elem._lazyRace = true;
            isLoading++;

            rafBatch(function lazyUnveil(){
                if(elem._lazyRace){
                    delete elem._lazyRace;
                }

                removeClass(elem, lazySizesConfig.lazyClass);

                if(!(event = triggerEvent(elem, 'lazybeforeunveil')).defaultPrevented){

                    if(sizes){
                        if(isAuto){
                            addClass(elem, lazySizesConfig.autosizesClass);
                            autoSizer.updateElem(elem, true, width);
                        } else {
                            elem.setAttribute('sizes', sizes);
                        }
                    }

                    srcset = elem.getAttribute(lazySizesConfig.srcsetAttr);
                    src = elem.getAttribute(lazySizesConfig.srcAttr);

                    if(isImg) {
                        parent = elem.parentNode;
                        isPicture = parent && regPicture.test(parent.nodeName || '');
                    }

                    firesLoad = event.detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

                    event = {target: elem};

                    if(firesLoad){
                        addRemoveLoadEvents(elem, resetPreloading, true);
                        clearTimeout(resetPreloadingTimer);
                        resetPreloadingTimer = setTimeout(resetPreloading, 2500);

                        addClass(elem, lazySizesConfig.loadingClass);
                        addRemoveLoadEvents(elem, switchLoadingClass, true);
                    }

                    if(isPicture){
                        forEach.call(parent.getElementsByTagName('source'), handleSources);
                    }

                    if(srcset){
                        elem.setAttribute('srcset', srcset);
                    } else if(src && !isPicture){
                        if(regIframe.test(elem.nodeName)){
                            changeIframeSrc(elem, src);
                        } else {
                            elem.src = src;
                        }
                    }

                    if(srcset || isPicture){
                        updatePolyfill(elem, {src: src});
                    }
                }

                if( !firesLoad || elem.complete ){
                    if(firesLoad){
                        resetPreloading(event);
                    } else {
                        isLoading--;
                    }
                    switchLoadingClass(event);
                }
            });
        };

        var onload = function(){
            if(isCompleted){return;}
            if(Date.now() - started < 999){
                setTimeout(onload, 999);
                return;
            }
            var scrollTimer;
            var afterScroll = function(){
                lazySizesConfig.loadMode = 3;
                throttledCheckElements();
            };

            isCompleted = true;

            lazySizesConfig.loadMode = 3;

            if(!isLoading){
                throttledCheckElements();
            }

            addEventListener('scroll', function(){
                if(lazySizesConfig.loadMode == 3){
                    lazySizesConfig.loadMode = 2;
                }
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(afterScroll, 99);
            }, true);
        };

        /*
        var onload = function(){
            var scrollTimer, timestamp;
            var wait = 99;
            var afterScroll = function(){
                var last = (Date.now()) - timestamp;

                // if the latest call was less that the wait period ago
                // then we reset the timeout to wait for the difference
                if (last < wait) {
                    scrollTimer = setTimeout(afterScroll, wait - last);

                    // or if not we can null out the timer and run the latest
                } else {
                    scrollTimer = null;
                    lazySizesConfig.loadMode = 3;
                    throttledCheckElements();
                }
            };

            isCompleted = true;
            lowRuns += 8;

            lazySizesConfig.loadMode = 3;

            addEventListener('scroll', function(){
                timestamp = Date.now();
                if(!scrollTimer){
                    lazySizesConfig.loadMode = 2;
                    scrollTimer = setTimeout(afterScroll, wait);
                }
            }, true);
        };
        */

        return {
            _: function(){
                started = Date.now();

                lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
                preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);

                defaultExpand = lazySizesConfig.expand;
                preloadExpand = defaultExpand * lazySizesConfig.expFactor;

                addEventListener('scroll', throttledCheckElements, true);

                addEventListener('resize', throttledCheckElements, true);

                if(window.MutationObserver){
                    new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
                } else {
                    docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
                    docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
                    setInterval(throttledCheckElements, 999);
                }

                addEventListener('hashchange', throttledCheckElements, true);

                //, 'fullscreenchange'
                ['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
                    document[_addEventListener](name, throttledCheckElements, true);
                });

                if((/d$|^c/.test(document.readyState))){
                    onload();
                } else {
                    addEventListener('load', onload);
                    document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
                    setTimeout(onload, 20000);
                }

                throttledCheckElements(lazyloadElems.length > 0);
            },
            checkElems: throttledCheckElements,
            unveil: unveilElement
        };
    })();


    var autoSizer = (function(){
        var autosizesElems;

        var sizeElement = function (elem, dataAttr, width){
            var sources, i, len, event;
            var parent = elem.parentNode;

            if(parent){
                width = getWidth(elem, parent, width);
                event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

                if(!event.defaultPrevented){
                    width = event.detail.width;

                    if(width && width !== elem._lazysizesWidth){
                        elem._lazysizesWidth = width;
                        width += 'px';
                        elem.setAttribute('sizes', width);

                        if(regPicture.test(parent.nodeName || '')){
                            sources = parent.getElementsByTagName('source');
                            for(i = 0, len = sources.length; i < len; i++){
                                sources[i].setAttribute('sizes', width);
                            }
                        }

                        if(!event.detail.dataAttr){
                            updatePolyfill(elem, event.detail);
                        }
                    }
                }
            }
        };

        var updateElementsSizes = function(){
            var i;
            var len = autosizesElems.length;
            if(len){
                i = 0;

                for(; i < len; i++){
                    sizeElement(autosizesElems[i]);
                }
            }
        };

        var throttledUpdateElementsSizes = throttle(updateElementsSizes);

        return {
            _: function(){
                autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
                addEventListener('resize', throttledUpdateElementsSizes);
            },
            checkElems: throttledUpdateElementsSizes,
            updateElem: sizeElement
        };
    })();

    var init = function(){
        if(!init.i){
            init.i = true;
            autoSizer._();
            loader._();
        }
    };

    (function(){
        var prop;

        var lazySizesDefaults = {
            lazyClass: 'lazyload',
            loadedClass: 'lazyloaded',
            loadingClass: 'lazyloading',
            preloadClass: 'lazypreload',
            errorClass: 'lazyerror',
            //strictClass: 'lazystrict',
            autosizesClass: 'lazyautosizes',
            srcAttr: 'data-src',
            srcsetAttr: 'data-srcset',
            sizesAttr: 'data-sizes',
            //preloadAfterLoad: false,
            minSize: 40,
            customMedia: {},
            init: true,
            expFactor: 1.7,
            expand: docElem.clientHeight > 630 ? docElem.clientWidth > 890 ? 500 : 410 : 359,
            loadMode: 2
        };

        lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

        for(prop in lazySizesDefaults){
            if(!(prop in lazySizesConfig)){
                lazySizesConfig[prop] = lazySizesDefaults[prop];
            }
        }

        window.lazySizesConfig = lazySizesConfig;

        setTimeout(function(){
            if(lazySizesConfig.init){
                init();
            }
        });
    })();

    return {
        cfg: lazySizesConfig,
        autoSizer: autoSizer,
        loader: loader,
        init: init,
        uP: updatePolyfill,
        aC: addClass,
        rC: removeClass,
        hC: hasClass,
        fire: triggerEvent,
        gW: getWidth
    };
}));

window.lazySizesConfig.init = false;

/**
 * ZOOM
 * @description Zoom image like on Medium
 * @see https://github.com/spinningarrow/zoom-vanilla.js/
 */

function zoomjs() { "use strict";
  var scrollHandlerFn;
  var clickHandlerFn;
  var keyHandlerFn;
  var touchStartFn;
  var touchMoveFn;

  function offset(element) {
  // From http://www.quirksmode.org/js/findpos.html
  var offset = {
    top: 0,
    left: 0
  }

  if (!element.offsetParent) return offset

  do {
    offset.left += element.offsetLeft
    offset.top += element.offsetTop
  } while (element = element.offsetParent)

  return offset
  }

  /**
   * The zoom service
   */
  function ZoomService () {
    this._activeZoom            =
    this._initialScrollPosition =
    this._initialTouchPosition  =
    this._touchMoveListener     = null

    this._document = document
    this._window   = window
    this._body     = document.body
  }

  ZoomService.prototype.listen = function () {
  document.body.addEventListener('click', function (event) {
    if (event.target.dataset.action === 'zoom') this._zoom(event)
  }.bind(this))
  }

  ZoomService.prototype._zoom = function (e) {
    var target = e.target

    if (!target || target.tagName != 'IMG') return

    if (this._body.classList.contains('zoom-overlay-open')) return

    if (e.metaKey || e.ctrlKey) {
      return window.open((e.target.getAttribute('data-original') || e.target.src), '_blank')
    }

    if (target.width >= (window.innerWidth - Zoom.OFFSET)) return

    this._activeZoomClose(true)

    this._activeZoom = new Zoom(target)
    this._activeZoom.zoomImage()

  scrollHandlerFn = this._scrollHandler.bind(this)
  clickHandlerFn = this._clickHandler.bind(this)
  keyHandlerFn = this._keyHandler.bind(this)
  touchStartFn = this._touchStart.bind(this)

    // todo(fat): probably worth throttling this
  this._window.addEventListener('scroll', scrollHandlerFn)
    this._document.addEventListener('click', clickHandlerFn)
    this._document.addEventListener('keyup', keyHandlerFn)
    this._document.addEventListener('touchstart', touchStartFn)

    e.stopPropagation()
  }

  ZoomService.prototype._activeZoomClose = function (forceDispose) {
    if (!this._activeZoom) return

    if (forceDispose) {
      this._activeZoom.dispose()
    } else {
      this._activeZoom.close()
    }

  this._window.removeEventListener('scroll', scrollHandlerFn)
    this._document.removeEventListener('click', clickHandlerFn)
    this._document.removeEventListener('keyup', keyHandlerFn)
    this._document.removeEventListener('touchstart', touchStartFn)

    this._activeZoom = null
  }

  ZoomService.prototype._scrollHandler = function (e) {
    if (this._initialScrollPosition === null) this._initialScrollPosition = window.scrollY
    var deltaY = this._initialScrollPosition - window.scrollY
    if (Math.abs(deltaY) >= 40) this._activeZoomClose()
  }

  ZoomService.prototype._keyHandler = function (e) {
    if (e.keyCode == 27) this._activeZoomClose()
  }

  ZoomService.prototype._clickHandler = function (e) {
    e.stopPropagation()
    e.preventDefault()
    this._activeZoomClose()
  }

  ZoomService.prototype._touchStart = function (e) {
    this._initialTouchPosition = e.touches[0].pageY

  touchMoveFn = this._touchMove.bind(this)
  e.target.addEventListener('touchmove', touchMoveFn)
  }

  ZoomService.prototype._touchMove = function (e) {
    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
      this._activeZoomClose()
      e.target.removeEventListener('touchmove', touchMoveFn)
    }
  }


  /**
   * The zoom object
   */
  function Zoom (img) {
    this._fullHeight      =
    this._fullWidth       =
    this._overlay         =
    this._targetImageWrap = null

    this._targetImage = img

    this._body = document.body
  }

  Zoom.OFFSET = 80
  Zoom._MAX_WIDTH = 2560
  Zoom._MAX_HEIGHT = 4096

  Zoom.prototype.zoomImage = function () {
    var img = document.createElement('img')
    img.onload = function () {
      this._fullHeight = Number(img.height)
      this._fullWidth = Number(img.width)
      this._zoomOriginal()
    }.bind(this)
    img.src = this._targetImage.src
  }

  Zoom.prototype._zoomOriginal = function () {
    this._targetImageWrap           = document.createElement('div')
    this._targetImageWrap.className = 'zoom-img-wrap'

    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage)
    this._targetImageWrap.appendChild(this._targetImage)

    this._targetImage.classList.add('zoom-img')
  this._targetImage.dataset.action = 'zoom-out'

    this._overlay           = document.createElement('div')
    this._overlay.className = 'zoom-overlay'

    document.body.appendChild(this._overlay)

    this._calculateZoom()
    this._triggerAnimation()
  }

  Zoom.prototype._calculateZoom = function () {
    this._targetImage.offsetWidth // repaint before animating

    var originalFullImageWidth  = this._fullWidth
    var originalFullImageHeight = this._fullHeight

    var scrollTop = window.scrollY

    var maxScaleFactor = originalFullImageWidth / this._targetImage.width

    var viewportHeight = (window.innerHeight - Zoom.OFFSET)
    var viewportWidth  = (window.innerWidth - Zoom.OFFSET)

    var imageAspectRatio    = originalFullImageWidth / originalFullImageHeight
    var viewportAspectRatio = viewportWidth / viewportHeight

    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
      this._imgScaleFactor = maxScaleFactor

    } else if (imageAspectRatio < viewportAspectRatio) {
      this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor

    } else {
      this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }
  }

  Zoom.prototype._triggerAnimation = function () {
    this._targetImage.offsetWidth // repaint before animating

  var imageOffset = offset(this._targetImage)
    var scrollTop   = window.scrollY

    var viewportY = scrollTop + (window.innerHeight / 2)
    var viewportX = (window.innerWidth / 2)

    var imageCenterY = imageOffset.top + (this._targetImage.height / 2)
    var imageCenterX = imageOffset.left + (this._targetImage.width / 2)

    this._translateY = viewportY - imageCenterY
    this._translateX = viewportX - imageCenterX

    this._targetImage.style.transform = 'scale(' + this._imgScaleFactor + ')'
    this._targetImageWrap.style.transform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px) translateZ(0)'

    this._body.classList.add('zoom-overlay-open')
  }

  Zoom.prototype.close = function () {
    this._body.classList.remove('zoom-overlay-open')
    this._body.classList.add('zoom-overlay-transitioning')

    // we use setStyle here so that the correct vender prefix for transform is used
    this._targetImage.style.transform = ''
    this._targetImageWrap.style.transform = ''

  this._targetImage.addEventListener('transitionend', this.dispose.bind(this))
  }

  Zoom.prototype.dispose = function () {
    if (this._targetImageWrap && this._targetImageWrap.parentNode) {
      this._targetImage.classList.remove('zoom-img')
      this._targetImage.dataset.action = 'zoom'

      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap)
      this._overlay.parentNode.removeChild(this._overlay)

      this._body.classList.remove('zoom-overlay-transitioning')
    }
  }

  new ZoomService().listen()

};

/**
 * ASYNC STYLE
 * @description Add "media" attribute to selected tag relative to "data-media". Default is "all"
 * @see http://keithclark.co.uk/articles/loading-css-without-blocking-render/
 * @param DOM el link[rel="stylesheet"] to download
 */

var asyncStyle = function (element) {
    'use strict';
    
    if (element.media === 'none') {
        element.media = element.getAttribute('data-media') || 'all';
    }
};

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
     * INIT
     * @description Functions for init the application
     */
    this.init = function () {
        downloadStyle(option.linkSelector);
        pictureFill();
        zoomjs();
        lazySizes.init();
    };

    /** INIT */
    this.init();
}

var incipit = new Incipit();

//# sourceMappingURL=sourcemaps/script.js.map
