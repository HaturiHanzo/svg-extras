(function (svgext) {
    'use strict';

    svgext.SVGContainer = inherit([svgext.SVGElement, svgext.SVGBlock], /** @lends svgext.SVGContainer.prototype  */ {

        /**
         * Creates svgext.SVGContainer instance
         *
         * @constructs svgext.SVGContainer
         * @classdesc Root svg element class
         * @augments svgext.SVGElement
         * @mixes svgext.SVGBlock
         * @param {Object} [opts]
         * @param {String} [opts.cssClass]
         * @param {SVGSVGElement} [opts.node] existing svg element
         */
        __constructor: function (opts) {
            opts = opts || {};
            opts.isDraggable = false;
            opts.cssClass = opts.cssClass || 'svg-container_fluid';
            this.__base(opts, opts.node || 'svg');
            this._offWindowResize = svgext._throttleEventListener('resize', this._onWindowResize.bind(this));
        },

        /**
         * Instances getter
         *
         * @param {SVGElement} [elemClass]
         * @returns {Array.<SVGElement>}
         */
        getInstances: function (elemClass) {
            return elemClass ? this._filterChildren(elemClass) : this.children;
        },

        /**
         * Current active element getter
         *
         * @returns {SVGElement|null}
         */
        getActiveElement: function () {
            return this.activeElement;
        },

        /**
         * Toggles elements
         *
         * @param {Boolean} visible
         * @param {SVGElement} [elemClass]
         * @returns {SVGContainer}
         */
        toggleAllInstances: function (visible, elemClass) {
            this.getInstances(elemClass)
                .forEach(function (svgElement) {
                    if (!visible) {
                        svgElement.deactivate().hide();
                    } else {
                        svgElement.show();
                    }
                });

            return this;
        },

        /**
         * Sets an active element
         *
         * @param {SVGElement} svgElement
         */
        setActiveElement: function (svgElement) {
            if (svgElement && svgElement instanceof svgext.SVGElement && !svgElement.isActive) {
                this.deactivateActiveElement();
                svgElement.activate();
                this.activeElement = svgElement;
            }
        },

        /**
         * Deactivates active element if it exists
         *
         * @returns {SVGContainer}
         */
        deactivateActiveElement: function () {
            if (this.activeElement) {
                this.activeElement.deactivate();
                this.activeElement = null;
            }

            return this;
        },

        /**
         * Removes an active instance based on passed constructor
         *
         * @param {SVGElement} [elemClass]
         */
        removeActiveInstance: function (elemClass) {
            if (!this.activeElement) {
                return;
            }
            if (!elemClass || (elemClass && this.activeElement instanceof elemClass)) {
                this.remove(this.activeElement);
                this.activeElement = null;
            }
        },

        /**
         * Removes all instances based on passed constructor
         *
         * @param {SVGElement} [elemClass]
         */
        removeAllInstances: function (elemClass) {
            var children = this.children;

            if (elemClass) {
                this.removeActiveInstance(elemClass);
                return this.getInstances(elemClass).forEach(this.remove, this);
            }

            this.activeElement = null;
            while (children.length) {
                this.remove(children[0]);
            }
        },

        /**
         * Removes svg container
         *
         * @override {SVGBlock}
         */
        destroy: function () {
            this._offWindowResize();
            this.__base();
        },

        /**
         * Fetches all instances from the containers
         *
         * @param {instance} elemClass
         * @private
         * @returns {Array.<SVGElement>}
         */
        _filterChildren: function (elemClass) {
            return this.children.filter(function (child) {
                return child instanceof elemClass;
            });
        },

        /**
         * Window resize handler
         *
         * @private
         */
        _onWindowResize: function () {
            var containerRect = this.getRect();
            if (this._prevContainerWidth === undefined) {
                this._prevContainerWidth = containerRect.width;
                this._prevContainerHeight = containerRect.height;
                return;
            }
            if (containerRect.width !== this._prevContainerWidth
                || containerRect.height !== this._prevContainerHeight) {
                this._resizeChildren(
                    containerRect.width / this._prevContainerWidth,
                    containerRect.height / this._prevContainerHeight
                );
                this._prevContainerWidth = containerRect.width;
                this._prevContainerHeight = containerRect.height;
            }
        },

        /**
         * Resizes all resizable children
         *
         * @param {Number} widthFactor width resize factor
         * @param {Number} heightFactor height resize factor
         * @private
         */
        _resizeChildren: function (widthFactor, heightFactor) {
            this.children.forEach(function (child) {
                if (child && child.resize) {
                    child.resize(widthFactor, heightFactor);
                }
            });
        }
    });
}(svgext));
