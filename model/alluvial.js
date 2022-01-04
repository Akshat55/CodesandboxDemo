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
import { ChartModelCartesian } from './cartesian-charts';
/**
 * Alluvial chart model layer
 */
var AlluvialChartModel = /** @class */ (function (_super) {
    __extends(AlluvialChartModel, _super);
    function AlluvialChartModel(services) {
        return _super.call(this, services) || this;
    }
    AlluvialChartModel.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        // Sort array by source to get a close depiction of the alluvial chart
        displayData.sort(function (a, b) { return a['source'].localeCompare(b['source']); });
        var result = __spreadArrays([
            ['Source', 'Target', 'Value']
        ], displayData.map(function (datum) { return [
            datum['source'],
            datum['target'],
            datum['value'],
        ]; }));
        return result;
    };
    return AlluvialChartModel;
}(ChartModelCartesian));
export { AlluvialChartModel };
//# sourceMappingURL=../../src/model/alluvial.js.map