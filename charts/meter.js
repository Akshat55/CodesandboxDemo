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
import { MeterChartModel } from '../model/meter';
import { Chart } from '../chart';
import * as Configuration from '../configuration';
import { LayoutGrowth, LayoutDirection, RenderTypes, } from '../interfaces/index';
import { Tools } from '../tools';
import { Meter } from './../components/graphs/meter';
// Components
import { LayoutComponent, MeterTitle, Spacer, } from '../components/index';
var MeterChart = /** @class */ (function (_super) {
    __extends(MeterChart, _super);
    function MeterChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new MeterChartModel(_this.services);
        // use prop meter options or regular meter options
        var options = chartConfigs.options.meter.proportional
            ? Tools.merge(Tools.clone(Configuration.options.proportionalMeterChart), chartConfigs.options)
            : Tools.merge(Tools.clone(Configuration.options.meterChart), chartConfigs.options);
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(options);
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    MeterChart.prototype.getComponents = function () {
        // Specify what to render inside the graph only
        var graph = {
            id: 'meter-graph',
            components: [new Meter(this.model, this.services)],
            growth: LayoutGrowth.STRETCH,
            renderType: RenderTypes.SVG,
        };
        // Meter has an unique dataset title within the graph
        var titleComponent = {
            id: 'meter-title',
            components: [new MeterTitle(this.model, this.services)],
            growth: LayoutGrowth.STRETCH,
            renderType: RenderTypes.SVG,
        };
        // create the title spacer
        var titleSpacerComponent = {
            id: 'spacer',
            components: [new Spacer(this.model, this.services, { size: 8 })],
            growth: LayoutGrowth.STRETCH,
        };
        // the graph frame for meter includes the custom title (and spacer)
        var graphFrame = [
            new LayoutComponent(this.model, this.services, [titleComponent, titleSpacerComponent, graph], {
                direction: LayoutDirection.COLUMN,
            }),
        ];
        // add the meter title as a top level component
        var components = this.getChartComponents(graphFrame, {
            graphFrameRenderType: RenderTypes.HTML,
        });
        return components;
    };
    return MeterChart;
}(Chart));
export { MeterChart };
//# sourceMappingURL=../../src/charts/meter.js.map