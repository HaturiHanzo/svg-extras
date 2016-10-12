/**
 * Defines CartesianGeometryMath class
 *
 * @name CartesianGeometryMath
 */

/**
 * @typedef {Array} Point
 * @prop {Number} Point[0] X coordinate
 * @prop {Number} Point[1] Y coordinate
 */

/**
 * @typedef {Array} LineSegment
 * @prop {Point} LineSegment[0]
 * @prop {Point} LineSegment[1]
 */
(function (svgext) {
    'use strict';

    svgext.CartesianGeometryMath = {

        /**
         * Counts distance between two points
         *
         * @param {Point} point1 First point
         * @param {Point} point2 First point
         * @returns {Number}
         */
        distanceBtwTwoPoints: function (point1, point2) {
            return Math.sqrt(
                Math.pow(point2[0] - point1[0], 2) +
                Math.pow(point2[1] - point1[1], 2)
            );
        },

        /**
         * Finds line segment middle point
         *
         * @param {LineSegment} lineSegment
         * @returns {Point}
         */
        lineSegmentMidPoint: function (lineSegment) {
            return [
                (lineSegment[0][0] + ((lineSegment[1][0] - lineSegment[0][0]) / 2)),
                (lineSegment[0][1] + (lineSegment[1][1] - lineSegment[0][1]) / 2)
            ];
        },

        /**
         * Checks if two lines segments are intersected
         *
         * @param {LineSegment} lS1
         * @param {LineSegment} lS2
         * @returns {Boolean}
         */
        checkLinesIntersection: function (lS1, lS2) {
            return this._arePointsCounterClockWise(lS1[0], lS2[0], lS2[1])
                !== this._arePointsCounterClockWise(lS1[1], lS2[0], lS2[1])
                && this._arePointsCounterClockWise(lS1[0], lS1[1], lS2[0])
                !== this._arePointsCounterClockWise(lS1[0], lS1[1], lS2[1]);
        },

        /**
         * Finds an index in the polygon points array between 2 nearest points
         * to the passed coordinates
         *
         * @param {Array} polygonPoints
         * @param {Point} point New vertex coordinates
         * @returns {Number}
         */
        findPolygonInsertIndex: function (polygonPoints, point) {
            var smallestDistance = 10000,
                result;

            // Findind the nearest pair
            this.generateLineSegments(polygonPoints).forEach(function (lineSegment, index) {
                var distance = this.distanceBtwTwoPoints(
                    this.lineSegmentMidPoint(lineSegment),
                    point
                );
                if (smallestDistance > distance) {
                    smallestDistance = distance;
                    result = index + 1;
                }
            }, this);

            return result;
        },


        /**
         * Generates line segments array based on passed coordinates
         *
         * @param {[Number]} points polygon vertexes coordinates
         * @returns {[LineSegment]}
         */
        generateLineSegments: function (points) {
            var lineSegments = [];
            // Generating sibling pairs
            for (var i = 0; i <= points.length - 4; i += 2) {
                lineSegments.push([
                    [points[i], points[i + 1]],
                    [points[i + 2], points[i + 3]]
                ]);
            }

            // Adding a pair from the first and the last elements
            lineSegments.push([
                [points[points.length - 2], points[points.length - 1]],
                [points[0], points[1]]
            ]);

            return lineSegments;
        },

        /**
         * Checks if three points are listed in a counterclockwise order
         *
         * @param {Point} p1
         * @param {Point} p2
         * @param {Point} p3
         * @private
         * @returns {Boolean}
         */
        _arePointsCounterClockWise: function (p1, p2, p3) {
            return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0]);
        }
    };
}(svgext));
