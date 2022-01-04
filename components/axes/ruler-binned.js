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
import { Ruler } from './ruler';
import { DOMUtils } from '../../services';
import { CartesianOrientations, ColorClassNameTypes, Events, RenderTypes, } from '../../interfaces';
import { Tools } from '../../tools';
// D3 Imports
import { select } from 'd3-selection';
import { get } from 'lodash-es';
var BinnedRuler = /** @class */ (function (_super) {
    __extends(BinnedRuler, _super);
    function BinnedRuler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ruler-binned';
        _this.renderType = RenderTypes.SVG;
        return _this;
    }
    BinnedRuler.prototype.showRuler = function (event, _a) {
        var _this = this;
        var x = _a[0], y = _a[1];
        var svg = this.parent;
        var options = this.model.getOptions();
        var orientation = this.services.cartesianScales.getOrientation();
        var rangeScale = this.services.cartesianScales.getRangeScale();
        var _b = rangeScale.range(), yScaleEnd = _b[0], yScaleStart = _b[1];
        var domainScale = this.services.cartesianScales.getDomainScale();
        var correspondingDomainValue = domainScale.invert(orientation === CartesianOrientations.VERTICAL ? x : y);
        var ruler = DOMUtils.appendOrSelect(svg, 'g.ruler').attr('aria-label', 'ruler');
        var rulerLine = DOMUtils.appendOrSelect(ruler, 'line.ruler-line');
        var dataPointElements = svg.selectAll('[role=graphics-symbol]');
        var elementsToHighlight = dataPointElements.filter(function (d) {
            if (parseFloat(get(d, 'data.x0')) <= correspondingDomainValue &&
                parseFloat(get(d, 'data.x1')) >= correspondingDomainValue) {
                return true;
            }
        });
        // some data point match
        if (elementsToHighlight.size() > 0) {
            /** if we pass from a trigger area to another one
             * mouseout on previous elements won't get dispatched
             * so we need to do it manually
             */
            if (this.elementsToHighlight &&
                this.elementsToHighlight.size() > 0 &&
                !Tools.isEqual(this.elementsToHighlight, elementsToHighlight)) {
                this.hideRuler();
            }
            elementsToHighlight.dispatch('mouseover');
            // set current hovered elements
            this.elementsToHighlight = elementsToHighlight;
            var sampleMatchData_1 = select(elementsToHighlight.nodes()[0]).datum();
            var x0 = parseFloat(get(sampleMatchData_1, 'data.x0'));
            var x1 = parseFloat(get(sampleMatchData_1, 'data.x1'));
            var activeDataGroupNames = this.model.getActiveDataGroupNames();
            var tooltipDataGroups = activeDataGroupNames
                .reverse()
                .map(function (dataGroupName) { return ({
                label: dataGroupName,
                value: get(sampleMatchData_1, "data." + dataGroupName),
                class: _this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.TOOLTIP],
                    dataGroupName: dataGroupName,
                }),
            }); })
                .filter(function (d) { return d.value !== 0; });
            var thereIsMatchingData = tooltipDataGroups.length > 0;
            if (thereIsMatchingData) {
                this.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    mousePosition: [x, y],
                    hoveredElement: rulerLine,
                    items: __spreadArrays([
                        {
                            label: get(options, 'bins.rangeLabel') || 'Range',
                            value: x0 + " \u2013 " + x1,
                        }
                    ], tooltipDataGroups, (Tools.getProperty(options, 'tooltip', 'showTotal') === true
                        ? [
                            {
                                label: get(options, 'tooltip.totalLabel') || 'Total',
                                value: activeDataGroupNames.reduce(function (accum, currentValue) {
                                    return accum +
                                        parseFloat(get(sampleMatchData_1, "data." + currentValue));
                                }, 0),
                            },
                        ]
                        : [])),
                });
                ruler.attr('opacity', 1);
                var rulerPosition = domainScale((x0 + x1) / 2);
                // line snaps to matching point
                if (orientation === 'horizontal') {
                    rulerLine
                        .attr('x1', yScaleStart)
                        .attr('x2', yScaleEnd)
                        .attr('y1', rulerPosition)
                        .attr('y2', rulerPosition);
                }
                else {
                    rulerLine
                        .attr('y1', yScaleStart)
                        .attr('y2', yScaleEnd)
                        .attr('x1', rulerPosition)
                        .attr('x2', rulerPosition);
                }
            }
            else {
                this.hideRuler();
            }
        }
        else {
            this.hideRuler();
        }
    };
    return BinnedRuler;
}(Ruler));
export { BinnedRuler };
//# sourceMappingURL=../../../src/components/axes/ruler-binned.js.map