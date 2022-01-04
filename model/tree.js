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
import { ChartModel } from './model';
/**
 * The tree chart model layer
 */
var TreeChartModel = /** @class */ (function (_super) {
    __extends(TreeChartModel, _super);
    function TreeChartModel(services) {
        return _super.call(this, services) || this;
    }
    TreeChartModel.prototype.getTabularDataArray = function () {
        var _this = this;
        var displayData = this.getDisplayData();
        var result = [['Child', 'Parent']];
        displayData.forEach(function (datum) {
            // Call recurisve function
            _this.getChildrenDatums(datum, result);
            result.push([datum.name, '&ndash;']);
        });
        return result;
    };
    /**
     * Determine the child parent relationship in nested data
     * @param datum: Object
     * @param result: Array<Object>
     */
    TreeChartModel.prototype.getChildrenDatums = function (datum, result) {
        var _this = this;
        if (result === void 0) { result = []; }
        // Check to see if datum has children before iterating through it
        if (datum.children) {
            if (datum.children.length > 0) {
                datum.children.forEach(function (child) {
                    _this.getChildrenDatums(child, result);
                    result.push([child.name, datum.name]);
                });
            }
        }
    };
    return TreeChartModel;
}(ChartModel));
export { TreeChartModel };
//# sourceMappingURL=../../src/model/tree.js.map