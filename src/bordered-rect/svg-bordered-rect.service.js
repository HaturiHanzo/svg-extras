/**
 * Defines SVGBorderedRect
 *
 * @name SVGBorderedRect
 */

/**
 * Defines rectangle constructor options
 *
 * @typedef {Object} rectOpts
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Number} width
 * @prop {Number} height
 * @prop {String} [cssClass='svg-bordered-rect'] CSS classes separated by space
 * @prop {String} [backgroundColor='#00d']
 * @prop {Boolean} [isDraggable=true]
 */

/**
 * Defines axis
 *
 * @typedef {('x'|'y')} axis
 */
(function (svgext) {
    'use strict';

    svgext.SVGBorderedRect = inherit([svgext.SVGRect, svgext.SVGBlock], {

        /**
         * SVGBorderedRect class constructor
         *
         * @param {rectOpts} [opts]
         * @constructor
         */
        __constructor: function (opts) {
            if (!(opts.width && opts.height && opts.x && opts.y)) {
                throw new Error('Missing property. Properties:'
                    + 'width, height, x and y are required by SVGResizeableRectangle.');
            }
            opts.cssClass = opts.cssClass || 'svg-bordered-rect';
            this.__base(opts);

            this.rootNode = this.createElem('g');
            this.appendElem(this.node);

            this.border = new svgext.SVGBorder();
            this.append(this.border);

            this.control = new svgext.SVGBorderControl();
            this.append(this.control);

            this.on(svgext._isTouchDevice ? 'touchstart' : 'mousedown', this.select.bind(this));
        },

        /**
         * Sets or gets rectangle width
         *
         * @override {SVGRect}
         */
        width: function (width) {
            var result = this.__base(width);

            if (width) {
                this.renderComponents('x');
            }

            return result;
        },

        /**
         * Sets or gets rectangle height
         *
         * @override {SVGRect}
         */
        height: function (height) {
            var result = this.__base(height);

            if (height) {
                this.renderComponents('y');
            }

            return result;
        },

        /**
         * Activates bordered rectangle
         *
         * @override {SVGElement}
         * @returns {SVGBorderedRect}
         */
        activate: function () {
            this.__base();
            this.border.activate();
            this.control.activate();
            this.bringToFront();

            return this;
        },

        /**
         * Deactivates bordered rectangle
         *
         * @override {SVGElement}
         * @returns {SVGBorderedRect}
         */
        deactivate: function () {
            this.__base();
            this.border.deactivate();
            this.control.deactivate();

            return this;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            this.setX(this.getX() + delta.x)
                .setY(this.getY() + delta.y);
            this.renderComponents();
        },

        /**
         * Activates rect
         *
         * @returns {SVGBorderedRect}
         */
        select: function () {
            this.container.setActiveElement(this);

            return this;
        },

        /**
         * Resizes rectangle
         *
         * @param {Number} widthFactor width resize factor
         * @param {Number} heightFactor height resize factor
         */
        resize: function (widthFactor, heightFactor) {
            this.setX(this.getX() * widthFactor);
            this.setY(this.getY() * heightFactor);
            this.width(this.width() * widthFactor);
            this.height(this.height() * heightFactor);
            this.renderComponents();
        },

        /**
         * Renders border and control
         *
         * @param {axis} [axis] Changed axis
         */
        renderComponents: function (axis) {
            if (this.border && this.control) {
                this.border.render(axis);
                this.control.render(axis);
            }
        }
    });
}(svgext));
