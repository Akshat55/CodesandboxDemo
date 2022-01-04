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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Internal Imports
import { ChartModel } from './model';
import { Tools } from '../tools';
import { LegendItemType } from '../interfaces/enums';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var CirclePackChartModel = /** @class */ (function (_super) {
    __extends(CirclePackChartModel, _super);
    function CirclePackChartModel(services) {
        var _this = _super.call(this, services) || this;
        _this.parentNode = false;
        _this.set({ depth: 2 }, { skipUpdate: true });
        return _this;
    }
    CirclePackChartModel.prototype.setData = function (newData) {
        _super.prototype.setData.call(this, newData);
        this.setDataGroups();
        if (newData.length === 1) {
            this.parentNode = true;
        }
        this.setZoom();
    };
    CirclePackChartModel.prototype.setOptions = function (newOptions) {
        var options = this.getOptions();
        var zoomOptions = Tools.merge({}, newOptions, this.getZoomOptions(newOptions));
        Tools.updateLegendAdditionalItems(options, zoomOptions);
        var depth = this.getHierarchyLevel();
        var userProvidedDepth = Tools.getProperty(options, 'circlePack', 'hierarchyLevel');
        this.set({
            options: Tools.merge(options, zoomOptions),
            depth: userProvidedDepth && userProvidedDepth < 4
                ? userProvidedDepth
                : depth,
        });
    };
    CirclePackChartModel.prototype.getZoomOptions = function (options) {
        if (!this.getDisplayData()) {
            return {};
        }
        // uses the user provided options and data to determine if there is zoom in this CP chart
        var displayData = this.getDisplayData();
        var zoomOptions = options ? options : this.getOptions();
        var data = displayData.length === 1 &&
            Tools.getProperty(displayData, 0, 'children')
            ? Tools.getProperty(displayData, 0, 'children')
            : displayData;
        var depth = this.getHierarchyLevel();
        // check the data depth
        data.some(function (datum) {
            if (datum.children) {
                if (datum.children.some(function (item) { return item.children; })) {
                    depth = 3;
                    return false;
                }
            }
        });
        if (Tools.getProperty(zoomOptions, 'canvasZoom', 'enabled') === true &&
            depth > 2) {
            return {
                legend: {
                    additionalItems: [
                        {
                            type: LegendItemType.ZOOM,
                            name: 'Click to zoom',
                        },
                    ],
                },
            };
        }
        return null;
    };
    CirclePackChartModel.prototype.setZoom = function (options) {
        this.setOptions(this.getZoomOptions(options));
    };
    // update the hierarchy level
    CirclePackChartModel.prototype.updateHierarchyLevel = function (depth) {
        this.set({ depth: depth });
    };
    CirclePackChartModel.prototype.getHierarchyLevel = function () {
        return this.get('depth');
    };
    CirclePackChartModel.prototype.hasParentNode = function () {
        return this.parentNode;
    };
    // set the datagroup name on the items that are it's children
    CirclePackChartModel.prototype.setDataGroups = function () {
        var _this = this;
        var data = this.getData();
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var newData = data.map(function (depthOne) {
            var groupName = depthOne[groupMapsTo];
            return _this.setChildrenDataGroup(depthOne, groupName);
        });
        this.set({
            data: newData,
        }, { skipUpdate: true });
    };
    // sets name recursively down the node tree
    CirclePackChartModel.prototype.setChildrenDataGroup = function (node, name) {
        var _this = this;
        if (node.children) {
            return __assign(__assign({}, node), { dataGroupName: name, children: node.children.map(function (child, i) {
                    return _this.setChildrenDataGroup(child, name);
                }) });
        }
        else {
            return __assign(__assign({}, node), { dataGroupName: name });
        }
    };
    CirclePackChartModel.prototype.getTabularDataArray = function () {
        var _this = this;
        var displayData = this.getDisplayData();
        var result = [['Child', 'Parent', 'Value']];
        displayData.forEach(function (datum) {
            var value = datum.value ? datum.value : 0;
            if (datum.children) {
                // Call recursive function
                value += _this.getChildrenDatums(datum.children, datum.name, result, 0);
            }
            result.push(['&ndash;', datum.name, value]);
        });
        return result;
    };
    /**
     * Recursively determine the relationship between all the nested elements in the child
     * @param children: Object
     * @param parent: String
     * @param result: Array<Object>
     * @param totalSum: number
     * @returns: number
     */
    CirclePackChartModel.prototype.getChildrenDatums = function (children, parent, result, totalSum) {
        var _this = this;
        if (result === void 0) { result = []; }
        if (totalSum === void 0) { totalSum = 0; }
        var grandParent = parent;
        children.forEach(function (child) {
            var parent = child.name;
            var sum = 0;
            if (child.children) {
                if (child.children.length > 0) {
                    if (typeof child.value === 'number') {
                        totalSum += child.value;
                    }
                    sum += _this.getChildrenDatums(child.children, parent, result, sum);
                    result.push([parent, grandParent, sum]);
                    totalSum += sum;
                }
            }
            else {
                var value = 0;
                if (typeof child.value === 'number') {
                    value = child.value;
                    totalSum += child.value;
                }
                result.push([child.name, grandParent, value]);
            }
        });
        return totalSum;
    };
    return CirclePackChartModel;
}(ChartModel));
export { CirclePackChartModel };
//# sourceMappingURL=../../src/model/circle-pack.js.map