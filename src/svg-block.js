(function (svgext) {
    'use strict';

    /**
     * Wraps an element in a g element and adds special methods to control children
     *
     * @mixin svgext.SVGBlock
     */
    svgext.SVGBlock = {

        /**
         * SVGBlock mixin constructor proxy
         *
         * @override
         * @ignore
         */
        __constructor: function () {
            this.__base.apply(this, arguments);
            this.children = [];
        },

        /**
         * Appends an element
         *
         * @param {SVGElement} svgElem
         * @returns {SVGBlock}
         */
        append: function (svgElem) {
            this.children.push(svgElem);
            svgElem.container = this;
            this.appendElem(svgElem.rootNode);
            svgElem.onAppend(this);

            return this;
        },

        /**
         * Appends svg node
         *
         * @param {SVGNode} node
         */
        appendElem: function (node) {
            this.rootNode.appendChild(node);
        },

        /**
         * Removes an svg element
         *
         * @param {SVGElement} svgElem
         * @returns {SVGBlock}
         */
        remove: function (svgElem) {
            if (!svgElem) {
                return;
            }

            if (svgElem.isActive && this.deactivateActiveElement) {
                this.deactivateActiveElement();
            }

            this.children.splice(this.children.indexOf(svgElem), 1);
            this.removeElem(svgElem.rootNode);
            svgElem.destroy();

            return this;
        },

        /**
         * Removes svg node
         *
         * @param {SVGNode} node
         */
        removeElem: function (node) {
            this.rootNode.removeChild(node);
        },

        /**
         * Hides an element and all children
         *
         * @override
         */
        hide: function () {
            this.__base();
            this.children.forEach(function (child) {
                child.hide();
            });
        },

        /**
         * Shows an element and all children
         *
         * @override
         */
        show: function () {
            this.__base();
            this.children.forEach(function (child) {
                child.show();
            });
        }
    };
}(svgext));
