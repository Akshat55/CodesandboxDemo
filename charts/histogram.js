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
import { ChartModelBinned } from '../model/binned-charts';
import { AxisChart } from '../axis-chart';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
// Components
import { Grid, Histogram, BinnedRuler, TwoDimensionalAxes, } from '../components/index';
var HistogramChart = /** @class */ (function (_super) {
    __extends(HistogramChart, _super);
    function HistogramChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new ChartModelBinned(_this.services);
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.histogramChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        _this.update();
        return _this;
    }
    HistogramChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new TwoDimensionalAxes(this.model, this.services),
            new Grid(this.model, this.services),
            new BinnedRuler(this.model, this.services),
            new Histogram(this.model, this.services),
        ];
        var components = this.getAxisChartComponents(graphFrameComponents);
        return components;
    };
    return HistogramChart;
}(AxisChart));
export { HistogramChart };
//# sourceMappingURL=../../src/charts/histogram.js.map