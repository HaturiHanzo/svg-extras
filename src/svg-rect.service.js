/**
 * Defines SVGRect class
 *
 * @name SVGRect
 */

/**
 * Defines rectangle constructor options
 *
 * @typedef {Object} rectOpts
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Number} width
 * @prop {Number} height
 * @prop {Boolean} [isDraggable=true]
 */

/**
 * Defines coordinates object
 *
 * @typedef {Object} coordinates
 * @prop {Number} x
 * @prop {Number} y
 */

(function (svgext) {
    'use strict';

    svgext.SVGRect = inherit([svgext.SVGElement, svgext.SVGDraggable], {

        /**
         * SVGRect class constructor
         *
         * @param {rectOpts} [opts]
         * @constructor
         */
        __constructor: function (opts) {
            if (!opts) {
                opts = {};
            }
            this.__base(opts, 'rect');
            if (opts.width !== undefined) {
                this.width(opts.width);
            }
            if (opts.height !== undefined) {
                this.height(opts.height);
            }
            if (opts.x !== undefined) {
                this.setX(opts.x);
            }
            if (opts.y !== undefined) {
                this.setY(opts.y);
            }
        },

        /**
         * Rectangle X coordinate setter
         * @param {Number} x
         *
         * @returns {SVGRect}
         */
        setX: function (x) {
            this._rectX = x || 0;
            return this.attr('x', this._rectX);
        },

        /**
         * Rectangle X coordinate getter
         *
         * @returns {Number}
         */
        getX: function () {
            return this._rectX;
        },

        /**
         * Rectangle Y coordinate setter
         *
         * @param {Number} y
         * @returns {SVGRectangle}
         */
        setY: function (y) {
            this._rectY = y || 0;

            return this.attr('y', this._rectY);
        },

        /**
         * Rectangle Y coordinate getter
         *
         * @returns {Number}
         */
        getY: function () {
            return this._rectY;
        },

        /**
         * Sets or gets rectangle width
         *
         * @param {Number} [width]
         * @returns {(Number|SVGRect)}
         */
        width: function (width) {
            if (width === undefined) {
                return this._width;
            }
            this._width = width;

            return this.attr('width', this._width);
        },

        /**
         * Sets or gets rectangle height
         *
         * @param {Number} [height]
         * @returns {(Number|SVGRect)}
         */
        height: function (height) {
            if (height === undefined) {
                return this._height;
            }
            this._height = height;

            return this.attr('height', this._height);
        },

        /**
         * SVGDraggable normalizeCoords implementation
         *
         * @override {SVGDraggable}
         */
        normalizeCoords: function (delta) {
            var x = this.getX(),
                y = this.getY(),
                width = this.width(),
                height = this.height(),
                containerSize = this.getContainerRect();
            if (x + delta.x < 0) {
                delta.x = (-1) * x;
            } else if (x + width + delta.x > containerSize.width) {
                delta.x = containerSize.width - x - width;
            }
            if (y + delta.y < 0) {
                delta.y = (-1) * y;
            } else if (y + height + delta.y > containerSize.height) {
                delta.y = containerSize.height - y - height;
            }

            return delta;
        },

        /**
         * Rectangle value getter
         *
         * @param {Boolean} [relative=false] Returns relative coordinates if true
         * @returns {Object} resolution
         * @returns {Number} resolution.width
         * @returns {Number} resolution.height
         */
        getValue: function (relative) {
            var result = {
                width: this.width(),
                height: this.height()
            }, containerRect;

            if (relative) {
                containerRect = this.getContainerRect();
                result.width /= containerRect.width;
                result.height /= containerRect.height;
            }

            return result;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            this.setX(this.getX() + delta.x)
                .setY(this.getY() + delta.y);
        }
    });
}(svgext));
