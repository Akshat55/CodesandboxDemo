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
import { ColorLegendType, Events, RenderTypes } from '../../interfaces';
import * as Configuration from '../../configuration';
import { Legend } from '../';
import { DOMUtils } from '../../services';
// D3 imports
import { axisBottom } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { interpolateRound, quantize } from 'd3-interpolate';
var ColorScaleLegend = /** @class */ (function (_super) {
    __extends(ColorScaleLegend, _super);
    function ColorScaleLegend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'color-legend';
        _this.renderType = RenderTypes.SVG;
        _this.gradient_id = 'gradient-id-' + Math.floor(Math.random() * 99999999999);
        _this.handleAxisComplete = function (event) {
            var svg = _this.getComponentContainer();
            var width = DOMUtils.getSVGElementSize(svg, {
                useAttrs: true,
            }).width;
            var isDataLoading = Tools.getProperty(_this.getOptions(), 'data', 'loading');
            if (width > Configuration.legend.color.barWidth && !isDataLoading) {
                var title = Tools.getProperty(_this.getOptions(), 'heatmap', 'colorLegend', 'title');
                var cartesianScales = _this.services.cartesianScales;
                // Get available chart area
                var mainXScale = cartesianScales.getMainXScale();
                var xDimensions = mainXScale.range();
                // Align legend with the axis
                if (xDimensions[0] > 1) {
                    svg.select('g.legend').attr('transform', "translate(" + xDimensions[0] + ", 0)");
                    if (title) {
                        var textWidth = DOMUtils.getSVGElementSize(svg.select('g.legend-title').select('text'), { useBBox: true }).width;
                        // -9 since LEFT y-axis labels are moved towards the left by 9 by d3
                        var availableSpace = xDimensions[0] - textWidth - 9;
                        // If space is available align the the label with the axis labels
                        if (availableSpace > 1) {
                            svg.select('g.legend-title').attr('transform', "translate(" + availableSpace + ", 0)");
                        }
                        else {
                            // Move the legend down by 16 pixels to display legend text on top
                            svg.select('g.legend').attr('transform', "translate(" + xDimensions[0] + ", 16)");
                            // Align legend title with start of axis
                            svg.select('g.legend-title').attr('transform', "translate(" + xDimensions[0] + ", 0)");
                        }
                    }
                }
            }
        };
        return _this;
    }
    ColorScaleLegend.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener(Events.Axis.RENDER_COMPLETE, this.handleAxisComplete);
    };
    ColorScaleLegend.prototype.render = function (animate) {
        if (animate === void 0) { animate = false; }
        var options = this.getOptions();
        var customColors = Tools.getProperty(options, 'color', 'gradient', 'colors');
        var colorScaleType = Tools.getProperty(options, 'heatmap', 'colorLegend', 'type');
        var colorPairingOption = Tools.getProperty(options, 'color', 'pairing', 'option');
        var title = Tools.getProperty(options, 'heatmap', 'colorLegend', 'title');
        var customColorsEnabled = !Tools.isEmpty(customColors);
        var domain = this.model.getValueDomain();
        var svg = this.getComponentContainer();
        // Clear DOM if loading
        var isDataLoading = Tools.getProperty(this.getOptions(), 'data', 'loading');
        if (isDataLoading) {
            svg.html('');
            return;
        }
        var legend = DOMUtils.appendOrSelect(svg, 'g.legend');
        var axis = DOMUtils.appendOrSelect(legend, 'g.legend-axis');
        var width = DOMUtils.getSVGElementSize(svg, {
            useAttrs: true,
        }).width;
        var barWidth = Configuration.legend.color.barWidth;
        if (width <= Configuration.legend.color.barWidth) {
            barWidth = width;
        }
        if (title) {
            var legendTitleGroup = DOMUtils.appendOrSelect(svg, 'g.legend-title');
            var legendTitle = DOMUtils.appendOrSelect(legendTitleGroup, 'text');
            legendTitle.text(title).attr('dy', '0.7em');
            // Move the legend down by 16 pixels to display legend text on top
            legend.attr('transform', "translate(0, 16)");
        }
        // If domain consists of negative and positive values, use diverging palettes
        var colorScheme = domain[0] < 0 && domain[1] > 0 ? 'diverge' : 'mono';
        // Use default color pairing options if not in defined range
        if (colorPairingOption < 1 &&
            colorPairingOption > 4 &&
            colorScheme === 'mono') {
            colorPairingOption = 1;
        }
        else if (colorPairingOption < 1 &&
            colorPairingOption > 2 &&
            colorScheme === 'diverge') {
            colorPairingOption = 1;
        }
        var colorPairing = [];
        // Carbon charts has 11 colors for a single monochromatic palette & 17 for a divergent palette
        var colorGroupingLength = colorScheme === 'diverge' ? 17 : 11;
        if (!customColorsEnabled) {
            // Add class names to list and the amount based on the color scheme
            for (var i = 1; i < colorGroupingLength + 1; i++) {
                colorPairing.push(colorScaleType === ColorLegendType.LINEAR
                    ? "stop-color-" + colorScheme + "-" + colorPairingOption + "-" + i
                    : "fill-" + colorScheme + "-" + colorPairingOption + "-" + i);
            }
        }
        else {
            // Use custom colors
            colorPairing = customColors;
        }
        if (colorScaleType === ColorLegendType.LINEAR) {
            var stopLengthPercentage_1 = 100 / (colorPairing.length - 1);
            // Generate the gradient
            var linearGradient = DOMUtils.appendOrSelect(legend, 'linearGradient');
            linearGradient
                .attr('id', this.gradient_id + "-legend")
                .selectAll('stop')
                .data(colorPairing)
                .enter()
                .append('stop')
                .attr('offset', function (_, i) { return i * stopLengthPercentage_1 + "%"; })
                .attr('class', function (_, i) { return colorPairing[i]; })
                .attr('stop-color', function (d) { return d; });
            // Create the legend container
            var rectangle = DOMUtils.appendOrSelect(legend, 'rect');
            rectangle
                .attr('width', barWidth)
                .attr('height', Configuration.legend.color.barHeight)
                .style('fill', "url(#" + this.gradient_id + "-legend)");
            // Create scale & ticks
            var linearScale = scaleLinear()
                .domain(domain)
                .range([0, barWidth]);
            domain.splice(1, 0, (domain[0] + domain[1]) / 2);
            var xAxis = axisBottom(linearScale)
                .tickSize(0)
                .tickValues(domain);
            // Align axes at the bottom of the rectangle and delete the domain line
            axis.attr('transform', "translate(0," + Configuration.legend.color.axisYTranslation + ")").call(xAxis);
            // Remove domain
            axis.select('.domain').remove();
            // Align text to fit in container
            axis.style('text-anchor', 'start');
        }
        else if (colorScaleType === ColorLegendType.QUANTIZE) {
            // Generate equal chunks between range to act as ticks
            var interpolator = interpolateRound(domain[0], domain[1]);
            var quant_1 = quantize(interpolator, colorPairing.length);
            // If divergent && non-custom color, remove 0/white from being displayed
            if (!customColorsEnabled && colorScheme === 'diverge') {
                colorPairing.splice(colorPairing.length / 2, 1);
            }
            var colorScaleBand_1 = scaleBand()
                .domain(colorPairing)
                .range([0, barWidth]);
            // Render the quantized rectangles
            var rectangle = DOMUtils.appendOrSelect(legend, 'g.quantized-rect');
            rectangle
                .selectAll('rect')
                .data(colorScaleBand_1.domain())
                .join('rect')
                .attr('x', function (d) { return colorScaleBand_1(d); })
                .attr('y', 0)
                .attr('width', Math.max(0, colorScaleBand_1.bandwidth()) - 1)
                .attr('height', Configuration.legend.color.barHeight)
                .attr('class', function (d) { return d; })
                .attr('fill', function (d) { return d; });
            var xAxis = axisBottom(colorScaleBand_1)
                .tickSize(0)
                .tickValues(colorPairing)
                .tickFormat(function (_, i) {
                // Display every other tick to create space
                if (!customColorsEnabled &&
                    ((i + 1) % 2 === 0 || i === colorPairing.length - 1)) {
                    return null;
                }
                // Use the quant interpolators as ticks
                return quant_1[i].toString();
            });
            // Align axis to match bandwidth start after initial (white)
            var axisTranslation = colorScaleBand_1.bandwidth() / 2;
            axis.attr('transform', "translate(" + (!customColorsEnabled && colorScheme === 'diverge' ? '-' : '') + axisTranslation + ", " + Configuration.legend.color.axisYTranslation + ")").call(xAxis);
            // Append the last tick
            var firstTick = axis.select('g.tick').clone(true);
            firstTick
                .attr('transform', "translate(" + (barWidth +
                (!customColorsEnabled && colorScheme === 'diverge'
                    ? axisTranslation
                    : -axisTranslation)) + ", 0)")
                .classed('final-tick', true)
                .select('text')
                .text(quant_1[quant_1.length - 1]);
            axis.enter().append(firstTick.node());
            axis.select('.domain').remove();
        }
        else {
            throw Error('Entered color legend type is not supported.');
        }
        // Translate last axis tick if barWidth equals chart width
        if (width <= Configuration.legend.color.barWidth) {
            var lastTick = axis.select('g.tick:last-of-type text');
            var width_1 = DOMUtils.getSVGElementSize(lastTick, {
                useBBox: true,
            }).width;
            lastTick.attr('x', "-" + width_1);
        }
    };
    ColorScaleLegend.prototype.destroy = function () {
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Axis.RENDER_COMPLETE, this.handleAxisComplete);
    };
    return ColorScaleLegend;
}(Legend));
export { ColorScaleLegend };
//# sourceMappingURL=../../../src/components/essentials/color-scale-legend.js.map