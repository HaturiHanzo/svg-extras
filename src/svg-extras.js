/* jshint -W098 */
/* jshint -W079 */
var svgext = (function () {
    'use strict';

    if (!inherit) {
        throw new Error('Svg-extras requires https://github.com/dfilatov/inherit');
    }
    var isTouchDevice = 'ontouchstart' in document.documentElement;

    return {
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
        default: {
            vertexWidth: isTouchDevice ? 20 : 12,
            vertexHeight: isTouchDevice ? 20 : 12,
            borderOffset: isTouchDevice ? 16 : 14,
            polygonAddPointDist: isTouchDevice ? 20 : 0
        }
    };
}());
