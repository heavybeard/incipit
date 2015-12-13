/**
 * ZOOM
 * @description Zoom image like on Medium
 * @see https://github.com/spinningarrow/zoom-vanilla.js/
 */

function zoomjs() { 
    "use strict";

    /** Define functions */
    var scrollHandlerFn,
        clickHandlerFn,
        keyHandlerFn,
        touchStartFn,
        touchMoveFn;

    /**
     * OFFSET
     * @param object element DOM node
     * @return object
     */
    function offset(element) {
        /** @see http://www.quirksmode.org/js/findpos.html */
        var offset = {
            top: 0,
            left: 0
        };

        if (!element.offsetParent)
            return offset;

        do {
            offset.left += element.offsetLeft;
            offset.top += element.offsetTop;
        } while (element = element.offsetParent);

        return offset
    }

    /**
     * ZOOM SERVICE
     */
    function ZoomService () {
        this._activeZoom            =
        this._initialScrollPosition =
        this._initialTouchPosition  =
        this._touchMoveListener     = null;
        this._document = document;
        this._window = window;
        this._body = document.body;
    }

    /**
     * LISTEN
     */
    ZoomService.prototype.listen = function () {
        document.body.addEventListener('click', function (event) {
            if (event.target.dataset.action === 'zoom') 
                this._zoom(event);
        }.bind(this));
    }

    /**
     * ZOOM
     * object e Event
     */
    ZoomService.prototype._zoom = function (e) {
        var target = e.target

        if (!target || target.tagName !== 'IMG' && target.tagName !== 'VIDEO') {
            return;
        }
        if (this._body.classList.contains('zoom-overlay-open'))
            return;
        if (e.metaKey || e.ctrlKey)
            return window.open((e.target.getAttribute('data-original') || e.target.currentSrc || e.target.src), '_blank');
        if (target.width >= (window.innerWidth - Zoom.OFFSET))
            return;

        this._activeZoomClose(true);
        this._activeZoom = new Zoom(target);
        if (target.tagName === 'IMG')
            this._activeZoom.zoomImage();
        else if (target.tagName === 'VIDEO')
            this._activeZoom.zoomVideo();

        scrollHandlerFn = this._scrollHandler.bind(this);
        clickHandlerFn = this._clickHandler.bind(this);
        keyHandlerFn = this._keyHandler.bind(this);
        touchStartFn = this._touchStart.bind(this);

        /** todo(fat): probably worth throttling this */
        this._window.addEventListener('scroll', scrollHandlerFn);
        this._document.addEventListener('click', clickHandlerFn);
        this._document.addEventListener('keyup', keyHandlerFn);
        this._document.addEventListener('touchstart', touchStartFn);

        e.stopPropagation();
    }

    /**
     * ACTIVE ZOOM CLOSE
     * @param bool forceDispose
     */
    ZoomService.prototype._activeZoomClose = function (forceDispose) {
        if (!this._activeZoom)
            return;

        if (forceDispose) {
            this._activeZoom.dispose();
        } else {
            this._activeZoom.close();
        }

        this._window.removeEventListener('scroll', scrollHandlerFn);
        this._document.removeEventListener('click', clickHandlerFn);
        this._document.removeEventListener('keyup', keyHandlerFn);
        this._document.removeEventListener('touchstart', touchStartFn);
        this._activeZoom = null;
    }

    /**
     * SCROLL HANDLER
     * @param object e Event
     */
    ZoomService.prototype._scrollHandler = function (e) {
        if (this._initialScrollPosition === null) 
            this._initialScrollPosition = window.scrollY;
        var deltaY = this._initialScrollPosition - window.scrollY;
        if (Math.abs(deltaY) >= 40)
            this._activeZoomClose();
    }

    /**
     * KEY HANDLER
     * @param object e Event
     */
    ZoomService.prototype._keyHandler = function (e) {
        if (e.keyCode === 27)
            this._activeZoomClose();
    }

    /**
     * CLICK HANDLER
     * @param object e Event
     */
    ZoomService.prototype._clickHandler = function (e) {
        e.stopPropagation();
        e.preventDefault();
        this._activeZoomClose();
    }

    /**
     * TOUCH START
     * @param object e Event
     */
    ZoomService.prototype._touchStart = function (e) {
        this._initialTouchPosition = e.touches[0].pageY;
        touchMoveFn = this._touchMove.bind(this);
        e.target.addEventListener('touchmove', touchMoveFn);
    }

    /**
     * TOUCH MOVE
     * @param object e Event
     */
    ZoomService.prototype._touchMove = function (e) {
        if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
            this._activeZoomClose();
            e.target.removeEventListener('touchmove', touchMoveFn);
        }
    }

  
    /**
     * ZOOM
     * @param object img DOM IMG node
     */
    function Zoom (img) {
        this._fullHeight      =
        this._fullWidth       =
        this._overlay         =
        this._targetImageWrap = null;
        this._targetImage = img;
        this._body = document.body;
    }

    /**
     * OPTIONS
     */
    /** int */
    Zoom.OFFSET = 80;
    /** int */
    Zoom._MAX_WIDTH = 2560;
    /** int */
    Zoom._MAX_HEIGHT = 4096;
    
    /**
     * ZOOM IMAGE
     */
    Zoom.prototype.zoomImage = function () {
        var img = document.createElement('img');
        
        img.onload = function () {
            this._fullHeight = Number(img.height);
            this._fullWidth = Number(img.width);
            this._zoomOriginal();
        }.bind(this);
        img.src = this._targetImage.currentSrc || this._targetImage.src;
    }

    /**
     * ZOOM VIDEO
     */
    Zoom.prototype.zoomVideo = function () {
        var video = document.createElement('video'),
            source = document.createElement('source'),
            thistarget = this;

        video.appendChild(source);

        video.addEventListener('canplay', function() {
            thistarget._fullHeight = Number(video.videoHeight);
            thistarget._fullWidth = Number(video.videoWidth);
            thistarget._zoomOriginal();
            thistarget._targetImage.play();
        }, false);
        source.src = this._targetImage.currentSrc || this._targetImage.src;
    }

    /**
     * ZOOM ORIGINAL
     */
    Zoom.prototype._zoomOriginal = function () {
        this._targetImageWrap = document.createElement('div');
        this._targetImageWrap.className = 'zoom-img-wrap';

        this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage);
        this._targetImageWrap.appendChild(this._targetImage);

        this._targetImage.classList.add('zoom-img');
        this._targetImage.dataset.action = 'zoom-out';

        this._overlay = document.createElement('div');
        this._overlay.className = 'zoom-overlay';

        document.body.appendChild(this._overlay);

        this._calculateZoom();
        this._triggerAnimation();
    }

    /**
     * CALCULATE ZOOM
     */
    Zoom.prototype._calculateZoom = function () {
        /** Repaint before animatig */
        this._targetImage.offsetWidth;

        var originalFullImageWidth = this._fullWidth,
            originalFullImageHeight = this._fullHeight;
        var scrollTop = window.scrollY;
        var maxScaleFactor = originalFullImageWidth / (this._targetImage.width || this._targetImage.videoWidth);
        var viewportHeight = (window.innerHeight - Zoom.OFFSET),
            viewportWidth = (window.innerWidth - Zoom.OFFSET);
        var imageAspectRatio = originalFullImageWidth / originalFullImageHeight,
            viewportAspectRatio = viewportWidth / viewportHeight;

        if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight)
            this._imgScaleFactor = maxScaleFactor
        else if (imageAspectRatio < viewportAspectRatio)
            this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor
        else
            this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }

    /**
     * TRIGGER ANIMATION
     */
    Zoom.prototype._triggerAnimation = function () {
        /** Repaint before animatig */
        this._targetImage.offsetWidth;

        var imageOffset = offset(this._targetImage);
        var scrollTop = window.scrollY;

        var viewportY = scrollTop + (window.innerHeight / 2),
            viewportX = (window.innerWidth / 2);

        var imageCenterY = imageOffset.top + ((this._targetImage.height || this._targetImage.offsetHeight) / 2),
            imageCenterX = imageOffset.left + ((this._targetImage.width || this._targetImage.offsetWidth) / 2);

        this._translateY = viewportY - imageCenterY;
        this._translateX = viewportX - imageCenterX;

        this._targetImage.style.webkitTransform = 'scale(' + this._imgScaleFactor + ')';
        this._targetImage.style.transform = 'scale(' + this._imgScaleFactor + ')';
        this._targetImageWrap.style.webkitTransform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px) translateZ(0)';
        this._targetImageWrap.style.transform = 'translate(' + this._translateX + 'px, ' + this._translateY + 'px) translateZ(0)';

        this._body.classList.add('zoom-overlay-open');
    }

    /**
     * CLOSE
     */
    Zoom.prototype.close = function () {
        this._body.classList.remove('zoom-overlay-open');
        this._body.classList.add('zoom-overlay-transitioning');

        /** We use setStyle here so that the correct vendor prefix for transform is used */
        this._targetImage.style.webkitTransform = '';
        this._targetImage.style.transform = '';
        this._targetImageWrap.style.webkitTransform = '';
        this._targetImageWrap.style.transform = '';

        this._targetImage.addEventListener('transitionend', this.dispose.bind(this));
        this._targetImage.addEventListener('webkitTransitionEnd', this.dispose.bind(this));
    }

    /**
     * DISPOSE
     */
    Zoom.prototype.dispose = function () {
        if (this._targetImageWrap && this._targetImageWrap.parentNode) {
            this._targetImage.classList.remove('zoom-img');
            this._targetImage.dataset.action = 'zoom';

            this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap);
            this._overlay.parentNode.removeChild(this._overlay);

            this._body.classList.remove('zoom-overlay-transitioning');

            if (this._targetImage.tagName === 'VIDEO' && this._targetImage.getAttribute('data-play'))
                this._targetImage.play();
        }
    }

    /** Start listen */
    new ZoomService().listen()
};
