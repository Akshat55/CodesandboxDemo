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
import { get } from 'lodash-es';
/**
 * this is intended for binned type of charts
 * */
var ChartModelBinned = /** @class */ (function (_super) {
    __extends(ChartModelBinned, _super);
    function ChartModelBinned() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartModelBinned.prototype.getTabularDataArray = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var binnedStackedData = this.getBinnedStackedData();
        var result = __spreadArrays([
            __spreadArrays([
                get(options, 'bins.rangeLabel') || 'Range'
            ], binnedStackedData.map(function (datum) {
                return get(datum, "0." + groupMapsTo);
            }))
        ], get(binnedStackedData, 0).map(function (d, i) { return __spreadArrays([
            get(d, 'data.x0') + " \u2013 " + get(d, 'data.x1')
        ], binnedStackedData.map(function (datum) {
            return get(datum[i], "data." + get(datum[i], groupMapsTo));
        })); }));
        return result;
    };
    return ChartModelBinned;
}(ChartModelCartesian));
export { ChartModelBinned };
//# sourceMappingURL=../../src/model/binned-charts.js.map