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
import { HeatmapModel } from '../model/heatmap';
import { AxisChart } from '../axis-chart';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
import { LayoutDirection, LayoutGrowth, RenderTypes, LayoutAlignItems, } from '../interfaces/index';
import { Heatmap, TwoDimensionalAxes, Modal, LayoutComponent, ColorScaleLegend, Title, AxisChartsTooltip, Spacer, Toolbar, } from '../components';
var HeatmapChart = /** @class */ (function (_super) {
    __extends(HeatmapChart, _super);
    function HeatmapChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new HeatmapModel(_this.services);
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.heatmapChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    // Custom getChartComponents - Implements getChartComponents
    // Removes zoombar support and additional `features` that are not supported in heatmap
    HeatmapChart.prototype.getAxisChartComponents = function (graphFrameComponents, configs) {
        var options = this.model.getOptions();
        var toolbarEnabled = Tools.getProperty(options, 'toolbar', 'enabled');
        this.services.cartesianScales.determineAxisDuality();
        this.services.cartesianScales.findDomainAndRangeAxes(); // need to do this before getMainXAxisPosition()
        this.services.cartesianScales.determineOrientation();
        var titleAvailable = !!this.model.getOptions().title;
        var titleComponent = {
            id: 'title',
            components: [new Title(this.model, this.services)],
            growth: LayoutGrowth.STRETCH,
        };
        var toolbarComponent = {
            id: 'toolbar',
            components: [new Toolbar(this.model, this.services)],
            growth: LayoutGrowth.PREFERRED,
        };
        var headerComponent = {
            id: 'header',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays([
                    // always add title to keep layout correct
                    titleComponent
                ], (toolbarEnabled ? [toolbarComponent] : [])), {
                    direction: LayoutDirection.ROW,
                    alignItems: LayoutAlignItems.CENTER,
                }),
            ],
            growth: LayoutGrowth.PREFERRED,
        };
        var legendComponent = {
            id: 'legend',
            components: [new ColorScaleLegend(this.model, this.services)],
            growth: LayoutGrowth.PREFERRED,
            renderType: RenderTypes.SVG,
        };
        var graphFrameComponent = {
            id: 'graph-frame',
            components: graphFrameComponents,
            growth: LayoutGrowth.STRETCH,
            renderType: RenderTypes.SVG,
        };
        var isLegendEnabled = Tools.getProperty(configs, 'legend', 'enabled') !== false &&
            this.model.getOptions().legend.enabled !== false;
        // Decide the position of the legend in reference to the chart
        var fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
        var legendSpacerComponent = {
            id: 'spacer',
            components: [new Spacer(this.model, this.services, { size: 15 })],
            growth: LayoutGrowth.PREFERRED,
        };
        var fullFrameComponent = {
            id: 'full-frame',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays((isLegendEnabled ? [legendComponent] : []), (isLegendEnabled ? [legendSpacerComponent] : []), [
                    graphFrameComponent,
                ]), {
                    direction: fullFrameComponentDirection,
                }),
            ],
            growth: LayoutGrowth.STRETCH,
        };
        var topLevelLayoutComponents = [];
        // header component is required for either title or toolbar
        if (titleAvailable || toolbarEnabled) {
            topLevelLayoutComponents.push(headerComponent);
            var titleSpacerComponent = {
                id: 'spacer',
                components: [
                    new Spacer(this.model, this.services, toolbarEnabled ? { size: 15 } : undefined),
                ],
                growth: LayoutGrowth.PREFERRED,
            };
            topLevelLayoutComponents.push(titleSpacerComponent);
        }
        topLevelLayoutComponents.push(fullFrameComponent);
        return [
            new AxisChartsTooltip(this.model, this.services),
            new Modal(this.model, this.services),
            new LayoutComponent(this.model, this.services, topLevelLayoutComponents, {
                direction: LayoutDirection.COLUMN,
            }),
        ];
    };
    HeatmapChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new TwoDimensionalAxes(this.model, this.services),
            new Heatmap(this.model, this.services),
        ];
        var components = this.getAxisChartComponents(graphFrameComponents);
        return components;
    };
    return HeatmapChart;
}(AxisChart));
export { HeatmapChart };
//# sourceMappingURL=../../src/charts/heatmap.js.map