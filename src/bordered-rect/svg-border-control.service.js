/**
 * Defines SVGBorderControl
 *
 * @name SVGBorderControl
 */
(function (svgext) {
    'use strict';

    svgext.SVGBorderControl = inherit(SVGRect, {

        /**
         * Creates new SVGBorderControl instance
         *
         * @constructor
         */
        __constructor: function () {
            this.__base({
                cssClass: 'svg-border-control',
                isDraggable: true,
                width: svgext.default.vertexWidth,
                height: svgext.default.vertexHeight
            });
        },

        /**
         * Renders border control
         *
         * @override {SVGElement}
         */
        onAppend: function (container) {
            this.__base(container);
            this.render();
        },

        /**
         * SVGDraggable normalizeCoords implementation
         *
         * @override {SVGDraggable}
         */
        normalizeCoords: function (delta) {
            var containerSize = this.getContainerRect(),
                rect = this.container;

            if (rect.width() + delta.x < 1) {
                delta.x = rect.width() > 1 ? (-1) * (rect.width() - 1) : 0;
            } else if (rect.getX() + rect.width() + delta.x > containerSize.width) {
                delta.x = containerSize.width - rect.getX() - rect.width();
            }
            if (rect.height() + delta.y < 1) {
                delta.y = rect.height() > 1 ? (-1) * rect.height() + 1 : 0;
            } else if (rect.getY() + rect.height() + delta.y > containerSize.height) {
                delta.y = containerSize.height - rect.getY() - rect.height();
            }

            return delta;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            var rect = this.container;

            rect.width(rect.width() + delta.x).height(rect.height() + delta.y);
        },

        /**
         * Places control on the bottom of border rectangle
         *
         * @param {axis} [axis] Changed axis
         */
        render: function (axis) {
            var rect = this.container;

            if (axis !== 'x') {
                this.setY(rect.getY() + rect.height() + svgext.default.borderOffset - svgext.default.vertexHeight / 2);
            }

            if (axis !== 'y') {
                this.setX(rect.getX() + rect.width() + svgext.default.borderOffset - svgext.default.vertexWidth / 2);
            }
        }
    });
}(svgext));