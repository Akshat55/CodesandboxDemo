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
import { Component } from '../component';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { AxisPositions, Events, RenderTypes, ScaleTypes, } from '../../interfaces';
// D3 Imports
// @ts-ignore
// ts-ignore is needed because `@types/d3`
// is missing the `pointer` function
import { select, pointer } from 'd3-selection';
// Carbon position service
import Position, { PLACEMENTS } from '@carbon/utils-position';
// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
import { formatTick, computeTimeIntervalName, } from '../../services/time-series';
var Threshold = /** @class */ (function (_super) {
    __extends(Threshold, _super);
    function Threshold(model, services) {
        var _this = _super.call(this, model, services) || this;
        _this.type = 'threshold';
        _this.renderType = RenderTypes.SVG;
        _this.positionService = new Position();
        return _this;
    }
    Threshold.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        var axesOptions = Tools.getProperty(this.getOptions(), 'axes');
        var thresholdData = [];
        Object.keys(axesOptions).forEach(function (axisPosition) {
            var _a, _b;
            if (Object.values(AxisPositions).includes(axisPosition)) {
                var axisOptions = axesOptions[axisPosition];
                if (axisOptions.thresholds &&
                    axisOptions.thresholds.length > 0) {
                    thresholdData.push({
                        axisPosition: axisPosition,
                        thresholds: axisOptions.thresholds,
                        correspondingDatasets: (_a = axisOptions) === null || _a === void 0 ? void 0 : _a.correspondingDatasets,
                        mapsTo: (_b = axisOptions) === null || _b === void 0 ? void 0 : _b.mapsTo,
                    });
                }
            }
        });
        // Grab container SVG
        var svg = this.getComponentContainer({ withinChartClip: true });
        // Update data on all axis threshold groups
        var thresholdAxisGroups = svg
            .selectAll('g.axis-thresholds')
            .data(thresholdData, function (thresholdData) { return thresholdData.axisPosition; });
        // Remove axis threshold groups that are no longer needed
        thresholdAxisGroups.exit().attr('opacity', 0).remove();
        // Add the axis threshold groups that need to be introduced
        var thresholdAxisGroupsEnter = thresholdAxisGroups
            .enter()
            .append('g');
        var thresholdAxisGroupsMerge = thresholdAxisGroupsEnter.merge(thresholdAxisGroups);
        thresholdAxisGroupsMerge.attr('class', function (d) { return "axis-thresholds " + d.axisPosition; });
        var thresholdGroups = thresholdAxisGroupsMerge
            .selectAll('g.threshold-group')
            .data(function (d) {
            return d.thresholds.map(function (threshold) {
                // Merge relevant keys into the threshold object
                threshold.axisPosition = d.axisPosition;
                threshold.datum = _this.constructDatumObj(d, threshold);
                return threshold;
            });
        });
        // Remove threshold groups that are no longer needed
        thresholdGroups.exit().attr('opacity', 0).remove();
        // Add the threshold groups that need to be introduced
        var thresholdGroupsEnter = thresholdGroups.enter().append('g');
        thresholdGroupsEnter.append('line').attr('class', 'threshold-line');
        thresholdGroupsEnter
            .append('rect')
            .attr('class', 'threshold-hoverable-area');
        var thresholdGroupsMerge = thresholdGroupsEnter.merge(thresholdGroups);
        thresholdGroupsMerge.attr('class', 'threshold-group');
        var self = this;
        thresholdAxisGroupsMerge.each(function (_a) {
            var axisPosition = _a.axisPosition;
            var scale = self.services.cartesianScales.getScaleByPosition(axisPosition);
            var scaleType = self.services.cartesianScales.getScaleTypeByPosition(axisPosition);
            var xScale = null;
            var yScale = null;
            // Depending on type of axis position, assign scale and main perpendicular axis
            if (axisPosition === AxisPositions.LEFT ||
                axisPosition === AxisPositions.RIGHT) {
                yScale = scale;
                xScale = self.services.cartesianScales.getMainXScale();
            }
            else {
                xScale = scale;
                yScale = self.services.cartesianScales.getMainYScale();
            }
            var isScaleTypeLabels = scaleType === ScaleTypes.LABELS;
            var _b = xScale.range(), xScaleStart = _b[0], xScaleEnd = _b[1];
            var _c = yScale.range(), yScaleEnd = _c[0], yScaleStart = _c[1];
            var cartesianScales = self.services.cartesianScales;
            var orientation = cartesianScales.getOrientation();
            var getDomainValue = function (d) { return cartesianScales.getDomainValue(d); };
            var getRangeValue = function (d) { return cartesianScales.getRangeValue(d); };
            var _d = Tools.flipDomainAndRangeBasedOnOrientation(getDomainValue, getRangeValue, orientation), getXValue = _d[0], getYValue = _d[1];
            var group = select(this);
            if (axisPosition === AxisPositions.TOP ||
                axisPosition === AxisPositions.BOTTOM) {
                group
                    .selectAll('line.threshold-line')
                    .transition()
                    .call(function (t) {
                    return self.services.transitions.setupTransition({
                        transition: t,
                        name: 'threshold-line-update',
                        animate: animate,
                    });
                })
                    .attr('y1', yScaleStart)
                    .attr('y2', yScaleEnd)
                    .attr('x1', function (_a) {
                    var datum = _a.datum;
                    return getXValue(datum) +
                        (isScaleTypeLabels ? scale.step() / 2 : 0);
                })
                    .attr('x2', function (_a) {
                    var datum = _a.datum;
                    return getXValue(datum) +
                        (isScaleTypeLabels ? scale.step() / 2 : 0);
                })
                    .style('stroke', function (_a) {
                    var fillColor = _a.fillColor;
                    return fillColor;
                });
                // Set hoverable area width and rotate it
                group
                    .selectAll('rect.threshold-hoverable-area')
                    .attr('x', 0)
                    .attr('y', function (_a) {
                    var datum = _a.datum;
                    return -getXValue(datum);
                })
                    .attr('width', Math.abs(yScaleEnd - yScaleStart))
                    .classed('rotate', true);
            }
            else {
                group
                    .selectAll('line.threshold-line')
                    .transition()
                    .call(function (t) {
                    return self.services.transitions.setupTransition({
                        transition: t,
                        name: 'threshold-line-update',
                        animate: animate,
                    });
                })
                    .attr('x1', xScaleStart)
                    .attr('x2', xScaleEnd)
                    .attr('y1', function (_a) {
                    var datum = _a.datum;
                    return getYValue(datum) +
                        (isScaleTypeLabels ? scale.step() / 2 : 0);
                })
                    .attr('y2', function (_a) {
                    var datum = _a.datum;
                    return getYValue(datum) +
                        (isScaleTypeLabels ? scale.step() / 2 : 0);
                })
                    .style('stroke', function (_a) {
                    var fillColor = _a.fillColor;
                    return fillColor;
                });
                // Set hoverable area width
                group
                    .selectAll('rect.threshold-hoverable-area')
                    .attr('x', xScaleStart)
                    .attr('y', function (_a) {
                    var datum = _a.datum;
                    return getYValue(datum);
                })
                    .attr('width', Math.abs(xScaleEnd - xScaleStart))
                    .classed('rotate', false);
            }
        });
        // Add event listener for showing the threshold tooltip
        this.services.events.addEventListener(Events.Threshold.SHOW, function (e) {
            _this.setThresholdLabelPosition(e.detail);
            _this.label.classed('hidden', false);
        });
        // Add event listener for hiding the threshold tooltip
        this.services.events.addEventListener(Events.Threshold.HIDE, function (e) {
            _this.label.classed('hidden', true);
        });
        this.appendThresholdLabel();
        this.addEventListeners();
    };
    Threshold.prototype.getFormattedValue = function (datum) {
        var value = datum.value, axisPosition = datum.axisPosition;
        var options = this.getOptions();
        var scaleType = this.services.cartesianScales.getScaleTypeByPosition(axisPosition);
        // If scale is time, format the threshold date as the ticks format
        if (scaleType === ScaleTypes.TIME) {
            var isVertical = [
                AxisPositions.LEFT,
                AxisPositions.RIGHT,
            ].includes(axisPosition);
            var mainXScale = this.services.cartesianScales.getMainXScale();
            var mainYScale = this.services.cartesianScales.getMainYScale();
            var scale = isVertical ? mainYScale : mainXScale;
            var timeScaleOptions = Tools.getProperty(options, 'timeScale');
            var timeInterval = computeTimeIntervalName(scale.ticks());
            return formatTick(value, 0, scale.ticks(), timeInterval, timeScaleOptions);
        }
        return value.toLocaleString('en');
    };
    Threshold.prototype.appendThresholdLabel = function () {
        var holder = select(this.services.domUtils.getHolder());
        var chartprefix = Tools.getProperty(this.getOptions(), 'style', 'prefix');
        this.label = DOMUtils.appendOrSelect(holder, "div." + settings.prefix + "--" + chartprefix + "--threshold--label").classed('hidden', true);
    };
    Threshold.prototype.setThresholdLabelPosition = function (_a) {
        var event = _a.event, datum = _a.datum;
        var holder = this.services.domUtils.getHolder();
        var mouseRelativePos = pointer(event, holder);
        // Format the threshold value using valueFormatter if defined in user-provided options
        var formattedValue = datum.valueFormatter
            ? datum.valueFormatter(datum.value)
            : this.getFormattedValue(datum);
        this.label
            .html((datum.label || 'Threshold') + ": " + formattedValue)
            .style('background-color', datum.fillColor);
        var target = this.label.node();
        // Find out whether threshold label should be shown on the left or right side
        var bestPlacementOption = this.positionService.findBestPlacementAt({
            left: mouseRelativePos[0],
            top: mouseRelativePos[1],
        }, target, [
            PLACEMENTS.RIGHT,
            PLACEMENTS.LEFT,
            PLACEMENTS.TOP,
            PLACEMENTS.BOTTOM,
        ], function () { return ({
            width: holder.offsetWidth,
            height: holder.offsetHeight,
        }); });
        // Get coordinates to where label should be positioned
        var pos = this.positionService.findPositionAt({
            left: mouseRelativePos[0],
            top: mouseRelativePos[1],
        }, target, bestPlacementOption);
        this.positionService.setElement(target, pos);
    };
    // Constructs object to pass in scale functions
    Threshold.prototype.constructDatumObj = function (d, element) {
        var datum = {};
        // We only need to specify group only if correpsonding dataset is defined
        if (d.correspondingDatasets) {
            datum['group'] = Tools.getProperty(d, 'correspondingDatasets', 0);
        }
        // Add attribute with the mapsTo value as key
        datum[d['mapsTo']] = element.value;
        return datum;
    };
    Threshold.prototype.addEventListeners = function () {
        var self = this;
        // Grab container SVG
        var svg = this.getComponentContainer({ withinChartClip: true });
        // Add events to the threshold hoverable area
        svg.selectAll('rect.threshold-hoverable-area')
            .on('mouseover mousemove', function (event) {
            select(this.parentNode)
                .select('line.threshold-line')
                .classed('active', true);
            self.services.events.dispatchEvent(Events.Threshold.SHOW, {
                event: event,
                hoveredElement: select(this),
                datum: select(this).datum(),
            });
        })
            .on('mouseout', function (event) {
            select(this.parentNode)
                .select('line.threshold-line')
                .classed('active', false);
            self.services.events.dispatchEvent(Events.Threshold.HIDE, {
                event: event,
                hoveredElement: select(this),
                datum: select(this).datum(),
            });
        });
    };
    return Threshold;
}(Component));
export { Threshold };
//# sourceMappingURL=../../../src/components/essentials/threshold.js.map