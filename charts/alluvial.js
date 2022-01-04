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
import { Chart } from '../chart';
import { AlluvialChartModel } from '../model/alluvial';
import * as Configuration from '../configuration';
import { Tools } from '../tools';
// Components
import { Alluvial, } from '../components/index';
var AlluvialChart = /** @class */ (function (_super) {
    __extends(AlluvialChart, _super);
    function AlluvialChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new AlluvialChartModel(_this.services);
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.mergeDefaultChartOptions(Configuration.options.alluvialChart, chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    AlluvialChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new Alluvial(this.model, this.services),
        ];
        var components = this.getChartComponents(graphFrameComponents, {
            excludeLegend: true,
        });
        return components;
    };
    return AlluvialChart;
}(Chart));
export { AlluvialChart };
//# sourceMappingURL=../../src/charts/alluvial.js.map