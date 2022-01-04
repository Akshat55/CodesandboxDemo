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
/**
 * Bullet chart model layer
 */
var BulletChartModel = /** @class */ (function (_super) {
    __extends(BulletChartModel, _super);
    function BulletChartModel(services) {
        return _super.call(this, services) || this;
    }
    /**
     * Determines the index of the performance area titles to use
     * @param datum
     * @returns number
     */
    BulletChartModel.prototype.getMatchingRangeIndexForDatapoint = function (datum) {
        var matchingRangeIndex;
        for (var i = datum.ranges.length - 1; i > 0; i--) {
            var range = datum.ranges[i];
            if (datum.value >= range) {
                matchingRangeIndex = i;
                return matchingRangeIndex;
            }
        }
        return 0;
    };
    BulletChartModel.prototype.getTabularDataArray = function () {
        var _this = this;
        var displayData = this.getDisplayData();
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        var performanceAreaTitles = Tools.getProperty(options, 'bullet', 'performanceAreaTitles');
        var result = __spreadArrays([
            ['Title', 'Group', 'Value', 'Target', 'Percentage', 'Performance']
        ], displayData.map(function (datum) { return [
            datum['title'],
            datum[groupMapsTo],
            datum['value'] === null ? '&ndash;' : datum['value'],
            Tools.getProperty(datum, 'marker') === null
                ? '&ndash;'
                : datum['marker'],
            Tools.getProperty(datum, 'marker') === null
                ? '&ndash;'
                : Math.floor((datum[rangeIdentifier] / datum.marker) * 100) + "%",
            performanceAreaTitles[_this.getMatchingRangeIndexForDatapoint(datum)],
        ]; }));
        return result;
    };
    return BulletChartModel;
}(ChartModelCartesian));
export { BulletChartModel };
//# sourceMappingURL=../../src/model/bullet.js.map