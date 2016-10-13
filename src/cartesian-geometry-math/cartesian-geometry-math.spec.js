'use strict';

describe('cartesian-geometry-math.js', function () {
    var CGMath = svgext.CartesianGeometryMath;

    it('Finds distance between two points', function () {
        expect(CGMath.distanceBtwTwoPoints([50, 50], [50, 150])).toEqual(100);
    });

    it('Finds line segment middle point', function () {
        expect(CGMath.lineSegmentMidPoint([[50, 50], [50, 150]])).toEqual([50, 100]);
    });

    it('Checks if two lines aren\'t intersected', function () {
        expect(CGMath.checkLinesIntersection([[0, 0], [0, 50]], [[50, 0], [50, 50]])).toBeFalsy();
    });

    it('Checks if two lines are intersected', function () {
        expect(CGMath.checkLinesIntersection([[0, 0], [50, 50]], [[50, 0], [0, 50]])).toBeTruthy();
    });

    it('Finds polygon new vertex insert index', function () {
        expect(CGMath.findPolygonInsertIndex([50, 50, 50, 100, 100, 100, 100, 50], [75, 125])).toBe(2);
    });
});
