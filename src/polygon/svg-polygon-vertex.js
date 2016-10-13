/**
 * Defines SVGPolygonVertex
 *
 * @name SVGPolygonVertex
 */

/**
 * Defines rectangle constructor options
 *
 * @typedef {Object} vertexOpts
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Number} width
 * @prop {Number} height
 * @prop {Boolean} [isDraggable=true]
 * @prop {SVGPolygon} polygon
 */

(function (svgext) {
    'use strict';

    svgext.SVGPolygonVertex = inherit(svgext.SVGRect, {

        /**
         * Creates new SVGPolygonVertex instance
         *
         * @param {vertexOpts} opts
         * @constructor
         */
        __constructor: function (opts) {
            opts = opts ? opts : {isDraggable: true};
            this.__base(opts);
        },

        /**
         * SVGDraggable normalizeCoords implementation
         *
         * @override {SVGDraggable}
         */
        normalizeCoords: function (delta) {
            var x = this.getX(),
                y = this.getY(),
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
            this.__base(delta);
            this.container.render();
        },

        /**
         * Vertex X coordinate setter, with the half of the width offset
         *
         * @param {Number} x
         * @override {SVGRect}
         * @returns {SVGPolygonVertex}
         */
        setX: function (x) {
            this._rectX = x - (this.width() / 2);

            return this.attr('x', this._rectX);
        },

        /**
         * Vertex X coordinate getter, with the half of the width offset
         *
         * @override {SVGRect}
         * @returns {Number}
         */
        getX: function () {
            return this._rectX + (this.width() / 2);
        },

        /**
         * Vertex Y coordinate setter, with the half of the height offset
         *
         * @param {Number} y
         * @override {SVGRect}
         * @returns {SVGPolygonVertex}
         */
        setY: function (y) {
            this._rectY = y - (this.height() / 2);

            return this.attr('y', this._rectY);
        },

        /**
         * Vertex Y coordinate getter, with the half of the heihgt offset
         *
         * @override {SVGRect}
         * @returns {Number}
         */
        getY: function () {
            return this._rectY + (this.height() / 2);
        }
    });
}(svgext));
