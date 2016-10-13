'use strict';

var resizableRectCtrl = {
    /**
     * Creates a container
     */
    createContainer: function () {
        this.container = new svgext.SVGContainer();
        document.querySelector('.container').appendChild(this.container.node);
    },

    /**
     * Creates new rectangle
     *
     * @returns {SVGResizableRect}
     */
    createPolygon: function () {
        var containerRect = this.container.getRect(),
            rect = new svgext.SVGResizableRect({
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
        this.container.removeActiveInstance(svgext.SVGResizableRect);
    },

    /**
     * Removes all instances
     */
    removeAll: function () {
        this.container.removeAllInstances(svgext.SVGResizableRect);
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
        document.querySelector('.log').innerHTML = this.container.getInstances(svgext.SVGResizableRect)
            .map(function (rect) {
                return JSON.stringify(rect.getValue(false)) + '<br>';
            });
    }
};

document.addEventListener('DOMContentLoaded', resizableRectCtrl.createContainer.bind(resizableRectCtrl));