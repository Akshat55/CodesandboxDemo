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
 * The treemap chart model layer
 */
var TreemapChartModel = /** @class */ (function (_super) {
    __extends(TreemapChartModel, _super);
    function TreemapChartModel(services) {
        return _super.call(this, services) || this;
    }
    TreemapChartModel.prototype.getTabularDataArray = function () {
        var displayData = this.getDisplayData();
        var result = [['Child', 'Group', 'Value']];
        displayData.forEach(function (datum) {
            datum.children.forEach(function (child) {
                result.push([child.name, datum.name, child.value]);
            });
        });
        return result;
    };
    return TreemapChartModel;
}(ChartModel));
export { TreemapChartModel };
//# sourceMappingURL=../../src/model/treemap.js.map