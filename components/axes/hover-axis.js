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
import { Axis } from './axis';
import { AxisPositions, Events, ScaleTypes } from '../../interfaces';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import * as Configuration from '../../configuration';
// D3 Imports
import { select } from 'd3-selection';
var HoverAxis = /** @class */ (function (_super) {
    __extends(HoverAxis, _super);
    function HoverAxis(model, services, configs) {
        return _super.call(this, model, services, configs) || this;
    }
    HoverAxis.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        _super.prototype.render.call(this, animate);
        // Remove existing event listeners to avoid flashing behavior
        _super.prototype.destroy.call(this);
        var axisPosition = this.configs.position;
        var svg = this.getComponentContainer();
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        var self = this;
        container.selectAll('g.tick').each(function (_, index) {
            var g = select(this);
            g.classed('tick-hover', true).attr('tabindex', index === 0 ? 0 : -1);
            var textNode = g.select('text');
            var _a = DOMUtils.getSVGElementSize(textNode, {
                useBBox: true,
            }), width = _a.width, height = _a.height;
            var rectangle = DOMUtils.appendOrSelect(g, 'rect.axis-holder');
            var x = 0, y = 0;
            // Depending on axis position, apply correct translation & rotation to align the rect
            // with the text
            switch (axisPosition) {
                case AxisPositions.LEFT:
                    x = -width + Number(textNode.attr('x'));
                    y = -(height / 2);
                    break;
                case AxisPositions.RIGHT:
                    x = Math.abs(Number(textNode.attr('x')));
                    y = -(height / 2);
                    break;
                case AxisPositions.TOP:
                    x = -(width / 2);
                    y = -height + Number(textNode.attr('y')) / 2;
                    if (self.truncation[axisPosition]) {
                        x = 0;
                        rectangle.attr('transform', "rotate(-45)");
                    }
                    break;
                case AxisPositions.BOTTOM:
                    x = -(width / 2);
                    y = height / 2 - 2;
                    if (self.truncation[axisPosition]) {
                        x = -width;
                        rectangle.attr('transform', "rotate(-45)");
                    }
                    break;
            }
            // Translates x position -4 left to keep center after padding
            // Adds padding on left & right
            rectangle
                .attr('x', x - Configuration.axis.hover.rectanglePadding)
                .attr('y', y)
                .attr('width', width + Configuration.axis.hover.rectanglePadding * 2)
                .attr('height', height)
                .lower();
            // Add keyboard event listeners to each group element
            g.on('keydown', function (event) {
                // Choose specific arrow key depending on the axis
                if (axisPosition === AxisPositions.LEFT ||
                    axisPosition === AxisPositions.RIGHT) {
                    if (event.key && event.key === 'ArrowUp') {
                        self.goNext(this, event);
                    }
                    else if (event.key && event.key === 'ArrowDown') {
                        self.goPrevious(this, event);
                    }
                }
                else {
                    if (event.key && event.key === 'ArrowLeft') {
                        self.goPrevious(this, event);
                    }
                    else if (event.key && event.key === 'ArrowRight') {
                        self.goNext(this, event);
                    }
                }
            });
        });
        // Add event listeners to element group
        this.addEventListeners();
    };
    HoverAxis.prototype.addEventListeners = function () {
        var svg = this.getComponentContainer();
        var axisPosition = this.configs.position;
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        var options = this.getOptions();
        var axisOptions = Tools.getProperty(options, 'axes', axisPosition);
        var axisScaleType = Tools.getProperty(axisOptions, 'scaleType');
        var truncationThreshold = Tools.getProperty(axisOptions, 'truncation', 'threshold');
        var self = this;
        container
            .selectAll('g.tick.tick-hover')
            .on('mouseover', function (event) {
            var hoveredElement = select(this).select('text');
            var datum = hoveredElement.datum();
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            if (axisScaleType === ScaleTypes.LABELS &&
                datum.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    element: hoveredElement,
                    datum: datum,
                });
            }
        })
            .on('mousemove', function (event) {
            var hoveredElement = select(this).select('text');
            var datum = hoveredElement.datum();
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEMOVE, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('click', function (event) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_CLICK, {
                event: event,
                element: select(this).select('text'),
                datum: select(this).select('text').datum(),
            });
        })
            .on('mouseout', function (event) {
            // Dispatch mouse event
            self.services.events.dispatchEvent(Events.Axis.LABEL_MOUSEOUT, {
                event: event,
                element: select(this).select('text'),
                datum: select(this).select('text').datum(),
            });
            if (axisScaleType === ScaleTypes.LABELS) {
                self.services.events.dispatchEvent(Events.Tooltip.HIDE);
            }
        })
            .on('focus', function (event) {
            var coordinates = { clientX: 0, clientY: 0 };
            if (event.target) {
                // Focus element since we are using arrow keys
                event.target.focus();
                var boundingRect = event.target.getBoundingClientRect();
                coordinates.clientX = boundingRect.x;
                coordinates.clientY = boundingRect.y;
            }
            // Dispatch focus event
            self.services.events.dispatchEvent(Events.Axis.LABEL_FOCUS, {
                event: __assign(__assign({}, event), coordinates),
                element: select(this),
                datum: select(this).select('text').datum(),
            });
        })
            .on('blur', function (event) {
            // Dispatch blur event
            self.services.events.dispatchEvent(Events.Axis.LABEL_BLUR, {
                event: event,
                element: select(this),
                datum: select(this).select('text').datum(),
            });
        });
    };
    // Focus on the next HTML element sibling
    HoverAxis.prototype.goNext = function (element, event) {
        if (element.nextElementSibling &&
            element.nextElementSibling.tagName !== 'path') {
            element.nextElementSibling.dispatchEvent(new Event('focus'));
        }
        event.preventDefault();
    };
    // Focus on the previous HTML element sibling
    HoverAxis.prototype.goPrevious = function (element, event) {
        if (element.previousElementSibling &&
            element.previousElementSibling.tagName !== 'path') {
            element.previousElementSibling.dispatchEvent(new Event('focus'));
        }
        event.preventDefault();
    };
    HoverAxis.prototype.destroy = function () {
        var svg = this.getComponentContainer();
        var axisPosition = this.configs.position;
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        // Remove event listeners
        container
            .selectAll('g.tick.tick-hover')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('mouseout', null)
            .on('focus', null)
            .on('blur', null);
    };
    return HoverAxis;
}(Axis));
export { HoverAxis };
//# sourceMappingURL=../../../src/components/axes/hover-axis.js.map