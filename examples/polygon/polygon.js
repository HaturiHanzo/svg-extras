'use strict';

var polygonCtrl = {
    /**
     * Creates a container
     */
    createContainer: function () {
        this.container = new svgext.SVGContainer({
            node: document.getElementById('svg__polygon'),
            cssClass: 'svg-container_fluid'
        });
        document.querySelector('.container').appendChild(this.container.node);
    },

    /**
     * Creates new polygon
     *
     * @returns {SVGPolygon}
     */
    createPolygon: function () {
        var containerRect = this.container.getRect(),
            points = [
                (1 / 4) * containerRect.width, (1 / 4) * containerRect.height,
                (3 / 4) * containerRect.width, (1 / 4) * containerRect.height,
                (3 / 4) * containerRect.width, (3 / 4) * containerRect.height,
                (1 / 4) * containerRect.width, (3 / 4) * containerRect.height
            ],
            polygon = new svgext.SVGPolygon({points: points});
        this.container.append(polygon);

        return polygon.select();
    },

    /**
     * Removes active polygon
     */
    removeActive: function () {
        this.container.removeActiveInstance(svgext.SVGPolygon);
    },

    /**
     * Removes all instances
     */
    removeAll: function () {
        this.container.removeAllInstances(svgext.SVGPolygon);
    },

    /**
     * Logs active polygon points
     */
    logActive: function () {
        document.querySelector('.log').innerHTML = this.container.getActiveElement().getValue();
    },

    /**
     * Logs all polygons points
     */
    logAll: function () {
        document.querySelector('.log').innerHTML = this.container.getInstances(svgext.SVGPolygon).map(function (pol) {
            return pol.getValue(true) + '<br>';
        });
    },

    /**
     * Checks all polygons and highlights last complex
     */
    checkAll: function () {
        var atleastOneComplex = this.container.getInstances(svgext.SVGPolygon).some(function (polygon) {
            return !polygon.isSimple(true);
        });

        document.querySelector('.log').innerHTML = 'There is at least one complex polygon: ' + atleastOneComplex;
    }
};

document.addEventListener('DOMContentLoaded', polygonCtrl.createContainer.bind(polygonCtrl));