'use strict';

var borderedRectCtrl = {
    /**
     * Creates a container
     */
    createContainer: function () {
        this.container = new svgext.SVGContainer().addClass('svg-container_fluid');
        document.querySelector('.container').appendChild(this.container.node);
    },

    /**
     * Creates new rectangle
     *
     * @returns {SVGBorderedRect}
     */
    createRect: function () {
        var containerRect = this.container.getRect(),
            rect = new svgext.SVGBorderedRect({
                x: (1 / 4) * containerRect.width,
                y: (1 / 4) * containerRect.height,
                width: (1 / 2) * containerRect.width,
                height: (1 / 2) * containerRect.height
            });
        this.container.append(rect);

        return rect.select();
    },

    /**
     * Removes active rectangle
     */
    removeActive: function () {
        this.container.removeActiveInstance(svgext.SVGBorderedRect);
    },

    /**
     * Removes all instances
     */
    removeAll: function () {
        this.container.removeAllInstances(svgext.SVGBorderedRect);
    },

    /**
     * Logs active rectangle
     */
    logActive: function () {
        document.querySelector('.log').innerHTML = JSON.stringify(this.container.getActiveElement().getValue(false));
    },

    /**
     * Logs all rectangles
     */
    logAll: function () {
        document.querySelector('.log').innerHTML = this.container.getInstances(svgext.SVGBorderedRect)
            .map(function (rect) {
                return JSON.stringify(rect.getValue(false)) + '<br>';
            });
    }
};

document.addEventListener('DOMContentLoaded', borderedRectCtrl.createContainer.bind(borderedRectCtrl));