/**
 * SCRIPTS
 * Include here all core scripts
 */

/** Active the download of files.css on window.load */
var styleElements = document.querySelectorAll('link[rel="stylesheet"]');
Array.prototype.forEach.call(styleElements, function(element, index){
    window.addEventListener('load', function () {
        asyncStyle(styleElements[index]);
    }, false);
});
