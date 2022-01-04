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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import * as Configuration from '../../configuration';
import { ColorClassNameTypes, Events, RenderTypes, } from '../../interfaces/enums';
import { Tools } from './../../tools';
// D3 Imports
import { hierarchy as d3Hierarchy, pack as D3Pack } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { get } from 'lodash-es';
var CirclePack = /** @class */ (function (_super) {
    __extends(CirclePack, _super);
    function CirclePack() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'circle-pack';
        _this.renderType = RenderTypes.SVG;
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent
                .selectAll('circle.node')
                .transition('legend-hover-circlepack')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-hover-circlepack',
                });
            })
                .attr('opacity', function (d) {
                return d.data.dataGroupName === hoveredElement.datum()['name']
                    ? 1
                    : Configuration.circlePack.circles.fillOpacity;
            });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('circle.node')
                .transition('legend-mouseout-circlepack')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-mouseout-circlepack',
                });
            })
                .attr('opacity', 1);
        };
        return _this;
    }
    CirclePack.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        // svg and container widths
        var svg = this.getComponentContainer({ withinChartClip: true });
        var _a = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        // Because of a Firefox bug with regards to sizing & d3 packs,
        // rather than checking if height or width aren't 0,
        // we have to make sure they're not smaller than 1
        if (width < 1 || height < 1) {
            // on first render the svg is width and height 0
            // the circle packing layout functionality will not run
            return;
        }
        // data and options (zoom/not zoom)
        var displayData = this.model.getDisplayData();
        // check if there is just one parent for the data
        var parentNode = this.model.hasParentNode();
        var hierarchyLevel = this.model.getHierarchyLevel();
        var options = this.getOptions();
        var canvasZoomEnabled = Tools.getProperty(options, 'canvasZoom', 'enabled');
        // check if there is one root for the data
        // that root will be the only datagroup (colorscale will be monochrome)
        if (parentNode && Tools.getProperty(displayData, 0, 'children')) {
            // remove want to remove the parent from being rendered
            displayData = Tools.getProperty(displayData, 0, 'children');
        }
        var root = d3Hierarchy({ children: displayData })
            .sum(function (d) { return d.value; })
            .sort(function (a, b) { return b.value - a.value; });
        var packLayout = D3Pack()
            .size([width, height])
            .padding(function (d) {
            // add 3 px to account for the stroke width 1.5px
            return d.depth >= 1
                ? Configuration.circlePack.padding.children + 3
                : Configuration.circlePack.padding.mainGroup + 3;
        });
        var nodeData = packLayout(root)
            .descendants()
            .splice(1)
            .filter(function (node) {
            // filter based on hierarchy level
            return node.depth <= hierarchyLevel;
        });
        // enter the circles
        var circles = svg.selectAll('circle.node').data(nodeData);
        circles.exit().attr('width', 0).attr('height', 0).remove();
        var enteringCircles = circles
            .enter()
            .append('circle')
            .classed('node', true);
        enteringCircles
            .merge(circles)
            .attr('class', function (d) {
            var originalClass = canvasZoomEnabled && hierarchyLevel === 3
                ? _this.getZoomClass(d)
                : '';
            return _this.model.getColorClassName({
                classNameTypes: [
                    ColorClassNameTypes.FILL,
                    ColorClassNameTypes.STROKE,
                ],
                dataGroupName: d.data.dataGroupName,
                originalClassName: d.children
                    ? "node " + originalClass
                    : "node node-leaf " + originalClass,
            });
        })
            .style('fill', function (d) { return _this.model.getFillColor(d.data.dataGroupName); })
            .style('stroke', function (d) {
            return _this.model.getFillColor(d.data.dataGroupName);
        })
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .transition('circlepack-leaf-update-enter')
            .call(function (t) {
            return _this.services.transitions.setupTransition({
                transition: t,
                name: 'circlepack-leaf-update-enter',
            });
        })
            .attr('r', function (d) { return d.r; })
            .attr('opacity', 1)
            .attr('fill-opacity', Configuration.circlePack.circles.fillOpacity);
        if (canvasZoomEnabled === true && this.focal) {
            this.services.canvasZoom.zoomIn(this.focal, enteringCircles, Configuration.canvasZoomSettings);
            this.setBackgroundListeners();
        }
        if (!parentNode) {
            // add legend filtering if it isnt a monochrome chart
            this.addLegendListeners();
        }
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    // turn off the highlight class on children circles
    CirclePack.prototype.unhighlightChildren = function (childData) {
        var _this = this;
        var data = childData.map(function (d) { return d.data; });
        this.parent
            .selectAll('circle.node')
            .filter(function (d) { return data.some(function (datum) { return datum === d.data; }) && d.depth > 1; })
            .style('stroke', function (d) {
            return _this.model.getFillColor(d.data.dataGroupName);
        });
    };
    // highlight the children circles with a stroke
    CirclePack.prototype.highlightChildren = function (childData) {
        var data = childData.map(function (d) { return d.data; });
        this.parent
            .selectAll('circle.node')
            .filter(function (d) { return data.some(function (datum) { return datum === d.data; }) && d.depth > 1; })
            .style('stroke', Configuration.circlePack.circles.hover.stroke);
    };
    CirclePack.prototype.getZoomClass = function (node) {
        if (this.model.getHierarchyLevel() === 3 && this.focal) {
            if (node.data === this.focal.data ||
                this.focal.children.some(function (d) { return d.data === node.data; })) {
                return 'focal';
            }
        }
        return 'non-focal';
    };
    CirclePack.prototype.addLegendListeners = function () {
        var events = this.services.events;
        // Highlight correct circle on legend item hovers
        events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    CirclePack.prototype.removeBackgroundListeners = function () {
        var chartSvg = select(this.services.domUtils.getMainContainer());
        chartSvg.on('click', function () { return null; });
    };
    CirclePack.prototype.setBackgroundListeners = function () {
        var chartSvg = select(this.services.domUtils.getMainContainer());
        var self = this;
        var canvasSelection = this.parent.selectAll('circle.node');
        var zoomSetting = Tools.getProperty(Configuration, 'canvasZoomSettings');
        chartSvg.on('click', function () {
            self.focal = null;
            self.model.updateHierarchyLevel(2);
            chartSvg.classed('zoomed-in', false);
            self.services.canvasZoom.zoomOut(canvasSelection, zoomSetting);
        });
    };
    // Zoom icon to be appended to the label in the tooltip
    CirclePack.prototype.getZoomIcon = function () {
        return "\n\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 10 10\">\n\t\t\t<polygon points=\"5.93 3.71 4.45 3.71 4.45 2.23 3.71 2.23 3.71 3.71 2.23 3.71 2.23 4.45 3.71 4.45 3.71 5.93 4.45 5.93 4.45 4.45 5.93 4.45 5.93 3.71\"/>\n\t\t\t<path d=\"M7.2,6.67a4,4,0,0,0,1-2.59A4.08,4.08,0,1,0,4.07,8.15h0a4,4,0,0,0,2.59-1L9.48,10,10,9.48Zm-3.12.77A3.34,3.34,0,1,1,7.41,4.08,3.34,3.34,0,0,1,4.08,7.44Z\"/>\n\t\t</svg>";
    };
    // add event listeners for tooltip on the circles
    CirclePack.prototype.addEventListeners = function () {
        var self = this;
        this.parent
            .selectAll('circle.node')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', true);
            var hierarchyLevel = self.model.getHierarchyLevel();
            var disabled = hierarchyLevel > 2 && !hoveredElement.classed('focal');
            var canvasZoomEnabled = Tools.getProperty(self.model.getOptions(), 'canvasZoom', 'enabled');
            var zoomable = false;
            if (!disabled) {
                // get the children data for the tooltip
                var childrenData = [];
                var totalValue = [];
                var parentValue = null;
                if (datum.children) {
                    if (datum.depth > 1 && canvasZoomEnabled) {
                        zoomable = true;
                        hoveredElement.classed('clickable', true);
                    }
                    childrenData = datum.children.map(function (child) {
                        if (child !== null) {
                            // retrieve the children values if there are any 3rd level
                            if (typeof child.data.value === 'number') {
                                return {
                                    label: child.data.name,
                                    value: child.data.value,
                                };
                            }
                            else {
                                return {
                                    label: child.data.name,
                                    labelIcon: canvasZoomEnabled &&
                                        hierarchyLevel <= 2
                                        ? self.getZoomIcon()
                                        : null,
                                    value: child.value,
                                };
                            }
                        }
                    });
                    var options = self.model.getOptions();
                    totalValue = [
                        {
                            label: get(options, 'tooltip.totalLabel') ||
                                'Total',
                            value: datum.value,
                            bold: true,
                        },
                    ];
                    // children get a highlight stroke
                    self.highlightChildren(datum.children);
                }
                else {
                    // if there is no children we want to display the value for the data
                    parentValue = datum.value;
                }
                var fillColor = getComputedStyle(this, null).getPropertyValue('fill');
                // Show tooltip
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: hoveredElement,
                    items: __spreadArrays([
                        {
                            color: fillColor,
                            label: datum.data.name,
                            labelIcon: zoomable &&
                                canvasZoomEnabled &&
                                hierarchyLevel <= 2
                                ? self.getZoomIcon()
                                : null,
                            value: parentValue,
                        }
                    ], childrenData, totalValue),
                });
            }
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.CirclePack.CIRCLE_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
        })
            .on('mousemove', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.CirclePack.CIRCLE_MOUSEMOVE, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', false);
            if (datum.children) {
                self.unhighlightChildren(datum.children);
            }
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.CirclePack.CIRCLE_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        })
            .on('click', function (event, datum) {
            var hoveredElement = select(this);
            var disabled = hoveredElement.classed('non-focal');
            var zoomedIn = Tools.getProperty(self.getOptions(), 'canvasZoom', 'enabled') && self.model.getHierarchyLevel() > 2;
            if (zoomedIn) {
                var canvasSelection = self.parent.selectAll('circle.node');
                var chartSvg = select(self.services.domUtils.getMainContainer());
                chartSvg.classed('zoomed-in', false);
                self.focal = null;
                self.model.updateHierarchyLevel(2);
                self.services.canvasZoom.zoomOut(canvasSelection, Configuration.canvasZoomSettings);
            }
            // zoom if chart has zoom enabled and if its a depth 2 circle that has children
            else if (datum.depth === 2 && datum.children && !disabled) {
                var canvasSelection = self.parent.selectAll('circle.node');
                var chartSvg = select(self.services.domUtils.getMainContainer());
                chartSvg.classed('zoomed-in', true);
                self.focal = datum;
                self.model.updateHierarchyLevel(3);
                self.services.canvasZoom.zoomIn(datum, canvasSelection, Configuration.canvasZoomSettings);
                // don't want the click event to propagate to the background zoom out
                // does not clash with the tooltip/other events because it does need to close the
                // tooltip on the click event in order to zoom in/out
                event.stopPropagation();
            }
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.CirclePack.CIRCLE_CLICK, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
        });
    };
    CirclePack.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('circle.node')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null)
            .on('click', null);
        // remove the listeners on the legend
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
        this.removeBackgroundListeners();
    };
    return CirclePack;
}(Component));
export { CirclePack };
//# sourceMappingURL=../../../src/components/graphs/circle-pack.js.map