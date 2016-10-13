/**
 * Defines SVGPolygon class
 *
 * @name SVGPolygon
 */

/**
 * Defines polygon constructor options
 *
 * @typedef {Object} polygonOpts
 * @prop {Array} points
 * @prop {String} [cssClass='svg-polygon'] CSS classes separated by space
 * @prop {Boolean} [isDraggable=true]
 */
(function (svgext) {
    'use strict';

    svgext.SVGPolygon = inherit([svgext.SVGElement, svgext.SVGBlock, svgext.SVGDraggable], {

        /**
         * SVGPolygon class constructor
         *
         * @param {polygonOpts} [opts]
         * @constructor
         */
        __constructor: function (opts) {
            opts = opts || {};
            opts.cssClass = opts.cssClass || 'svg-polygon';
            this.__base(opts, 'polygon');
            this.rootNode = this.createElem('g');
            this.appendElem(this.node);
            if (opts.points) {
                this.setPoints(opts.points);
            }
            this.on(svgext._isTouchDevice ? 'touchstart' : 'mousedown', this.select.bind(this));
        },

        /**
         * Adds double click event listener to the container
         *
         * @override {SVGElement}
         */
        onAppend: function (container) {
            this.__base(container);
            this._onContainerDblClick = this._onContainerDblClick.bind(this);
            if (svgext._isTouchDevice) {
                return this._onContainerDblClick = this.container.onDoubleTap(this._onContainerDblClick);
            }

            this.container.on('dblclick', this._onContainerDblClick);
        },

        /**
         * Removes double click event listener from the container & destroys a polygon
         *
         * @override {SVGElement}
         */
        destroy: function () {
            if (svgext._isTouchDevice) {
                this.container.offDoubleTap(this._onContainerDblClick);
            } else {
                this.container.off('dblclick', this._onContainerDblClick);
            }

            this.__base();
        },

        /**
         * SVGPolygon points setter
         *
         * @param {Array} points SVGPolygon points
         * @returns {SVGPolygon}
         */
        setPoints: function (points) {
            if (points && Array.isArray(points) && points.length % 2 === 0) {
                if (this.vertexes) {
                    this.vertexes.forEach(this.remove, this);
                }
                this.vertexes = [];
                for (var i = 0; i < points.length - 1; i += 2) {
                    this.vertexes.push(this._createVertex([points[i], points[i + 1]]));
                }
                this.render();
            }

            return this;
        },

        /**
         * Renders a polygon based on vertexes coordinates
         *
         * @returns {SVGPolygon}
         */
        render: function () {
            this.attr('points', this.vertexes.reduce(function (all, vertex) {
                all.push(vertex.getX() + ',' + vertex.getY());
                return all;
            }, []).join(' '));

            return this;
        },

        /**
         * Adds a point to the polygon between two nearest points
         *
         * @param {Point} point
         * @returns {SVGPolygon}
         */
        addPoint: function (point) {
            var points = this.getValue(false);
            if (points && points.length) {
                var vertex = this._createVertex(point).addClass('active');
                this.vertexes.splice(
                    svgext.CartesianGeometryMath.findPolygonInsertIndex(points, point), 0, vertex
                );
                this.render();
            }

            return this;
        },

        /**
         * SVGDraggable normalizeCoords implementation
         *
         * @override {SVGDraggable}
         */
        normalizeCoords: function (delta) {
            this.vertexes.forEach(function (vertex) {
                delta = vertex.normalizeCoords(delta);
            });

            return delta;
        },

        /**
         * SVGDraggable drag implementation
         *
         * @override {SVGDraggable}
         */
        drag: function (delta) {
            this.vertexes.forEach(function (vertex) {
                vertex.setX(vertex.getX() + delta.x);
                vertex.setY(vertex.getY() + delta.y);
            });
            this.render();
        },

        /**
         * Activates polygon
         *
         * @override {SVGElement}
         * @returns {SVGPolygon}
         */
        activate: function () {
            this.__base();
            this.vertexes.forEach(function (vertex) {
                vertex.activate();
            });
            this.bringToFront();

            return this;
        },

        /**
         * Deactivates polygon
         *
         * @override {SVGElement}
         * @returns {SVGPolygon}
         */
        deactivate: function () {
            this.__base();
            this.vertexes.forEach(function (vertex) {
                vertex.deactivate();
            });

            return this;
        },

        /**
         * Checks if polygon doesn't intersect itself
         *
         * @param {Boolean} [highlight=false] Highlights polygon if it is complex
         * @returns {Boolean}
         */
        isSimple: function (highlight) {
            var lineSegments = svgext.CartesianGeometryMath.generateLineSegments(this.getValue(false)),
                lineSegmentsLen = lineSegments.length;

            for (var i = 0; i < lineSegmentsLen - 2; i++) {
                for (var j = i + 2; j < lineSegmentsLen - (i > 0 ? 0 : 1); j++) {
                    if (svgext.CartesianGeometryMath.checkLinesIntersection(lineSegments[i], lineSegments[j])) {
                        if (highlight) {
                            this.select();
                        }

                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Polygon coordinates getter
         *
         * @param {Boolean} [relative=false]
         * @returns {*}
         */
        getValue: function (relative) {
            var containerSize = this.getContainerRect();

            return this.vertexes.reduce(function (all, vertex) {
                if (relative) {
                    all.push(
                        vertex.getX() / containerSize.width,
                        vertex.getY() / containerSize.height
                    );
                } else {
                    all.push(vertex.getX(), vertex.getY());
                }

                return all;
            }, []);
        },

        /**
         * Resizes polygon
         *
         * @param {Number} widthFactor width resize factor
         * @param {Number} heightFactor height resize factor
         */
        resize: function (widthFactor, heightFactor) {
            this.vertexes.forEach(function (vertex) {
                vertex.setX(vertex.getX() * widthFactor);
                vertex.setY(vertex.getY() * heightFactor);
            });
            this.render();
        },


        /**
         * Activates polygon
         *
         * @returns {SVGPolygon}
         */
        select: function () {
            this.container.setActiveElement(this);

            return this;
        },

        /**
         * Removes polygon vetex
         *
         * @param {SVGPolygonVertex} vertex
         * @private
         */
        _removeVertex: function (vertex) {
            if (this.vertexes.length < 4) {
                return;
            }
            this.vertexes.splice(this.vertexes.indexOf(vertex), 1);
            this.remove(vertex).render();
        },

        /**
         * Creates a new vertex
         *
         * @param {Point} point
         * @private
         * @returns {SVGPolygonVertex}
         */
        _createVertex: function (point) {
            var vertex = new svgext.SVGPolygonVertex({
                    width: svgext.default.vertexWidth,
                    height: svgext.default.vertexHeight,
                    x: point[0],
                    y: point[1],
                    cssClass: 'svg-polygon-vertex'
                }),
                removeVertex = function (event) {
                    this._removeVertex(vertex);
                    event.stopPropagation();
                }.bind(this);

            this.append(vertex);
            if (svgext._isTouchDevice) {
                vertex.onDoubleTap(removeVertex);
            } else {
                vertex.on('dblclick', removeVertex);
            }

            return vertex;
        },

        /**
         * SVG container double click event handler, adds a new vertex to the polygon
         *
         * @param {Event} event
         * @private
         */
        _onContainerDblClick: function (event) {
            if (!this.isActive) {
                return;
            }

            var removedNearPoint,
                containerRect = this.getContainerRect(),
                point = svgext._isTouchDevice ? [
                    event.changedTouches[0].clientX - containerRect.left,
                    event.changedTouches[0].clientY - containerRect.top
                ] : [
                    event.offsetX, event.offsetY
                ];

            removedNearPoint = this.vertexes.some(function (vertex) {
                var dist = svgext.CartesianGeometryMath.distanceBtwTwoPoints([
                    vertex.getX() + vertex.width() / 2,
                    vertex.getY() + vertex.height() / 2
                ], point);
                if (dist < svgext.default.polygonAddPointDist) {
                    this._removeVertex(vertex);

                    return true;
                }
            }, this);

            if (removedNearPoint) {
                return;
            }

            this.addPoint(point);
        }
    });

}(svgext));
