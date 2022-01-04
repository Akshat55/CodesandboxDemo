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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Component } from '../component';
import { Tools } from '../../tools';
import { AxisPositions, RenderTypes } from '../../interfaces';
// D3 Imports
// @ts-ignore
// ts-ignore is needed because `@types/d3`
// is missing the `pointer` function
import { select } from 'd3-selection';
// Carbon position service
import Position from '@carbon/utils-position';
var Highlight = /** @class */ (function (_super) {
    __extends(Highlight, _super);
    function Highlight(model, services) {
        var _this = _super.call(this, model, services) || this;
        _this.type = 'highlight';
        _this.renderType = RenderTypes.SVG;
        _this.positionService = new Position();
        _this.highlightStrokeWidth = 1;
        return _this;
    }
    Highlight.prototype.render = function (animate) {
        if (animate === void 0) { animate = false; }
        var axesOptions = Tools.getProperty(this.getOptions(), 'axes');
        var highlightData = [];
        Object.keys(axesOptions).forEach(function (axisPosition) {
            if (Object.values(AxisPositions).includes(axisPosition)) {
                var axisOptions = axesOptions[axisPosition];
                if (axisOptions.highlights &&
                    axisOptions.highlights.data.length > 0) {
                    highlightData.push({
                        axisPosition: axisPosition,
                        highlightStartMapsTo: axisOptions.highlights.highlightStartMapsTo,
                        highlightEndMapsTo: axisOptions.highlights.highlightEndMapsTo,
                        labelMapsTo: axisOptions.highlights.labelMapsTo,
                        highlight: axisOptions.highlights.data,
                        color: axisOptions.highlights.color,
                    });
                }
            }
        });
        // Grab container SVG
        var svg = this.getComponentContainer({ withinChartClip: true });
        // Update data on all axis highlight groups
        var highlightAxisGroups = svg
            .selectAll('g.axis-highlight')
            .data(highlightData, function (highlightData) { return highlightData.axisPosition; });
        // Remove axis highlight groups that are no longer needed
        highlightAxisGroups.exit().attr('opacity', 0).remove();
        // Add the axis highlight groups that need to be introduced
        var highlightAxisGroupsEnter = highlightAxisGroups
            .enter()
            .append('g');
        var highlightAxisGroupsMerge = highlightAxisGroupsEnter.merge(highlightAxisGroups);
        highlightAxisGroupsMerge.attr('class', function (d) { return "axis-highlight " + d.axisPosition; });
        var highlightGroups = highlightAxisGroupsMerge
            .selectAll('g.highlight-group')
            .data(function (d) {
            return d.highlight.map(function (highlight) {
                highlight.axisPosition = d.axisPosition;
                highlight.highlightStartMapsTo = d.highlightStartMapsTo;
                highlight.labelMapsTo = d.labelMapsTo;
                highlight.color = d.color;
                highlight.highlightEndMapsTo = d.highlightEndMapsTo;
                return highlight;
            });
        });
        // Remove highlight groups that are no longer needed
        highlightGroups.exit().attr('opacity', 0).remove();
        // Add the highlight groups that need to be introduced
        var highlightGroupsEnter = highlightGroups.enter().append('g');
        highlightGroupsEnter.append('rect').attr('class', 'highlight-bar');
        highlightGroupsEnter.append('line').attr('class', 'highlight-line');
        var highlightGroupsMerge = highlightGroupsEnter.merge(highlightGroups);
        highlightGroupsMerge.attr('class', 'highlight-group');
        var self = this;
        highlightAxisGroupsMerge.each(function (_a) {
            var axisPosition = _a.axisPosition;
            var mainXScale = self.services.cartesianScales.getMainXScale();
            var mainYScale = self.services.cartesianScales.getMainYScale();
            var _b = mainXScale.range(), xScaleStart = _b[0], xScaleEnd = _b[1];
            var _c = mainYScale.range(), yScaleEnd = _c[0], yScaleStart = _c[1];
            var cartesianScales = self.services.cartesianScales;
            var orientation = cartesianScales.getOrientation();
            var getDomainValue = function (d) { return cartesianScales.getDomainValue(d); };
            var getRangeValue = function (d) { return cartesianScales.getRangeValue(d); };
            var _d = Tools.flipDomainAndRangeBasedOnOrientation(getDomainValue, getRangeValue, orientation), getXValue = _d[0], getYValue = _d[1];
            var group = select(this);
            if (axisPosition === AxisPositions.TOP ||
                axisPosition === AxisPositions.BOTTOM) {
                group
                    .selectAll('rect.highlight-bar')
                    .transition()
                    .call(function (t) {
                    return self.services.transitions.setupTransition({
                        transition: t,
                        name: 'highlight-bar-update',
                        animate: animate,
                    });
                })
                    // Stroke width added to stop overflow of highlight
                    .attr('y', Math.max(yScaleStart + self.highlightStrokeWidth, 0))
                    // Stroke width subtracted to stop overflow of highlight
                    .attr('height', Math.max(yScaleEnd - 2 * self.highlightStrokeWidth, 0))
                    .attr('x', function (_a) {
                    var highlightStartMapsTo = _a.highlightStartMapsTo, d = __rest(_a, ["highlightStartMapsTo"]);
                    return getXValue(d[highlightStartMapsTo]);
                })
                    .attr('width', function (_a) {
                    var highlightStartMapsTo = _a.highlightStartMapsTo, highlightEndMapsTo = _a.highlightEndMapsTo, d = __rest(_a, ["highlightStartMapsTo", "highlightEndMapsTo"]);
                    return Math.max(getXValue(d[highlightEndMapsTo]) -
                        getXValue(d[highlightStartMapsTo]), 0);
                })
                    .style('stroke', function (_a) {
                    var color = _a.color, labelMapsTo = _a.labelMapsTo, data = __rest(_a, ["color", "labelMapsTo"]);
                    return color && color.scale[data[labelMapsTo]]
                        ? color.scale[data[labelMapsTo]]
                        : null;
                })
                    .style('stroke-dasharray', '2, 2')
                    .attr('stroke-width', self.highlightStrokeWidth + 'px')
                    .style('fill-opacity', 0.1)
                    .style('fill', function (_a) {
                    var color = _a.color, labelMapsTo = _a.labelMapsTo, data = __rest(_a, ["color", "labelMapsTo"]);
                    return color && color.scale[data[labelMapsTo]]
                        ? color.scale[data[labelMapsTo]]
                        : null;
                });
            }
            else {
                group
                    .selectAll('rect.highlight-bar')
                    .transition()
                    .call(function (t) {
                    return self.services.transitions.setupTransition({
                        transition: t,
                        name: 'highlight-bar-update',
                        animate: animate,
                    });
                })
                    .attr('x', xScaleStart)
                    .attr('width', Math.max(xScaleEnd - xScaleStart, 0))
                    .attr('y', function (_a) {
                    var highlightEndMapsTo = _a.highlightEndMapsTo, d = __rest(_a, ["highlightEndMapsTo"]);
                    return getYValue(d[highlightEndMapsTo]);
                })
                    .attr('height', function (_a) {
                    var highlightStartMapsTo = _a.highlightStartMapsTo, highlightEndMapsTo = _a.highlightEndMapsTo, d = __rest(_a, ["highlightStartMapsTo", "highlightEndMapsTo"]);
                    return Math.max(getYValue(d[highlightStartMapsTo]) -
                        getYValue(d[highlightEndMapsTo]), 0);
                })
                    .style('stroke', function (_a) {
                    var color = _a.color, labelMapsTo = _a.labelMapsTo, data = __rest(_a, ["color", "labelMapsTo"]);
                    return color && color.scale[data[labelMapsTo]]
                        ? color.scale[data[labelMapsTo]]
                        : null;
                })
                    .style('stroke-dasharray', '2, 2')
                    .attr('stroke-width', self.highlightStrokeWidth + 'px')
                    .style('fill-opacity', 0.1)
                    .style('fill', function (_a) {
                    var color = _a.color, labelMapsTo = _a.labelMapsTo, data = __rest(_a, ["color", "labelMapsTo"]);
                    return color && color.scale[data[labelMapsTo]]
                        ? color.scale[data[labelMapsTo]]
                        : null;
                });
            }
        });
    };
    return Highlight;
}(Component));
export { Highlight };
//# sourceMappingURL=../../../src/components/essentials/highlights.js.map