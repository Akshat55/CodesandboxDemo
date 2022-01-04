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
import { AxisFlavor, ScaleTypes } from '../interfaces';
import { ChartModelCartesian } from './cartesian-charts';
import { Tools } from '../tools';
// d3 imports
import { extent } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
/** The gauge chart model layer */
var HeatmapModel = /** @class */ (function (_super) {
    __extends(HeatmapModel, _super);
    function HeatmapModel(services) {
        var _this = _super.call(this, services) || this;
        _this.axisFlavor = AxisFlavor.HOVERABLE;
        _this._colorScale = undefined;
        // List of unique ranges and domains
        _this._domains = [];
        _this._ranges = [];
        _this._matrix = {};
        // Check which scale types are being used
        var axis = Tools.getProperty(_this.getOptions(), 'axes');
        // Need to check options since scale service hasn't been instantiated
        if ((!!Tools.getProperty(axis, 'left', 'scaleType') &&
            Tools.getProperty(axis, 'left', 'scaleType') !==
                ScaleTypes.LABELS) ||
            (!!Tools.getProperty(axis, 'right', 'scaleType') &&
                Tools.getProperty(axis, 'right', 'scaleType') !==
                    ScaleTypes.LABELS) ||
            (!!Tools.getProperty(axis, 'top', 'scaleType') &&
                Tools.getProperty(axis, 'top', 'scaleType') !==
                    ScaleTypes.LABELS) ||
            (!!Tools.getProperty(axis, 'bottom', 'scaleType') &&
                Tools.getProperty(axis, 'bottom', 'scaleType') !==
                    ScaleTypes.LABELS)) {
            throw Error('Heatmap only supports label scaletypes.');
        }
        return _this;
    }
    /**
     * Get min and maximum value of the display data
     * @returns Array consisting of smallest and largest values in  data
     */
    HeatmapModel.prototype.getValueDomain = function () {
        var data = this.getDisplayData().map(function (element) { return element.value; });
        var limits = extent(data);
        var domain = [];
        // Round extent values to the nearest multiple of 10
        // Axis rounds values to multiples of 2, 5, and 10s.
        limits.forEach(function (number, index) {
            var value = Number(number);
            if (index === 0 && value >= 0) {
                value = 0;
            }
            else if (value % 10 === 0 || value === 0) {
                value;
            }
            else if (value < 0) {
                value = Math.floor(value / 10) * 10;
            }
            else {
                value = Math.ceil(value / 10) * 10;
            }
            domain.push(value);
        });
        // Ensure the median of the range is 0
        if (domain[0] < 0 && domain[1] > 0) {
            if (Math.abs(domain[0]) > domain[1]) {
                domain[1] = Math.abs(domain[0]);
            }
            else {
                domain[0] = -domain[1];
            }
        }
        return domain;
    };
    /**
     * @override
     * @param value
     * @returns
     */
    HeatmapModel.prototype.getFillColor = function (value) {
        return this._colorScale(value);
    };
    /**
     * Generate a list of all unique domains
     * @returns String[]
     */
    HeatmapModel.prototype.getUniqueDomain = function () {
        if (Tools.isEmpty(this._domains)) {
            var displayData = this.getDisplayData();
            var cartesianScales = this.services.cartesianScales;
            var domainIdentifier_1 = cartesianScales.getDomainIdentifier();
            var mainXAxisPosition = cartesianScales.getMainXAxisPosition();
            var customDomain = cartesianScales.getCustomDomainValuesByposition(mainXAxisPosition);
            // Use user defined domain if specified
            if (!!customDomain) {
                return customDomain;
            }
            // Get unique axis values & create a matrix
            this._domains = Array.from(new Set(displayData.map(function (d) {
                return d[domainIdentifier_1];
            })));
        }
        return this._domains;
    };
    /**
     * Generates a list of all unique ranges
     * @returns String[]
     */
    HeatmapModel.prototype.getUniqueRanges = function () {
        if (Tools.isEmpty(this._ranges)) {
            var displayData = this.getDisplayData();
            var cartesianScales = this.services.cartesianScales;
            var rangeIdentifier_1 = cartesianScales.getRangeIdentifier();
            var mainYAxisPosition = cartesianScales.getMainYAxisPosition();
            var customDomain = cartesianScales.getCustomDomainValuesByposition(mainYAxisPosition);
            // Use user defined domain if specified
            if (!!customDomain) {
                return customDomain;
            }
            // Get unique axis values & create a matrix
            this._ranges = Array.from(new Set(displayData.map(function (d) {
                return d[rangeIdentifier_1];
            })));
        }
        return this._ranges;
    };
    /**
     * Generates a matrix (If doesn't exist) and returns it
     * @returns Object
     */
    HeatmapModel.prototype.getMatrix = function () {
        var _this = this;
        if (Tools.isEmpty(this._matrix)) {
            var uniqueDomain = this.getUniqueDomain();
            var uniqueRange = this.getUniqueRanges();
            var domainIdentifier_2 = this.services.cartesianScales.getDomainIdentifier();
            var rangeIdentifier_2 = this.services.cartesianScales.getRangeIdentifier();
            // Create a column
            var range_1 = {};
            uniqueRange.forEach(function (ran) {
                // Initialize matrix to empty state
                range_1[ran] = {
                    value: null,
                    index: -1,
                };
            });
            // Complete the matrix by cloning the column to all domains
            uniqueDomain.forEach(function (dom) {
                _this._matrix[dom] = Tools.clone(range_1);
            });
            // Fill in user passed data
            this.getDisplayData().forEach(function (d, i) {
                _this._matrix[d[domainIdentifier_2]][d[rangeIdentifier_2]] = {
                    value: d['value'],
                    index: i,
                };
            });
        }
        return this._matrix;
    };
    /**
     *
     * @param newData The new raw data to be set
     */
    HeatmapModel.prototype.setData = function (newData) {
        var sanitizedData = this.sanitize(Tools.clone(newData));
        var dataGroups = this.generateDataGroups(sanitizedData);
        this.set({
            data: sanitizedData,
            dataGroups: dataGroups,
        });
        // Set attributes to empty
        this._domains = [];
        this._ranges = [];
        this._matrix = {};
        return sanitizedData;
    };
    /**
     * Converts Object matrix into a single array
     * @returns Object[]
     */
    HeatmapModel.prototype.getMatrixAsArray = function () {
        var _this = this;
        if (Tools.isEmpty(this._matrix)) {
            this.getMatrix();
        }
        var uniqueDomain = this.getUniqueDomain();
        var uniqueRange = this.getUniqueRanges();
        var domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
        var rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
        var arr = [];
        uniqueDomain.forEach(function (domain) {
            uniqueRange.forEach(function (range) {
                var element = {
                    value: _this._matrix[domain][range].value,
                    index: _this._matrix[domain][range].index,
                };
                element[domainIdentifier] = domain;
                element[rangeIdentifier] = range;
                arr.push(element);
            });
        });
        return arr;
    };
    /**
     * Generate tabular data from display data
     * @returns Array<Object>
     */
    HeatmapModel.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        var _a = this.assignRangeAndDomains(), primaryDomain = _a.primaryDomain, primaryRange = _a.primaryRange, secondaryDomain = _a.secondaryDomain, secondaryRange = _a.secondaryRange;
        var domainValueFormatter;
        var result = __spreadArrays([
            [primaryDomain.label, primaryRange.label, 'Value']
        ], displayData.map(function (datum) { return [
            datum[primaryDomain.identifier] === null
                ? '&ndash;'
                : domainValueFormatter
                    ? domainValueFormatter(datum[primaryDomain.identifier])
                    : datum[primaryDomain.identifier],
            datum[primaryRange.identifier] === null
                ? '&ndash;'
                : datum[primaryRange.identifier].toLocaleString(),
            datum['value'],
        ]; }));
        return result;
    };
    // Uses quantize scale to return class names
    HeatmapModel.prototype.getColorClassName = function (configs) {
        return configs.originalClassName + " " + this._colorScale(configs.value);
    };
    HeatmapModel.prototype.setColorClassNames = function () {
        var options = this.getOptions();
        var customColors = Tools.getProperty(options, 'color', 'gradient', 'colors');
        var customColorsEnabled = !Tools.isEmpty(customColors);
        var colorPairingOption = Tools.getProperty(options, 'color', 'pairing', 'option');
        // If domain consists of negative and positive values, use diverging palettes
        var domain = this.getValueDomain();
        var colorScheme = domain[0] < 0 && domain[1] > 0 ? 'diverge' : 'mono';
        // Use default color pairing options if not in defined range
        if (colorPairingOption < 1 &&
            colorPairingOption > 4 &&
            colorScheme === 'mono') {
            colorPairingOption = 1;
        }
        else if (colorPairingOption < 1 &&
            colorPairingOption > 2 &&
            colorScheme === 'diverge') {
            colorPairingOption = 1;
        }
        // Uses css classes for fill
        var colorPairing = customColorsEnabled ? customColors : [];
        if (!customColorsEnabled) {
            // Add class names to list and the amount based on the color scheme
            // Carbon charts has 11 colors for a single monochromatic palette & 17 for a divergent palette
            var colorGroupingLength = colorScheme === 'diverge' ? 17 : 11;
            for (var i = 1; i < colorGroupingLength + 1; i++) {
                colorPairing.push("fill-" + colorScheme + "-" + colorPairingOption + "-" + i);
            }
        }
        // Save scale type
        this._colorScale = scaleQuantize()
            .domain(this.getValueDomain())
            .range(colorPairing);
    };
    return HeatmapModel;
}(ChartModelCartesian));
export { HeatmapModel };
//# sourceMappingURL=../../src/model/heatmap.js.map