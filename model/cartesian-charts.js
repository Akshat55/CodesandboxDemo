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
import { Tools } from '../tools';
import { ScaleTypes, AxisPositions, AxisFlavor } from '../interfaces';
// date formatting
import { format } from 'date-fns';
/**
 * This supports adding X and Y Cartesian[2D] zoom data to a ChartModel
 * */
var ChartModelCartesian = /** @class */ (function (_super) {
    __extends(ChartModelCartesian, _super);
    function ChartModelCartesian(services) {
        var _this = _super.call(this, services) || this;
        _this.axisFlavor = AxisFlavor.DEFAULT;
        return _this;
    }
    // get the scales information
    // needed for getTabularArray()
    ChartModelCartesian.prototype.assignRangeAndDomains = function () {
        var cartesianScales = this.services.cartesianScales;
        var options = this.getOptions();
        var isDualAxes = cartesianScales.isDualAxes();
        var scales = {
            primaryDomain: cartesianScales.domainAxisPosition,
            primaryRange: cartesianScales.rangeAxisPosition,
            secondaryDomain: null,
            secondaryRange: null,
        };
        if (isDualAxes) {
            scales.secondaryDomain =
                cartesianScales.secondaryDomainAxisPosition;
            scales.secondaryRange = cartesianScales.secondaryRangeAxisPosition;
        }
        Object.keys(scales).forEach(function (scale) {
            var position = scales[scale];
            if (cartesianScales.scales[position]) {
                scales[scale] = {
                    position: position,
                    label: cartesianScales.getScaleLabel(position),
                    identifier: Tools.getProperty(options, 'axes', position, 'mapsTo'),
                };
            }
            else {
                scales[scale] = null;
            }
        });
        return scales;
    };
    ChartModelCartesian.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var cartesianScales = this.services.cartesianScales;
        var _a = this.assignRangeAndDomains(), primaryDomain = _a.primaryDomain, primaryRange = _a.primaryRange, secondaryDomain = _a.secondaryDomain, secondaryRange = _a.secondaryRange;
        var domainScaleType = cartesianScales.getDomainAxisScaleType();
        var domainValueFormatter;
        if (domainScaleType === ScaleTypes.TIME) {
            domainValueFormatter = function (d) { return format(d, 'MMM d, yyyy'); };
        }
        var result = __spreadArrays([
            __spreadArrays([
                'Group',
                primaryDomain.label,
                primaryRange.label
            ], (secondaryDomain ? [secondaryDomain.label] : []), (secondaryRange ? [secondaryRange.label] : []))
        ], displayData.map(function (datum) { return __spreadArrays([
            datum[groupMapsTo],
            datum[primaryDomain.identifier] === null
                ? '&ndash;'
                : domainValueFormatter
                    ? domainValueFormatter(datum[primaryDomain.identifier])
                    : datum[primaryDomain.identifier],
            datum[primaryRange.identifier] === null ||
                isNaN(datum[primaryRange.identifier])
                ? '&ndash;'
                : datum[primaryRange.identifier].toLocaleString()
        ], (secondaryDomain
            ? [
                datum[secondaryDomain.identifier] === null
                    ? '&ndash;'
                    : datum[secondaryDomain.identifier],
            ]
            : []), (secondaryRange
            ? [
                datum[secondaryRange.identifier] === null ||
                    isNaN(datum[secondaryRange.identifier])
                    ? '&ndash;'
                    : datum[secondaryRange.identifier],
            ]
            : [])); }));
        return result;
    };
    ChartModelCartesian.prototype.setData = function (newData) {
        var data;
        if (newData) {
            data = _super.prototype.setData.call(this, newData);
            if (Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'enabled')) {
                // get pre-defined zoom bar data
                var definedZoomBarData = Tools.getProperty(this.getOptions(), 'zoomBar', AxisPositions.TOP, 'data');
                // if we have zoom bar data we need to update it as well
                // with pre-defined zoom bar data
                this.setZoomBarData(definedZoomBarData);
            }
        }
        return data;
    };
    /**
     * @param zoomBarData any special zoom bar data to use instead of the model data
     */
    ChartModelCartesian.prototype.setZoomBarData = function (newZoomBarData) {
        var sanitizedData = newZoomBarData
            ? this.sanitize(Tools.clone(newZoomBarData))
            : this.getDisplayData(); // if we're not passed explicit zoom data use the model
        var zoomBarNormalizedValues = sanitizedData;
        var cartesianScales = this.services.cartesianScales;
        if (sanitizedData &&
            cartesianScales.domainAxisPosition &&
            cartesianScales.rangeAxisPosition) {
            var domainIdentifier_1 = cartesianScales.getDomainIdentifier();
            var rangeIdentifier_1 = cartesianScales.getRangeIdentifier();
            // get all dates (Number) in displayData
            var allDates = sanitizedData.map(function (datum) {
                return datum[domainIdentifier_1].getTime();
            });
            allDates = Tools.removeArrayDuplicates(allDates).sort();
            // Go through all date values
            // And get corresponding data from each dataset
            zoomBarNormalizedValues = allDates.map(function (date) {
                var sum = 0;
                var datum = {};
                sanitizedData.forEach(function (data) {
                    if (data[domainIdentifier_1].getTime() === date) {
                        sum += data[rangeIdentifier_1];
                    }
                });
                datum[domainIdentifier_1] = new Date(date);
                datum[rangeIdentifier_1] = sum;
                return datum;
            });
        }
        this.set({ zoomBarData: zoomBarNormalizedValues });
    };
    ChartModelCartesian.prototype.getZoomBarData = function () {
        return this.get('zoomBarData');
    };
    ChartModelCartesian.prototype.sanitizeDateValues = function (data) {
        var options = this.getOptions();
        if (!options.axes) {
            return data;
        }
        var keysToCheck = [];
        Object.keys(AxisPositions).forEach(function (axisPositionKey) {
            var axisPosition = AxisPositions[axisPositionKey];
            var axisOptions = options.axes[axisPosition];
            if (axisOptions && axisOptions.scaleType === ScaleTypes.TIME) {
                var axisMapsTo = axisOptions.mapsTo;
                if (axisMapsTo !== null || axisMapsTo !== undefined) {
                    keysToCheck.push(axisMapsTo);
                }
            }
        });
        if (keysToCheck.length > 0) {
            // Check all datapoints and sanitize dates
            data.forEach(function (datum) {
                keysToCheck.forEach(function (key) {
                    if (Tools.getProperty(datum, key, 'getTime') === null) {
                        datum[key] = new Date(datum[key]);
                    }
                });
            });
        }
        return data;
    };
    ChartModelCartesian.prototype.sanitize = function (data) {
        data = _super.prototype.sanitize.call(this, data);
        data = this.sanitizeDateValues(data);
        return data;
    };
    return ChartModelCartesian;
}(ChartModel));
export { ChartModelCartesian };
//# sourceMappingURL=../../src/model/cartesian-charts.js.map