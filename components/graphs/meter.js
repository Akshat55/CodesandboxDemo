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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import { Roles, ColorClassNameTypes, Events, RenderTypes, } from '../../interfaces';
import * as Configuration from '../../configuration';
// D3 Imports
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
var Meter = /** @class */ (function (_super) {
    __extends(Meter, _super);
    function Meter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'meter';
        _this.renderType = RenderTypes.SVG;
        return _this;
    }
    Meter.prototype.getStackedBounds = function (data, scale) {
        var prevX = 0;
        var stackedData = data.map(function (d, i) {
            if (i !== 0) {
                prevX += scale(d.value);
                return __assign(__assign({}, d), { width: Math.abs(scale(d.value) - Configuration.meter.dividerWidth), x: prevX - scale(d.value) });
            }
            else {
                prevX = scale(d.value);
                return __assign(__assign({}, d), { width: Math.abs(scale(d.value) - Configuration.meter.dividerWidth), x: 0 });
            }
        });
        return stackedData;
    };
    Meter.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var self = this;
        var svg = this.getComponentContainer();
        var options = this.getOptions();
        var proportional = Tools.getProperty(options, 'meter', 'proportional');
        var data = this.model.getDisplayData();
        var status = this.model.getStatus();
        var width = DOMUtils.getSVGElementSize(svg, {
            useAttrs: true,
        }).width;
        var groupMapsTo = options.data.groupMapsTo;
        var domainMax;
        if (Tools.getProperty(options, 'meter', 'proportional') === null) {
            domainMax = 100;
        }
        else {
            var total = Tools.getProperty(options, 'meter', 'proportional', 'total');
            domainMax = total
                ? total
                : this.model.getMaximumDomain(this.model.getDisplayData());
        }
        // each meter has a scale for the value but no visual axis
        var xScale = scaleLinear().domain([0, domainMax]).range([0, width]);
        var stackedData = this.getStackedBounds(data, xScale);
        var userProvidedHeight = Tools.getProperty(options, 'meter', 'height');
        // draw the container to hold the value
        DOMUtils.appendOrSelect(svg, 'rect.container')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', userProvidedHeight
            ? userProvidedHeight
            : proportional
                ? Configuration.meter.height.proportional
                : Configuration.meter.height.default);
        // draw the container max range value indicator
        DOMUtils.appendOrSelect(svg, 'line.rangeIndicator')
            .attr('x1', width)
            .attr('x2', width)
            .attr('y1', 0)
            .attr('y2', userProvidedHeight
            ? userProvidedHeight
            : proportional
                ? Configuration.meter.height.proportional
                : Configuration.meter.height.default);
        // rect with the value binded
        var valued = svg.selectAll('rect.value').data(stackedData);
        // if user provided a color for the bar, we dont want to attach a status class
        var className = status != null &&
            !self.model.isUserProvidedColorScaleValid() &&
            !proportional
            ? "value status--" + status
            : 'value';
        // draw the value bar
        valued
            .enter()
            .append('rect')
            .classed('value', true)
            .merge(valued)
            .attr('x', function (d) {
            return d.x;
        })
            .attr('y', 0)
            .attr('height', function () {
            var userProvidedHeight = Tools.getProperty(options, 'meter', 'height');
            return userProvidedHeight
                ? userProvidedHeight
                : proportional
                    ? Configuration.meter.height.proportional
                    : Configuration.meter.height.default;
        })
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.FILL],
                dataGroupName: d[groupMapsTo],
                originalClassName: className,
            });
        })
            .transition()
            .call(function (t) {
            return _this.services.transitions.setupTransition({
                transition: t,
                name: 'meter-bar-update',
                animate: animate,
            });
        })
            .attr('width', function (d, i) {
            return d.value > domainMax ? xScale(domainMax) : d.width;
        })
            .style('fill', function (d) { return self.model.getFillColor(d[groupMapsTo]); })
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'value')
            .attr('aria-label', function (d) { return d.value; });
        valued.exit().remove();
        // draw the peak
        var peakValue = Tools.getProperty(options, 'meter', 'peak');
        var peakData = peakValue;
        if (peakValue !== null) {
            if (peakValue > domainMax) {
                peakData = domainMax;
            }
            else if (peakValue < data[0].value) {
                peakData =
                    data[0].value > domainMax ? domainMax : data[0].value;
            }
        }
        // if a peak is supplied within the domain, we want to render it
        var peak = svg
            .selectAll('line.peak')
            .data(peakData == null ? [] : [peakData]);
        peak.enter()
            .append('line')
            .classed('peak', true)
            .merge(peak)
            .attr('y1', 0)
            .attr('y2', function () {
            var userProvidedHeight = Tools.getProperty(options, 'meter', 'height');
            return userProvidedHeight
                ? userProvidedHeight
                : proportional
                    ? Configuration.meter.height.proportional
                    : Configuration.meter.height.default;
        })
            .transition()
            .call(function (t) {
            return _this.services.transitions.setupTransition({
                transition: t,
                name: 'peak-line-update',
                animate: animate,
            });
        })
            .attr('x1', function (d) { return xScale(d); })
            .attr('x2', function (d) { return xScale(d); })
            // a11y
            .attr('role', Roles.GRAPHICS_SYMBOL)
            .attr('aria-roledescription', 'peak')
            .attr('aria-label', function (d) { return d; });
        peak.exit().remove();
        // this forces the meter chart to only take up as much height as needed (if no height is provided)
        this.services.domUtils.setSVGMaxHeight();
        // Add event listeners to elements and legend
        this.addEventListeners();
    };
    // add event listeners for tooltips on proportional meter bars
    Meter.prototype.addEventListeners = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var self = this;
        var proportional = Tools.getProperty(options, 'meter', 'proportional');
        this.parent
            .selectAll('rect.value')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Meter.METER_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            if (proportional) {
                hoveredElement.classed('hovered', true);
                // Show tooltip
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: hoveredElement,
                    items: [
                        {
                            label: datum[groupMapsTo],
                            value: datum.value,
                        },
                    ],
                });
            }
        })
            .on('mousemove', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Meter.METER_MOUSEMOVE, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            if (proportional) {
                self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                    event: event,
                });
            }
        })
            .on('click', function (event, datum) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Meter.METER_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Meter.METER_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            if (proportional) {
                hoveredElement.classed('hovered', false);
                // Hide tooltip
                self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                    hoveredElement: hoveredElement,
                });
            }
        });
    };
    Meter.prototype.destroy = function () {
        // Remove event listeners
        this.parent
            .selectAll('rect.value')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null)
            .on('click', null);
    };
    return Meter;
}(Component));
export { Meter };
//# sourceMappingURL=../../../src/components/graphs/meter.js.map