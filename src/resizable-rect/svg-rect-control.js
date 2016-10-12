/**
 * Defines SVGRectControls
 *
 * @name SVGRectControls
 */

/**
 * Defines rectangle constructor options
 *
 * @typedef {Object} controlsOpts
 * @param {Number} x
 * @prop {Number} y
 * @prop {Number} width
 * @prop {Number} height
 * @prop {('vertical' | 'horizontal')} type
 * @prop {Boolean} [isDraggable=true]
 * @prop {SVGPolygon} polygon
 */

(function (svgext) {
    'use strict';

    svgext.SVGRectControls = inherit(svgext.SVGRect, {

        /**
         * Creates new SVGRectControls instance
         *
         * @param {controlsOpts} opts
         * @constructor
         */
        __constructor: function (opts) {
            if (!opts.type) {
                throw new Error('Type should be set in a SVGRectControls constructor');
            }
            this.__base(opts);
            this.type = opts.type;
            this.addClass('svg-rectangle-control_type_' + this.type);
        },

        /**
         * SVGDraggable normalizeCoords implementation
         *
         * @override {SVGDraggable}
         */
        normalizeCoords: function (delta) {
            var width = this.width(),
                height = this.height(),
                x = this.getX() + width / 2,
                y = this.getY() + height / 2,
                containerSize = this.getContainerRect();
            if (x + delta.x < 0) {
                delta.x = (-1) * x;
            } else if (x + delta.x > containerSize.width) {
                delta.x = containerSize.width - x;
            }
            if (y + delta.y < 0) {
                delta.y = (-1) * y;
            } else if (y + delta.y > containerSize.height) {
                delta.y = containerSize.height - y;
            }

            return delta;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            delta[this.type === 'horizontal' ? 'y' : 'x'] = 0;
            this.__base(delta);
            this.container.update(this.type);
        }
    });
}(svgext));