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
import { Tools } from '../tools';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var RadarChartModel = /** @class */ (function (_super) {
    __extends(RadarChartModel, _super);
    function RadarChartModel(services) {
        return _super.call(this, services) || this;
    }
    RadarChartModel.prototype.getTabularDataArray = function () {
        var options = this.getOptions();
        var groupedData = this.getGroupedData();
        var _a = Tools.getProperty(options, 'radar', 'axes'), angle = _a.angle, value = _a.value;
        var additionalHeaders = Tools.getProperty(groupedData, '0', 'data').map(function (d) { return d[angle]; });
        var result = __spreadArrays([
            __spreadArrays(['Group'], additionalHeaders)
        ], groupedData.map(function (datum) {
            return __spreadArrays([
                datum['name']
            ], additionalHeaders.map(function (additionalHeader, i) {
                return Tools.getProperty(datum, 'data', i, value) !== null
                    ? Tools.getProperty(datum, 'data', i, value).toLocaleString()
                    : '&ndash;';
            }));
        }));
        return result;
    };
    return RadarChartModel;
}(ChartModelCartesian));
export { RadarChartModel };
//# sourceMappingURL=../../src/model/radar.js.map