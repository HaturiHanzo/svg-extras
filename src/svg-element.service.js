/**
 * Defines SVGElement abstract class
 *
 * @name SVGElement
 */

(function (svgext) {
    'use strict';

    svgext.inherit(null, {

        NS: 'http://www.w3.org/2000/svg',

        /**
         * Creates new SVGElement instance
         *
         * @param {Object} [opts]
         * @param {Boolean} [opts.isDraggable=true]
         * @param {Boolean} [opts.backgroundColor=#00d]
         * @param {Boolean} [opts.cssClass]
         * @param {String} tagName
         * @constructor
         */
        __constructor: function (opts, tagName) {
            this.rootNode = this.node = this.createElem(tagName);
            opts = opts || {};
            if (opts.cssClass) {
                this.addClass(opts.cssClass);
            }
            if (opts.backgroundColor) {
                this.attr('fill', opts.backgroundColor);
            } else {
                this.addClass('svg_bg-color_default');
            }

            this.on('dragstart', function (event) {
                event.preventDefault();
            });
        },

        /**
         * Checks if instance has a class
         *
         * @param {String} className
         * @returns {Boolean}
         */
        hasClass: function (className) {
            var activeClasses = this.attr('class');
            if (!activeClasses) {
                return false;
            }

            return new RegExp('(\\s|^)' + className + '(\\s|$)').test(activeClasses);
        },

        /**
         * Adds a new class to the element
         *
         * @param {String} newClass Class name or several classes separated by a space
         * @returns {SVGElement}
         */
        addClass: function (newClass) {
            newClass.split(/\s+/).forEach(function (className) {
                if (!this.hasClass(className)) {
                    var activeClasses = this.attr('class') || '';
                    this.attr('class', activeClasses + ' ' + className);
                }
            }, this);

            return this;
        },

        /**
         * Removes class
         *
         * @param {String} className
         * @returns {SVGElement}
         */
        removeClass: function (className) {
            var activeClasses = this.node.getAttribute('class');
            if (activeClasses) {
                var regExp = new RegExp('(?:(\\s|^))' + className + '(?=\\s|$)', 'g');
                this.attr('class', activeClasses.replace(regExp, ''));
            }

            return this;
        },

        /**
         * Hides an elment
         *
         * @returns {SVGElement}
         */
        hide: function () {
            return this.addClass('svg-element_hidden');
        },

        /**
         * Shows an elment
         *
         * @returns {SVGElement}
         */
        show: function () {
            return this.removeClass('svg-element_hidden');
        },

        /**
         * SVGElement node attributes setter & getter
         *
         * @param {String} key
         * @param {String} value
         * @returns {SVGElement}
         */
        attr: function (key, value) {
            if (value === undefined) {
                return this.node.getAttribute(key);
            }
            this.node.setAttribute(key, value);

            return this;
        },

        /**
         * Brings an element above another
         *
         * @returns {SVGElement}
         */
        bringToFront: function () {
            var parent = this.rootNode.parentNode;

            parent.removeChild(this.rootNode);
            parent.appendChild(this.rootNode);

            return this;
        },

        /**
         * Adds an active class
         *
         * @returns {SVGElement}
         */
        activate: function () {
            this.isActive = true;
            this.addClass('active');

            return this;
        },

        /**
         * Removes an active class
         *
         * @returns {SVGElement}
         */
        deactivate: function () {
            this.isActive = false;

            return this.removeClass('active');
        },

        /**
         * Adds an event listener
         *
         * @param {String} type Event name
         * @param {Function} listener Event handler
         * @returns {SVGElement}
         */
        on: function (type, listener) {
            this.node.addEventListener(type, listener);

            return this;
        },

        /**
         * Adds double tap event handler
         *
         * @param {Function} listener
         * @returns {Function}
         */
        onDoubleTap: function (listener) {
            var tapped = false,
                tap = function (event) {
                    if (!tapped) {
                        tapped = setTimeout(function () {
                            tapped = null;
                        }, 300);
                    } else {
                        clearTimeout(tapped);
                        tapped = null;
                        event.stopPropagation();
                        listener(event);
                    }
                };
            this.on('touchstart', tap);

            return tap;
        },


        /**
         * Removes double tap event handler
         *
         * @param {Function} tap
         * @returns {SVGElement}
         */
        offDoubleTap: function (tap) {
            return this.off('touchstart', tap);
        },

        /**
         * Removes an event listener
         *
         * @param {String} type Event name
         * @param {Function} listener Event handler
         * @returns {SVGElement}
         */
        off: function (type, listener) {
            this.node.removeEventListener(type, listener);

            return this;
        },

        /**
         * Svg container bounding client rect getter
         *
         * @returns {TextRectangle}
         */
        getContainerRect: function () {
            return this.node.ownerSVGElement.getBoundingClientRect();
        },

        /**
         * Element bounding client rect getter
         *
         * @returns {TextRectangle}
         */
        getRect: function () {
            return this.node.getBoundingClientRect();
        },

        /**
         * Destroys an object
         */
        destroy: function () {
            Object.keys(this).forEach(function (key) {
                delete this[key];
            }, this);
        },

        /**
         * Creates new svg element
         *
         * @param {String} tagName
         * @private
         * @returns {SVGNode}
         */
        createElem: function (tagName) {
            return document.createElementNS(this.NS, tagName);
        },

        /**
         * Fires when an element is appended to the DOM
         *
         * @param {SVGBlock} container New element container
         */
        onAppend: function (container) {
            this.container = container;
        }
    });
}(svgext));

