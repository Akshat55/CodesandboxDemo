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
import { ChartModel } from './model';
import { Tools } from '../tools';
/** The meter chart model layer which extends some of the data setting options.
 * Meter only uses 1 dataset
 *  */
var MeterChartModel = /** @class */ (function (_super) {
    __extends(MeterChartModel, _super);
    function MeterChartModel(services) {
        return _super.call(this, services) || this;
    }
    MeterChartModel.prototype.getMaximumDomain = function (data) {
        var max = data.reduce(function (accumulator, datum) { return accumulator + datum.value; }, 0);
        return max;
    };
    /**
     * Use a provided color for the bar or default to carbon color if no status provided.
     * Defaults to carbon color otherwise.
     * @param group dataset group label
     */
    MeterChartModel.prototype.getFillColor = function (group) {
        var options = this.getOptions();
        var userProvidedScale = Tools.getProperty(options, 'color', 'scale');
        var status = this.getStatus();
        // user provided a fill color or there isn't a status we can use the colorScale
        if (userProvidedScale || !status) {
            return _super.prototype.getFillColor.call(this, group);
        }
        else {
            return null;
        }
    };
    /**
     * Get the associated status for the data by checking the ranges
     */
    MeterChartModel.prototype.getStatus = function () {
        var options = this.getOptions();
        var dataValues = Tools.getProperty(this.getDisplayData());
        var totalValue = (dataValues
            ? dataValues.reduce(function (previous, current) {
                return { value: previous.value + current.value };
            })
            : 0).value;
        // use max value if the percentage is bigger than 100%
        var boundedValue = Tools.getProperty(options, 'meter', 'proportional')
            ? totalValue
            : totalValue > 100
                ? 100
                : totalValue;
        // user needs to supply ranges
        var allRanges = Tools.getProperty(options, 'meter', 'status', 'ranges');
        if (allRanges) {
            var result = allRanges.filter(function (step) {
                return step.range[0] <= boundedValue &&
                    boundedValue <= step.range[1];
            });
            if (result.length > 0) {
                return result[0].status;
            }
        }
        return null;
    };
    MeterChartModel.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var status = this.getStatus();
        var proportional = Tools.getProperty(options, 'meter', 'proportional');
        var result = [];
        var domainMax;
        // Display the appropriate columns and fields depending on the type of meter
        if (proportional === null) {
            domainMax = 100;
            var datum = displayData[0];
            result = [
                __spreadArrays(['Group', 'Value'], (status ? ['Status'] : [])),
                __spreadArrays([
                    datum[groupMapsTo],
                    datum['value']
                ], (status ? [status] : [])),
            ];
        }
        else {
            var total = Tools.getProperty(proportional, 'total');
            domainMax = total ? total : this.getMaximumDomain(displayData);
            result = __spreadArrays([
                ['Group', 'Value', 'Percentage of total']
            ], displayData.map(function (datum) { return [
                datum[groupMapsTo],
                datum['value'],
                ((datum['value'] / domainMax) * 100).toFixed(2) + ' %',
            ]; }));
        }
        return result;
    };
    return MeterChartModel;
}(ChartModel));
export { MeterChartModel };
//# sourceMappingURL=../../src/model/meter.js.map