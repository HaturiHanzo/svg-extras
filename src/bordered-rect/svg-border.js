/**
 * Defines SVGBorder
 *
 * @name SVGBorderedRect
 * @namespace Services
 */

(function (svgext) {
    'use strict';

    svgext.SVGBorder = inherit(svgext.SVGElement, {

        /**
         * SVGBorder class constructor
         *
         * @constructor
         */
        __constructor: function () {
            this.__base({
                isDraggable: false,
                cssClass: 'svg-border',
                backgroundColor: 'none'
            }, 'rect');
        },

        /**
         * Renders border
         *
         * @override {SVGElement}
         */
        onAppend: function (container) {
            this.__base(container);
            this.render();
        },

        /**
         * Places border around a rectangle
         *
         * @param {axis} [axis] Changed axis
         */
        render: function (axis) {
            var offset = svgext.default.borderedRect.borderOffset;

            if (axis !== 'x') {
                this.attr('y', this.container.getY() - offset)
                    .attr('height', this.container.height() + 2 * offset);
            }

            if (axis !== 'y') {
                this.attr('x', this.container.getX() - offset)
                    .attr('width', this.container.width() + 2 * offset);
            }
        }
    });

}(svgext));
