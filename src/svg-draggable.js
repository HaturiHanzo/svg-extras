/**
 * Defines SVGDraggable class
 *
 * @name SVGDraggable
 */
(function (svgext) {
    'use strict';

    svgext.SVGDraggable = {
        /**
         * SVGDraggable class constructor
         *
         * @param {*} opts
         * @constructor
         */
        __constructor: function (opts) {
            this.__base.apply(this, arguments);

            if (opts.isDraggable || opts.isDraggable === undefined) {
                this._dndOnMouseMove = this._dndOnMouseMove.bind(this);
                this._dndOnMouseUp = this._dndOnMouseUp.bind(this);
                this.addClass('svg_draggable');
                this.on(svgext._isTouchDevice ? 'touchstart' : 'mousedown', this._dndOnMouseDown.bind(this));
            }
        },

        /**
         * Removes all dnd handlers
         *
         * @override {SVGElement}
         */
        destroy: function () {
            if (this.removeDndHandlers) {
                this.removeDndHandlers();
            }

            this.__base();
        },

        /**
         * Removes all handlers
         */
        removeDndHandlers: function () {
            if (svgext._isTouchDevice) {
                window.removeEventListener('touchmove', this._dndOnMouseMove);
                window.removeEventListener('touchcancel', this._dndOnMouseUp);
                window.removeEventListener('touchend', this._dndOnMouseUp);
            } else {
                window.removeEventListener('mousemove', this._dndOnMouseMove);
                window.removeEventListener('mouseup', this._dndOnMouseUp);
            }
        },

        /**
         * Mouse down event listener handler
         *
         * @param {Event} event
         * @private
         */
        _dndOnMouseDown: function (event) {
            // Cross browser right mouse click check
            if ((event.which && event.which === 3) || (event.button && event.button === 2)) {
                return;
            }
            document.body.classList.add('unselectable');

            this._saveClientCoords(event.changedTouches ? event.changedTouches[0] : event);
            if (svgext._isTouchDevice) {
                window.addEventListener('touchmove', this._dndOnMouseMove);
                window.addEventListener('touchend', this._dndOnMouseUp);
                window.addEventListener('touchcancel', this._dndOnMouseUp);
            } else {
                window.addEventListener('mousemove', this._dndOnMouseMove);
                window.addEventListener('mouseup', this._dndOnMouseUp);
            }
        },

        /**
         * Mouse move handler
         *
         * @param {Event} event
         * @private
         */
        _dndOnMouseMove: function (event) {

            if (event.movementX !== undefined) {
                return this.drag(this.normalizeCoords({x: event.movementX, y: event.movementY}));
            }

            var data = event;

            if (data.changedTouches) {
                event.preventDefault();
                data = event.changedTouches[0];
            }
            if (!this._lastClientCoords) {
                return this._saveClientCoords(data);
            }

            this.drag(this.normalizeCoords({
                x: data.clientX - this._lastClientCoords.clientX,
                y: data.clientY - this._lastClientCoords.clientY
            }));
            this._saveClientCoords(data);
        },

        /**
         * Saves last event client coordinates
         *
         * @param {Object} data Mousemove event
         * @param {Number} data.clientX
         * @param {Number} data.clientY
         */
        _saveClientCoords: function (data) {
            this._lastClientCoords = {
                clientX: data.clientX,
                clientY: data.clientY
            };
        },

        /**
         * Mouse up handler
         *
         * @private
         */
        _dndOnMouseUp: function () {
            this._lastClientCoords = null;
            this.removeDndHandlers();
            document.body.classList.remove('unselectable');
        },

        /**
         * Changes element position on mouse move
         *
         * @abstract
         * @param {coordinates} delta
         */
        drag: function () {
            throw new Error('SVGDraggable.drag not implemented');
        },

        /**
         * Checks if a new element position won't cross the border
         *  and changes delta object to avoid border crossing
         *
         * @abstract
         * @param {coordinates} delta
         * @returns {coordinates}
         */
        normalizeCoords: function () {
            throw new Error('SVGDraggable.normalizeCoords not implemented');
        }
    };
}(svgext));
