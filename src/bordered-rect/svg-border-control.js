/**
 * Defines SVGBorderControl
 *
 * @name SVGBorderControl
 */
(function (svgext) {
    'use strict';

    svgext.SVGBorderControl = inherit(svgext.SVGRect, {

        /**
         * Creates new SVGBorderControl instance
         *
         * @constructor
         */
        __constructor: function () {
            this.__base({
                cssClass: 'svg-border-control',
                isDraggable: true,
                width: svgext.default.control.width,
                height: svgext.default.control.height
            });

            if (svgext._isTouchDevice) {
                this.addClass('svg-control_type_touch');
            }
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
            var rect = this.container,
                offset = svgext.default.borderedRect.borderOffset;

            if (axis !== 'x') {
                this.setY(rect.getY() + rect.height() + offset - svgext.default.control.height / 2);
            }

            if (axis !== 'y') {
                this.setX(rect.getX() + rect.width() + offset - svgext.default.control.width / 2);
            }
        }
    });
}(svgext));
