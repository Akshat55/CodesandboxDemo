var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Events, Roles, ColorClassNameTypes, RenderTypes, Alignments, } from '../../interfaces';
import { Tools } from '../../tools';
import { radialLabelPlacement, radToDeg, polarToCartesianCoords, distanceBetweenPointOnCircAndVerticalDiameter, } from '../../services/angle-utils';
import * as Configuration from '../../configuration';
// D3 Imports
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max, min, extent } from 'd3-array';
import { lineRadial, curveLinearClosed } from 'd3-shape';
var Radar = /** @class */ (function (_super) {
    __extends(Radar, _super);
    function Radar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'radar';
        _this.renderType = RenderTypes.SVG;
        // append temporarily the label to get the exact space that it occupies
        _this.getLabelDimensions = function (label) {
            var tmpTick = DOMUtils.appendOrSelect(_this.getComponentContainer(), "g.tmp-tick");
            var tmpTickText = DOMUtils.appendOrSelect(tmpTick, "text").text(label);
            var _a = DOMUtils.getSVGElementSize(tmpTickText.node(), { useBBox: true }), width = _a.width, height = _a.height;
            tmpTick.remove();
            return { width: width, height: height };
        };
        // Given a flat array of objects, if there are missing data on key,
        // creates corresponding data with value = null
        _this.normalizeFlatData = function (dataset) {
            var options = _this.getOptions();
            var _a = Tools.getProperty(options, 'radar', 'axes'), angle = _a.angle, value = _a.value;
            var groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
            var completeBlankData = Tools.flatMapDeep(_this.uniqueKeys.map(function (key) {
                return _this.uniqueGroups.map(function (group) {
                    var _a;
                    return (_a = {},
                        _a[angle] = key,
                        _a[groupMapsTo] = group,
                        _a[value] = null,
                        _a);
                });
            }));
            return Tools.merge(completeBlankData, dataset);
        };
        // Given a a grouped array of objects, if there are missing data on key,
        // creates corresponding data with value = null
        _this.normalizeGroupedData = function (dataset) {
            var options = _this.getOptions();
            var _a = Tools.getProperty(options, 'radar', 'axes'), angle = _a.angle, value = _a.value;
            var groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
            return dataset.map(function (_a) {
                var name = _a.name, data = _a.data;
                var completeBlankData = _this.uniqueKeys.map(function (k) {
                    var _a;
                    return (_a = {},
                        _a[groupMapsTo] = name,
                        _a[angle] = k,
                        _a[value] = null,
                        _a);
                });
                return { name: name, data: Tools.merge(completeBlankData, data) };
            });
        };
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent
                .selectAll('g.blobs path')
                .transition('legend-hover-blob')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-hover-blob',
                });
            })
                .style('fill-opacity', function (group) {
                if (group.name !== hoveredElement.datum().name) {
                    return Configuration.radar.opacity.unselected;
                }
                return Configuration.radar.opacity.selected;
            })
                .style('stroke-opacity', function (group) {
                if (group.name !== hoveredElement.datum().name) {
                    return Configuration.radar.opacity.unselected;
                }
                return 1;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('g.blobs path')
                .transition('legend-mouseout-blob')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-mouseout-blob',
                });
            })
                .style('fill-opacity', Configuration.radar.opacity.selected)
                .style('stroke-opacity', 1);
        };
        return _this;
    }
    Radar.prototype.init = function () {
        var events = this.services.events;
        // Highlight correct line legend item hovers
        events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight lines on legend item mouseouts
        events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Radar.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getComponentContainer();
        var _a = DOMUtils.getSVGElementSize(svg, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        var data = this.model.getData();
        var groupedData = this.model.getGroupedData();
        var options = this.getOptions();
        var groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
        var valueMapsTo = Tools.getProperty(options, 'radar', 'axes', 'value');
        var _b = Tools.getProperty(options, 'radar', 'axes'), angle = _b.angle, value = _b.value;
        var _c = Configuration.radar, xLabelPadding = _c.xLabelPadding, yLabelPadding = _c.yLabelPadding, yTicksNumber = _c.yTicksNumber, minRange = _c.minRange, xAxisRectHeight = _c.xAxisRectHeight;
        this.uniqueKeys = Array.from(new Set(data.map(function (d) { return d[angle]; })));
        this.uniqueGroups = Array.from(new Set(data.map(function (d) { return d[groupMapsTo]; })));
        this.fullDataNormalized = this.normalizeFlatData(data);
        this.groupedDataNormalized = this.normalizeGroupedData(groupedData);
        var labelHeight = this.getLabelDimensions(this.uniqueKeys[0]).height;
        var margin = 2 * (labelHeight + yLabelPadding);
        var size = Math.min(width, height);
        var diameter = size - margin;
        var radius = diameter / 2;
        if (radius <= 0) {
            return;
        }
        // given a key, return the corresponding angle in radiants
        // rotated by -PI/2 because we want angle 0° at -y (12 o’clock)
        var xScale = scaleBand()
            .domain(this.fullDataNormalized.map(function (d) { return d[angle]; }))
            .range([0, 2 * Math.PI].map(function (a) { return a - Math.PI / 2; }));
        var centerPointMinValue = min(this.fullDataNormalized.map(function (d) { return d[value]; }));
        var yScale = scaleLinear()
            .domain([
            centerPointMinValue >= 0 ? 0 : centerPointMinValue,
            max(this.fullDataNormalized.map(function (d) { return d[value]; })),
        ])
            .range([minRange, radius])
            .nice(yTicksNumber);
        var yTicks = yScale.ticks(yTicksNumber);
        var colorScale = function (group) {
            return _this.model.getFillColor(group);
        };
        // constructs a new radial line generator
        // the angle accessor returns the angle in radians with 0° at -y (12 o’clock)
        // so map back the angle
        var radialLineGenerator = lineRadial()
            .angle(function (d) { return xScale(d[angle]) + Math.PI / 2; })
            .radius(function (d) { return yScale(d[value]); })
            .curve(curveLinearClosed);
        // compute the space that each x label needs
        var horizSpaceNeededByEachXLabel = this.uniqueKeys.map(function (key) {
            var tickWidth = _this.getLabelDimensions(key).width;
            // compute the distance between the point that the label rapresents and the vertical diameter
            var distanceFromDiameter = distanceBetweenPointOnCircAndVerticalDiameter(xScale(key), radius);
            // the space each label occupies is the sum of these two values
            return tickWidth + distanceFromDiameter;
        });
        var leftPadding = max(horizSpaceNeededByEachXLabel);
        // center coordinates
        var c = {
            x: leftPadding + xLabelPadding,
            y: height / 2,
        };
        /////////////////////////////
        // Drawing the radar
        /////////////////////////////
        // y axes
        var yAxes = DOMUtils.appendOrSelect(svg, 'g.y-axes').attr('role', Roles.GROUP);
        var yAxisUpdate = yAxes
            .selectAll('path')
            .data(yTicks, function (tick) { return tick; });
        // for each tick, create array of data corresponding to the points composing the shape
        var shapeData = function (tick) {
            return _this.uniqueKeys.map(function (key) {
                var _a;
                return (_a = {}, _a[angle] = key, _a[value] = tick, _a);
            });
        };
        yAxisUpdate.join(function (enter) {
            return enter
                .append('path')
                .attr('opacity', 0)
                .attr('transform', "translate(" + c.x + ", " + c.y + ")")
                .attr('fill', 'none')
                .call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_axes_enter',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('d', function (tick) {
                    return radialLineGenerator(shapeData(tick));
                });
            });
        }, function (update) {
            return update.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_axes_update',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('transform', "translate(" + c.x + ", " + c.y + ")")
                    .attr('d', function (tick) {
                    return radialLineGenerator(shapeData(tick));
                });
            });
        }, function (exit) {
            return exit.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_axes_exit',
                        animate: animate,
                    });
                })
                    .attr('d', function (tick) {
                    return radialLineGenerator(shapeData(tick));
                })
                    .attr('opacity', 0)
                    .remove();
            });
        });
        // x axes
        var xAxes = DOMUtils.appendOrSelect(svg, 'g.x-axes').attr('role', Roles.GROUP);
        var xAxisUpdate = xAxes
            .selectAll('line')
            .data(this.uniqueKeys, function (key) { return key; });
        xAxisUpdate.join(function (enter) {
            return enter
                .append('line')
                .attr('opacity', 0)
                .attr('class', function (key) { return "x-axis-" + Tools.kebabCase(key); }) // replace spaces with -
                .attr('stroke-dasharray', '0')
                .attr('x1', function (key) { return polarToCartesianCoords(xScale(key), 0, c).x; })
                .attr('y1', function (key) { return polarToCartesianCoords(xScale(key), 0, c).y; })
                .attr('x2', function (key) { return polarToCartesianCoords(xScale(key), 0, c).x; })
                .attr('y2', function (key) { return polarToCartesianCoords(xScale(key), 0, c).y; })
                .call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_axes_enter',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('x1', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[0], c).x;
                })
                    .attr('y1', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[0], c).y;
                })
                    .attr('x2', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1], c).x;
                })
                    .attr('y2', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1], c).y;
                });
            });
        }, function (update) {
            return update.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_axes_update',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('x1', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[0], c).x;
                })
                    .attr('y1', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[0], c).y;
                })
                    .attr('x2', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1], c).x;
                })
                    .attr('y2', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1], c).y;
                });
            });
        }, function (exit) {
            return exit.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_axes_exit',
                        animate: animate,
                    });
                })
                    .attr('opacity', 0)
                    .remove();
            });
        });
        // x labels
        var xLabels = DOMUtils.appendOrSelect(svg, 'g.x-labels').attr('role', Roles.GROUP);
        var xLabelUpdate = xLabels.selectAll('text').data(this.uniqueKeys);
        xLabelUpdate.join(function (enter) {
            return enter
                .append('text')
                .text(function (key) { return key; })
                .attr('opacity', 0)
                .attr('x', function (key) {
                return polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).x;
            })
                .attr('y', function (key) {
                return polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).y;
            })
                .style('text-anchor', function (key) { return radialLabelPlacement(xScale(key)).textAnchor; })
                .style('dominant-baseline', function (key) {
                return radialLabelPlacement(xScale(key)).dominantBaseline;
            })
                .call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_labels_enter',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1);
            });
        }, function (update) {
            return update.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_labels_update',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('x', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).x;
                })
                    .attr('y', function (key) {
                    return polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).y;
                });
            });
        }, function (exit) {
            return exit.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_x_labels_exit',
                        animate: animate,
                    });
                })
                    .attr('opacity', 0)
                    .remove();
            });
        });
        // blobs
        var blobs = DOMUtils.appendOrSelect(svg, 'g.blobs').attr('role', Roles.GROUP);
        var blobUpdate = blobs
            .selectAll('path')
            .data(this.groupedDataNormalized, function (group) { return group.name; });
        blobUpdate.join(function (enter) {
            return enter
                .append('path')
                .attr('class', function (group) {
                return _this.model.getColorClassName({
                    classNameTypes: [
                        ColorClassNameTypes.FILL,
                        ColorClassNameTypes.STROKE,
                    ],
                    dataGroupName: group.name,
                    originalClassName: 'blob',
                });
            })
                .attr('role', Roles.GRAPHICS_SYMBOL)
                .attr('aria-label', function (d) { return d['name']; })
                .attr('opacity', 0)
                .attr('transform', animate
                ? function () {
                    return "translate(" + c.x + ", " + c.y + ") scale(" + (1 + Math.random() * 0.35) + ")";
                }
                : "translate(" + c.x + ", " + c.y + ")")
                .style('fill', function (group) { return colorScale(group.name); })
                .style('fill-opacity', Configuration.radar.opacity.selected)
                .style('stroke', function (group) { return colorScale(group.name); })
                .call(function (selection) {
                var selectionUpdate = selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_blobs_enter',
                        animate: animate,
                    });
                });
                if (animate) {
                    selectionUpdate
                        .delay(function () { return Math.random() * 30; })
                        .attr('transform', "translate(" + c.x + ", " + c.y + ")");
                }
                selectionUpdate
                    .attr('opacity', 1)
                    .attr('d', function (group) {
                    return radialLineGenerator(group.data);
                });
            });
        }, function (update) {
            update
                .attr('class', function (group) {
                return _this.model.getColorClassName({
                    classNameTypes: [
                        ColorClassNameTypes.FILL,
                        ColorClassNameTypes.STROKE,
                    ],
                    dataGroupName: group.name,
                    originalClassName: 'blob',
                });
            })
                .style('fill', function (group) { return colorScale(group.name); })
                .style('stroke', function (group) { return colorScale(group.name); });
            update.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_blobs_update',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1)
                    .attr('transform', "translate(" + c.x + ", " + c.y + ")")
                    .attr('d', function (group) { return radialLineGenerator(group.data); });
            });
        }, function (exit) {
            return exit.call(function (selection) {
                var selectionUpdate = selection.transition().call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_blobs_exit',
                        animate: animate,
                    });
                });
                if (animate) {
                    selectionUpdate
                        .delay(function () { return Math.random() * 30; })
                        .attr('transform', function () {
                        return "translate(" + c.x + ", " + c.y + ") scale(" + (1 + Math.random() * 0.35) + ")";
                    });
                }
                selectionUpdate.attr('opacity', 0).remove();
            });
        });
        // data dots
        var dots = DOMUtils.appendOrSelect(svg, 'g.dots').attr('role', Roles.GROUP);
        var dotsUpdate = dots
            .selectAll('circle')
            // Filter out dots with no value so they are not rendered
            .data(this.fullDataNormalized.filter(function (d) { return Tools.getProperty(d, value) !== null; }));
        dotsUpdate
            .join(function (enter) {
            return enter
                .append('circle')
                .attr('role', Roles.GRAPHICS_SYMBOL)
                .attr('aria-label', function (d) { return d[valueMapsTo]; });
        }, function (update) { return update; }, function (exit) { return exit.remove(); })
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d[groupMapsTo],
                originalClassName: Tools.kebabCase(d[angle]),
            });
        })
            .attr('cx', function (d) {
            return polarToCartesianCoords(xScale(d[angle]), yScale(d[value]), c).x;
        })
            .attr('cy', function (d) {
            return polarToCartesianCoords(xScale(d[angle]), yScale(d[value]), c).y;
        })
            .attr('r', 0)
            .attr('opacity', 0)
            .style('fill', function (d) { return colorScale(d[groupMapsTo]); });
        // rectangles
        var xAxesRect = DOMUtils.appendOrSelect(svg, 'g.x-axes-rect').attr('role', Roles.GROUP);
        var xAxisRectUpdate = xAxesRect
            .selectAll('rect')
            .data(this.uniqueKeys);
        xAxisRectUpdate
            .join(function (enter) { return enter.append('rect'); }, function (update) { return update; }, function (exit) { return exit.remove(); })
            .attr('x', c.x)
            .attr('y', c.y - xAxisRectHeight / 2)
            .attr('width', yScale.range()[1])
            .attr('height', xAxisRectHeight)
            .style('fill', 'red')
            .style('fill-opacity', 0)
            .attr('transform', function (key) { return "rotate(" + radToDeg(xScale(key)) + ", " + c.x + ", " + c.y + ")"; });
        // y labels (show only the min and the max labels)
        var yLabels = DOMUtils.appendOrSelect(svg, 'g.y-labels').attr('role', Roles.GROUP);
        var yLabelUpdate = yLabels.selectAll('text').data(extent(yTicks));
        yLabelUpdate.join(function (enter) {
            return enter
                .append('text')
                .attr('opacity', 0)
                .text(function (tick) { return tick; })
                .attr('x', function (tick) {
                return polarToCartesianCoords(-Math.PI / 2, yScale(tick), c).x + yLabelPadding;
            })
                .attr('y', function (tick) {
                return polarToCartesianCoords(-Math.PI / 2, yScale(tick), c).y;
            })
                .style('text-anchor', 'start')
                .style('dominant-baseline', 'middle')
                .call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_labels_enter',
                        animate: animate,
                    });
                })
                    .attr('opacity', 1);
            });
        }, function (update) {
            return update.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_labels_update',
                        animate: animate,
                    });
                })
                    .text(function (tick) { return tick; })
                    .attr('opacity', 1)
                    .attr('x', function (tick) {
                    return polarToCartesianCoords(-Math.PI / 2, yScale(tick), c).x + yLabelPadding;
                })
                    .attr('y', function (tick) {
                    return polarToCartesianCoords(-Math.PI / 2, yScale(tick), c).y;
                });
            });
        }, function (exit) {
            return exit.call(function (selection) {
                return selection
                    .transition()
                    .call(function (t) {
                    return _this.services.transitions.setupTransition({
                        transition: t,
                        name: 'radar_y_labels_exit',
                        animate: animate,
                    });
                })
                    .attr('opacity', 0)
                    .remove();
            });
        });
        var alignment = Tools.getProperty(options, 'radar', 'alignment');
        var alignmentXOffset = this.getAlignmentXOffset(alignment, svg, this.getParent());
        svg.attr('x', alignmentXOffset);
        // Add event listeners
        this.addEventListeners();
    };
    Radar.prototype.getAlignmentXOffset = function (alignment, svg, parent) {
        var svgDimensions = DOMUtils.getSVGElementSize(svg, {
            useBBox: true,
        });
        var width = DOMUtils.getSVGElementSize(parent, {
            useAttrs: true,
        }).width;
        var alignmentOffset = 0;
        if (alignment === Alignments.CENTER) {
            alignmentOffset = Math.floor((width - svgDimensions.width) / 2);
        }
        else if (alignment === Alignments.RIGHT) {
            alignmentOffset = width - svgDimensions.width;
        }
        return alignmentOffset;
    };
    Radar.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('.x-axes-rect > rect')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Radar.prototype.addEventListeners = function () {
        var self = this;
        var angle = Tools.getProperty(this.getOptions(), 'radar').axes.angle;
        // events on x axes rects
        this.parent
            .selectAll('.x-axes-rect > rect')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            var axisLine = self.parent.select(".x-axes .x-axis-" + Tools.kebabCase(datum));
            var dots = self.parent.selectAll(".dots circle." + Tools.kebabCase(datum));
            // Change style
            axisLine
                .classed('hovered', true)
                .attr('stroke-dasharray', '4 4');
            dots.classed('hovered', true)
                .attr('opacity', 1)
                .attr('r', Configuration.radar.dotsRadius);
            // get the items that should be highlighted
            var itemsToHighlight = self.fullDataNormalized.filter(function (d) { return d[angle] === datum; });
            var options = self.getOptions();
            var groupMapsTo = options.data.groupMapsTo;
            var valueMapsTo = Tools.getProperty(options, 'radar', 'axes', 'value');
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                event: event,
                hoveredElement: hoveredElement,
                items: itemsToHighlight
                    .filter(function (datum) { return typeof datum[valueMapsTo] === 'number'; })
                    .map(function (datum) { return ({
                    label: datum[groupMapsTo],
                    value: datum[valueMapsTo],
                    color: self.model.getFillColor(datum[groupMapsTo]),
                    class: self.model.getColorClassName({
                        classNameTypes: [ColorClassNameTypes.TOOLTIP],
                        dataGroupName: datum[groupMapsTo],
                    }),
                }); }),
            });
        })
            .on('mousemove', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEMOVE, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('click', function (event, datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Radar.X_AXIS_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            var axisLine = self.parent.select(".x-axes .x-axis-" + Tools.kebabCase(datum));
            var dots = self.parent.selectAll(".dots circle." + Tools.kebabCase(datum));
            // Change style
            axisLine
                .classed('hovered', false)
                .attr('stroke-dasharray', '0');
            dots.classed('hovered', false).attr('opacity', 0).attr('r', 0);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE);
        });
    };
    return Radar;
}(Component));
export { Radar };
//# sourceMappingURL=../../../src/components/graphs/radar.js.map