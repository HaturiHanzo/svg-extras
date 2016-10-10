/**
 * Defines SVGResizableRect
 *
 * @name SVGResizableRect
 */

/**
 * Defines rectangle constructor options
 *
 * @typedef {Object} rectOpts
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Number} width
 * @prop {Number} height
 * @prop {String} [cssClass='svg-resizable-rectangle'] CSS classes separated by space
 * @prop {Boolean} [isDraggable=true]
 */
(function (svgext) {
    'use strict';

    svgext.SVGResizableRect = inherit([svgext.SVGRect, svgext.SVGBlock], {

        /**
         * SVGResizableRect class constructor
         *
         * @param {rectOpts} opts
         * @constructor
         */
        __constructor: function (opts) {
            if (!(opts.width && opts.height && opts.x && opts.y)) {
                throw new Error('Missing property. Properties:'
                    + 'width, height, x and y are required by SVGResizableRectangle.');
            }
            opts.cssClass = opts.cssClass || 'svg-resizable-rectangle';
            this.__base(opts);

            this.rootNode = this.createElem('g');
            this.appendElem(this.node);
            this._createControls();
            this.on(svgext._isTouchDevice ? 'touchstart' : 'mousedown', this.select.bind(this));
        },

        /**
         * Changes rectangle coordiantes or resolution after controls move
         *
         * @param {('vertical' | 'horizontal')} type Control type
         */
        update: function (type) {
            var smallestPointIndex,
                points = this.controls;

            if (type === 'vertical') {
                // Finds vertical point index with the smallest Y value
                smallestPointIndex = points[0].getY() >= points[1].getY() ? 1 : 0;
                this.setY((svgext.default.vertexHeight / 2) + points[smallestPointIndex].getY());
                this.height(points[smallestPointIndex ? 0 : 1].getY() - points[smallestPointIndex].getY());
                var hPointsY = this.getY() + (this.height() / 2) - svgext.default.vertexHeight / 2;
                [points[2], points[3]].forEach(function (hPoint) {
                    hPoint.setY(hPointsY);
                });
            } else {
                // Finds vertical point index with the smallest X value
                smallestPointIndex = points[2].getX() >= points[3].getX() ? 3 : 2;
                this.setX((svgext.default.vertexWidth / 2) + points[smallestPointIndex].getX());
                this.width(points[smallestPointIndex === 3 ? 2 : 3].getX() - points[smallestPointIndex].getX());
                var vPointsX = this.getX() + (this.width() / 2) - svgext.default.vertexWidth / 2;
                [points[0], points[1]].forEach(function (vPoint) {
                    vPoint.setX(vPointsX);
                });
            }
        },

        /**
         * Activates resizable polygon
         *
         * @override {SVGElement}
         * @returns {SVGResizableRect}
         */
        activate: function () {
            this.__base();
            this.controls.forEach(function (control) {
                control.activate();
            });
            this.bringToFront();

            return this;
        },

        /**
         * Deactivates resizable polygon
         *
         * @override {SVGElement}
         * @returns {SVGResizableRect}
         */
        deactivate: function () {
            this.__base();
            this.controls.forEach(function (control) {
                control.deactivate();
            });

            return this;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            this.controls.concat(this)
                .forEach(function (point) {
                    point.setX(point.getX() + delta.x).setY(point.getY() + delta.y);
                });
        },

        /**
         * Activates rectangle
         *
         * @returns {SVGResizableRect}
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
            this.controls.forEach(function (point) {
                point.setX(point.getX() * widthFactor)
                    .setY(point.getY() * heightFactor);
            }, this);
        },

        /**
         * Adds a new control
         *
         * @param {controlsOpts} opts
         * @private
         */
        _addControl: function (opts) {
            var control = new svgext.SVGRectControls(opts);
            this.append(control);
            this.controls.push(control);
        },

        /**
         * Creates controls based on resolution and coordiantes, can be called only once
         *
         * @private
         */
        _createControls: function () {
            if (this.controlCreated) {
                return;
            }
            this.controls = [];
            var halfControlWidth = svgext.default.vertexWidth / 2,
                halfControlHeight = svgext.default.vertexHeight / 2,
                controlOpts = {
                    width: svgext.default.vertexWidth,
                    height: svgext.default.vertexHeight,
                    cssClass: 'svg-rectangle-control'
                };
            // Top
            controlOpts.type = 'vertical';
            controlOpts.x = this.getX() + (this.width() / 2) - halfControlWidth;
            controlOpts.y = this.getY() - halfControlHeight;
            this._addControl(controlOpts);

            // Bottom
            controlOpts.y = this.getY() + this.height() - halfControlHeight;
            this._addControl(controlOpts);

            // Right
            controlOpts.type = 'horizontal';
            controlOpts.x = this.getX() + this.width() - halfControlWidth;
            controlOpts.y = this.getY() + (this.height() / 2) - halfControlHeight;
            this._addControl(controlOpts);

            // Left
            controlOpts.x = this.getX() - halfControlWidth;
            this._addControl(controlOpts);

            this.controlCreated = true;
            return this;
        }
    });
}(svgext));
