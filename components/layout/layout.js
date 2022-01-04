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
import { Component } from '../component';
import { LayoutDirection, LayoutGrowth, RenderTypes, LayoutAlignItems, } from '../../interfaces/index';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
// D3 Imports
import { select } from 'd3-selection';
// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
var LayoutComponent = /** @class */ (function (_super) {
    __extends(LayoutComponent, _super);
    function LayoutComponent(model, services, children, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = 'layout';
        _this.configs = configs;
        _this.children = children;
        _this._instanceID = LayoutComponent.instanceID++;
        _this.init();
        return _this;
    }
    LayoutComponent.prototype.init = function () {
        this.children.forEach(function (child) {
            child.components.forEach(function (component) {
                component.init();
            });
        });
    };
    LayoutComponent.prototype.getPreferedAndFixedSizeSum = function () {
        var svg = this.parent;
        var sum = 0;
        svg.selectAll("div.layout-child-" + this._instanceID)
            .filter(function (d) {
            var growth = Tools.getProperty(d, 'growth');
            return (growth === LayoutGrowth.PREFERRED ||
                growth === LayoutGrowth.FIXED);
        })
            .each(function (d) {
            sum += d.size;
        });
        return sum;
    };
    LayoutComponent.prototype.getNumOfStretchChildren = function () {
        var svg = this.parent;
        return svg
            .selectAll("div.layout-child-" + this._instanceID)
            .filter(function (d) {
            return Tools.getProperty(d, 'growth') === LayoutGrowth.STRETCH;
        })
            .size();
    };
    LayoutComponent.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        // Get parent element to render inside of
        var parent = this.parent;
        var _a = DOMUtils.getHTMLElementSize(parent.node()), width = _a.width, height = _a.height;
        var horizontal = this.configs.direction === LayoutDirection.ROW ||
            this.configs.direction === LayoutDirection.ROW_REVERSE;
        var chartprefix = Tools.getProperty(this.model.getOptions(), 'style', 'prefix');
        // Add new boxes to the DOM for each layout child
        var updatedBoxes = parent
            .classed(settings.prefix + "--" + chartprefix + "--layout-row", this.configs.direction === LayoutDirection.ROW)
            .classed(settings.prefix + "--" + chartprefix + "--layout-row-reverse", this.configs.direction === LayoutDirection.ROW_REVERSE)
            .classed(settings.prefix + "--" + chartprefix + "--layout-column", this.configs.direction === LayoutDirection.COLUMN)
            .classed(settings.prefix + "--" + chartprefix + "--layout-column-reverse", this.configs.direction === LayoutDirection.COLUMN_REVERSE)
            .classed(settings.prefix + "--" + chartprefix + "--layout-alignitems-center", this.configs.alignItems === LayoutAlignItems.CENTER)
            .selectAll("div.layout-child-" + this._instanceID)
            .data(this.children, function (d) { return d.id; });
        var enteringBoxes = updatedBoxes.enter().append('div');
        enteringBoxes
            .merge(parent.selectAll("div.layout-child-" + this._instanceID))
            .attr('class', function (d) {
            return "layout-child layout-child-" + _this._instanceID + " " + d.id;
        })
            .each(function (d) {
            var _this = this;
            // Set parent component for each child
            d.components.forEach(function (itemComponent) {
                var selection = select(_this);
                var renderType = Tools.getProperty(d, 'renderType');
                var isRenderingSVG = renderType === RenderTypes.SVG;
                itemComponent.setParent(isRenderingSVG
                    ? DOMUtils.appendOrSelect(selection, 'svg.layout-svg-wrapper')
                        .attr('width', '100%')
                        .attr('height', '100%')
                    : selection);
                // Render preffered & fixed items
                var growth = Tools.getProperty(d, 'growth');
                if (growth === LayoutGrowth.PREFERRED ||
                    growth === LayoutGrowth.FIXED) {
                    itemComponent.render(animate);
                }
            });
        });
        parent
            .selectAll("div.layout-child-" + this._instanceID)
            .style('height', null)
            .style('width', null)
            .each(function (d) {
            // Calculate preffered children sizes after internal rendering
            var growth = Tools.getProperty(d, 'growth');
            var renderType = Tools.getProperty(d, 'renderType');
            var matchingElementDimensions = renderType === RenderTypes.SVG
                ? DOMUtils.getSVGElementSize(select(this).select('svg.layout-svg-wrapper'), {
                    useBBox: true,
                })
                : DOMUtils.getHTMLElementSize(this);
            if (growth === LayoutGrowth.PREFERRED) {
                var matchingElementWidth = horizontal
                    ? matchingElementDimensions.width
                    : matchingElementDimensions.height;
                var elementWidth = horizontal ? width : height;
                d.size = (matchingElementWidth / elementWidth) * 100;
            }
        });
        updatedBoxes.exit().remove();
        // Run through stretch x-items
        this.children
            .filter(function (child) {
            var growth = Tools.getProperty(child, 'growth');
            return growth === LayoutGrowth.STRETCH;
        })
            .forEach(function (child, i) {
            child.size =
                (100 - +_this.getPreferedAndFixedSizeSum()) /
                    +_this.getNumOfStretchChildren();
        });
        // Update all boxes with new sizing
        var allUpdatedBoxes = parent
            .selectAll("div.layout-child-" + this._instanceID)
            .data(this.children, function (d) { return d.id; });
        if (horizontal) {
            allUpdatedBoxes
                .style('width', function (d) { return (d.size / 100) * width + "px"; })
                .style('height', '100%');
        }
        else {
            allUpdatedBoxes
                .style('height', function (d) { return (d.size / 100) * height + "px"; })
                .style('width', '100%');
        }
        allUpdatedBoxes.each(function (d, i) {
            d.components.forEach(function (itemComponent) {
                var growth = Tools.getProperty(d, 'growth');
                if (growth === LayoutGrowth.STRETCH) {
                    itemComponent.render(animate);
                }
            });
        });
    };
    // Pass on model to children as well
    LayoutComponent.prototype.setModel = function (newObj) {
        _super.prototype.setModel.call(this, newObj);
        this.children.forEach(function (child) {
            child.components.forEach(function (component) { return component.setModel(newObj); });
        });
    };
    // Pass on essentials to children as well
    LayoutComponent.prototype.setServices = function (newObj) {
        _super.prototype.setServices.call(this, newObj);
        this.children.forEach(function (child) {
            child.components.forEach(function (component) {
                return component.setServices(newObj);
            });
        });
    };
    LayoutComponent.prototype.destroy = function () {
        this.children.forEach(function (child) {
            child.components.forEach(function (component) { return component.destroy(); });
        });
    };
    // Give every layout component a distinct ID
    // so they don't interfere when querying elements
    LayoutComponent.instanceID = Math.floor(Math.random() * 99999999999);
    return LayoutComponent;
}(Component));
export { LayoutComponent };
//# sourceMappingURL=../../../src/components/layout/layout.js.map