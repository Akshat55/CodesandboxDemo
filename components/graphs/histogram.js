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
import { Tools } from '../../tools';
import { Roles, Events, CartesianOrientations, ColorClassNameTypes, RenderTypes, } from '../../interfaces';
import { Component } from '../component';
// D3 Imports
import { select } from 'd3-selection';
import { get } from 'lodash-es';
var Histogram = /** @class */ (function (_super) {
    __extends(Histogram, _super);
    function Histogram() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'histogram';
        _this.renderType = RenderTypes.SVG;
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var options = _this.getOptions();
            var groupMapsTo = options.data.groupMapsTo;
            _this.parent
                .selectAll('path.bar')
                .transition('legend-hover-bar')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-hover-bar',
                });
            })
                .attr('opacity', function (d) {
                return d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1;
            });
        };
        // Un-highlight all elements
        _this.handleLegendMouseOut = function (event) {
            _this.parent
                .selectAll('path.bar')
                .transition('legend-mouseout-bar')
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'legend-mouseout-bar',
                });
            })
                .attr('opacity', 1);
        };
        return _this;
    }
    Histogram.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    Histogram.prototype.render = function (animate) {
        var _this = this;
        // Grab container SVG
        var svg = this.getComponentContainer();
        // Chart options mixed with the internal configurations
        var options = this.model.getOptions();
        var groupIdentifier = options.groupIdentifier;
        var groupMapsTo = options.data.groupMapsTo;
        var binnedStackedData = this.model.getBinnedStackedData();
        var x = this.services.cartesianScales.getMainXScale();
        // Update data on all bar groups
        var barGroups = svg
            .selectAll('g.bars')
            .data(binnedStackedData, function (d) { return get(d, "0." + groupMapsTo); });
        barGroups.exit().attr('opacity', 0).remove();
        // Add bar groups that need to be introduced
        barGroups
            .enter()
            .append('g')
            .classed('bars', true)
            .attr('role', Roles.GROUP);
        // Update data on all bars
        var bars = svg
            .selectAll('g.bars')
            .selectAll('path.bar')
            .data(function (data) { return data; });
        // Remove bars that need to be removed
        bars.exit().remove();
        bars.enter()
            .append('path')
            .merge(bars)
            .classed('bar', true)
            .attr(groupIdentifier, function (d, i) { return i; })
            .transition()
            .call(function (t) {
            return _this.services.transitions.setupTransition({
                transition: t,
                name: 'histogram-bar-update-enter',
                animate: animate,
            });
        })
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d[groupMapsTo],
                originalClassName: 'bar',
            });
        })
            .style('fill', function (d) { return _this.model.getFillColor(d[groupMapsTo]); })
            .attr('d', function (d, i) {
            var bin = get(d, 'data');
            if (!bin) {
                return;
            }
            /*
             * Orientation support for horizontal/vertical bar charts
             * Determine coordinates needed for a vertical set of paths
             * to draw the bars needed, and pass those coordinates down to
             * generateSVGPathString() to decide whether it needs to flip them
             */
            var barWidth = x(bin.x1) - x(bin.x0) - 1;
            var x0 = _this.services.cartesianScales.getDomainValue(bin.x0, i);
            var x1 = x0 + barWidth;
            var y0 = _this.services.cartesianScales.getRangeValue(d[0], i);
            var y1 = _this.services.cartesianScales.getRangeValue(d[1], i);
            // Add the divider gap
            if (Math.abs(y1 - y0) > 0 &&
                Math.abs(y1 - y0) > options.bars.dividerSize) {
                if (_this.services.cartesianScales.getOrientation() ===
                    CartesianOrientations.VERTICAL) {
                    y1 += 1;
                }
                else {
                    y1 -= 1;
                }
            }
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
        })
            .attr('opacity', 1)
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'bar')
            .attr('aria-label', function (d) {
            return Tools.getProperty(d, 'data', d[groupMapsTo]);
        });
        // Add event listeners for the above elements
        this.addEventListeners();
    };
    Histogram.prototype.addEventListeners = function () {
        var options = this.model.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var self = this;
        this.parent
            .selectAll('path.bar')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', true);
            var x0 = parseFloat(get(datum, 'data.x0'));
            var x1 = parseFloat(get(datum, 'data.x1'));
            var rangeAxisPosition = self.services.cartesianScales.getRangeAxisPosition();
            var rangeScaleLabel = self.services.cartesianScales.getScaleLabel(rangeAxisPosition);
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                event: event,
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: get(options, 'bins.rangeLabel') || 'Range',
                        value: x0 + " \u2013 " + x1,
                    },
                    {
                        label: options.tooltip.groupLabel || 'Group',
                        value: datum[groupMapsTo],
                        class: self.model.getColorClassName({
                            classNameTypes: [ColorClassNameTypes.TOOLTIP],
                            dataGroupName: datum[groupMapsTo],
                        }),
                    },
                    {
                        label: rangeScaleLabel,
                        value: get(datum, "data." + datum[groupMapsTo]),
                    },
                ],
            });
        })
            .on('mousemove', function (event, datum) {
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            // Select all same group elements
            hoveredElement.classed('hovered', false);
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE);
        });
    };
    Histogram.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('path.bar')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    return Histogram;
}(Component));
export { Histogram };
//# sourceMappingURL=../../../src/components/graphs/histogram.js.map