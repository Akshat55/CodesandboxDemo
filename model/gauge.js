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
import { ChartModel } from './model';
/**
 * The gauge chart model layer
 */
var GaugeChartModel = /** @class */ (function (_super) {
    __extends(GaugeChartModel, _super);
    function GaugeChartModel(services) {
        return _super.call(this, services) || this;
    }
    GaugeChartModel.prototype.getDataGroups = function () {
        return _super.prototype.getDataGroups.call(this).filter(function (item) { return item.name !== 'delta'; });
    };
    GaugeChartModel.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var result = __spreadArrays([
            ['Group', 'Value']
        ], displayData.map(function (datum) { return [
            datum[groupMapsTo],
            datum['value'] === null
                ? '&ndash;'
                : datum['value'].toLocaleString(),
        ]; }));
        return result;
    };
    return GaugeChartModel;
}(ChartModel));
export { GaugeChartModel };
//# sourceMappingURL=../../src/model/gauge.js.map