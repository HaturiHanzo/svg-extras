/* jshint -W098 */
/* jshint -W079 */
var svgext = (function () {
    'use strict';

    if (!inherit) {
        throw new Error('Svg-extras requires https://github.com/dfilatov/inherit');
    }

    return {
        _isTouchDevice: 'ontouchstart' in document.documentElement,
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
            vertexWidth: this.isTouchDevice ? 20 : 12,
            vertexHeight: this.isTouchDevice ? 20 : 12,
            borderOffset: this.isTouchDevice ? 16 : 14,
            polygonAddPointDist: this.isTouchDevice ? 20 : 0
        }
    };
}());
