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
import { Bar } from './bar';
import { Roles, Events, CartesianOrientations, ColorClassNameTypes, RenderTypes, } from '../../interfaces';
// D3 Imports
import { select } from 'd3-selection';
var StackedBar = /** @class */ (function (_super) {
    __extends(StackedBar, _super);
    function StackedBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'stacked-bar';
        _this.renderType = RenderTypes.SVG;
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            var groupMapsTo = _this.model.getOptions().data.groupMapsTo;
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
    StackedBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
    };
    StackedBar.prototype.render = function (animate) {
        var _this = this;
        // Grab container SVG
        var svg = this.getComponentContainer({ withinChartClip: true });
        // Chart options mixed with the internal configurations
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Create the data and keys that'll be used by the stack layout
        var stackData = this.model.getStackedData({
            groups: this.configs.groups,
            divergent: true,
        });
        var activeDataGroupNames = this.model.getActiveDataGroupNames();
        // Update data on all bar groups
        var barGroups = svg
            .selectAll('g.bars')
            .data(stackData, function (d) { return Tools.getProperty(d, 0, groupMapsTo); });
        // Remove elements that need to be exited
        // We need exit at the top here to make sure that
        // Data filters are processed before entering new elements
        // Or updating existing ones
        barGroups.exit().attr('opacity', 0).remove();
        // Add bar groups that need to be introduced
        barGroups
            .enter()
            .append('g')
            .classed('bars', true)
            .attr('role', Roles.GROUP)
            .attr('data-name', 'bars');
        // Update data on all bars
        var bars = svg
            .selectAll('g.bars')
            .selectAll('path.bar')
            .data(function (d) { return d; }, function (d) { return d.data.sharedStackKey; });
        // Remove bars that need to be removed
        bars.exit().remove();
        bars.enter()
            .append('path')
            .merge(bars)
            .classed('bar', true)
            .transition()
            .call(function (t) {
            return _this.services.transitions.setupTransition({
                transition: t,
                name: 'bar-update-enter',
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
            var key = d.data.sharedStackKey;
            /*
             * Orientation support for horizontal/vertical bar charts
             * Determine coordinates needed for a vertical set of paths
             * to draw the bars needed, and pass those coordinates down to
             * generateSVGPathString() to decide whether it needs to flip them
             */
            var barWidth = _this.getBarWidth();
            var x0 = _this.services.cartesianScales.getDomainValue(key, i) -
                barWidth / 2;
            var x1 = x0 + barWidth;
            var y0 = _this.services.cartesianScales.getRangeValue(d[0], i);
            var y1 = _this.services.cartesianScales.getRangeValue(d[1], i);
            // don't show if part of bar is out of zoom domain
            if (_this.isOutsideZoomedDomain(x0, x1)) {
                return;
            }
            // Add the divider gap
            if (Math.abs(y1 - y0) > 0 &&
                Math.abs(y1 - y0) > options.bars.dividerSize) {
                var barIsNegative = d[0] < 0 && d[1] <= 0;
                if (barIsNegative && activeDataGroupNames.length > 1) {
                    if (_this.services.cartesianScales.getOrientation() ===
                        CartesianOrientations.VERTICAL) {
                        y1 += d[1] === 0 ? 2 : 1;
                    }
                    else {
                        y1 -= 1;
                    }
                }
                else if (!barIsNegative) {
                    if (_this.services.cartesianScales.getOrientation() ===
                        CartesianOrientations.VERTICAL) {
                        y1 += 1;
                    }
                    else {
                        y1 -= 1;
                    }
                }
            }
            return Tools.generateSVGPathString({ x0: x0, x1: x1, y0: y0, y1: y1 }, _this.services.cartesianScales.getOrientation());
        })
            .attr('opacity', 1)
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'bar')
            .attr('aria-label', function (d) { return d[1] - d[0]; });
        // Add event listeners for the above elements
        this.addEventListeners();
    };
    StackedBar.prototype.addEventListeners = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var self = this;
        this.parent
            .selectAll('path.bar')
            .on('mouseover', function (event, datum) {
            var _a;
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', true);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            var displayData = self.model.getDisplayData(self.configs.groups);
            var matchingDataPoint = displayData.find(function (d) {
                var domainIdentifier = self.services.cartesianScales.getDomainIdentifier(d);
                var rangeIdentifier = self.services.cartesianScales.getRangeIdentifier(d);
                return (d[rangeIdentifier] === datum.data[datum[groupMapsTo]] &&
                    d[domainIdentifier].toString() ===
                        datum.data.sharedStackKey &&
                    d[groupMapsTo] === datum[groupMapsTo]);
            });
            if (matchingDataPoint === undefined) {
                // use the primary range and domain ids
                var domainIdentifier = self.services.cartesianScales.getDomainIdentifier();
                var rangeIdentifier = self.services.cartesianScales.getRangeIdentifier();
                matchingDataPoint = (_a = {},
                    _a[domainIdentifier] = datum.data.sharedStackKey,
                    _a[rangeIdentifier] = datum.data[datum[groupMapsTo]],
                    _a[groupMapsTo] = datum[groupMapsTo],
                    _a);
            }
            // Show tooltip
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                event: event,
                hoveredElement: hoveredElement,
                data: [matchingDataPoint],
            });
        })
            .on('mousemove', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
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
            self.services.events.dispatchEvent(Events.Bar.BAR_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            hoveredElement.classed('hovered', false);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Hide tooltip
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    StackedBar.prototype.destroy = function () {
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
    return StackedBar;
}(Bar));
export { StackedBar };
//# sourceMappingURL=../../../src/components/graphs/bar-stacked.js.map