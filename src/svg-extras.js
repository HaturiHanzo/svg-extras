(function (global) {
    'use strict';

    if (!EventEmitter) {
        throw new Error('Svg-extras requires https://github.com/primus/eventemitter3');
    }

    if (!inherit) {
        throw new Error('Svg-extras requires https://github.com/dfilatov/inherit');
    }

    var isTouchDevice = 'ontouchstart' in document.documentElement;

    /**
     * svgext namespace
     * @namespace svgext
     */
    global.svgext = {
        /**
         * Touch device flag
         *
         * @type {Boolean}
         * @private
         */
        _isTouchDevice: isTouchDevice,

        /**
         * Runs events only in a new request animation frame
         *
         * @param {String} type Event name
         * @param {String} callback Event listener
         * @param {DOMElement} [domNode]
         * @private
         * @returns {Function} detach function
         */
        _throttleEventListener: function (type, callback, domNode) {
            var running = false,
                detached = false;

            domNode = domNode || window;
            var handler = function (e) {
                if (running) {
                    return false;
                }
                running = true;
                requestAnimationFrame(function () {
                    if (!detached) {
                        callback(e);
                    }
                    running = false;
                });
            };

            domNode.addEventListener(type, handler, false);

            return function () {
                detached = true;
                domNode.removeEventListener(type, handler);
            };
        },

        /**
         * Defines default svgext settings structure
         *
         * @name svgext.default
         * @prop {resolution} control
         * @prop {Object} borderedRect
         * @prop {Number} borderedRect.borderOffset
         */
        default: {
            control: {
                width: 12,
                height: 12
            },
            borderedRect: {
                borderOffset: 14
            }
        }
    };
}(window));
