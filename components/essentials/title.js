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
import { DOMUtils } from '../../services';
import { Events, RenderTypes } from './../../interfaces';
import { Tools } from '../../tools';
var Title = /** @class */ (function (_super) {
    __extends(Title, _super);
    function Title() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'title';
        _this.renderType = RenderTypes.HTML;
        return _this;
    }
    Title.prototype.render = function () {
        var svg = this.getComponentContainer();
        var title = Tools.getProperty(this.getOptions(), 'title');
        var text = svg.selectAll('p.title').data([title]);
        text.enter()
            .append('p')
            .classed('title', true)
            .attr('role', 'heading')
            .attr('aria-level', 2)
            .merge(text)
            .html(function (d) { return d; });
        // check if title needs truncation (and tooltip support)
        if (text.node() && text.node().offsetWidth < text.node().scrollWidth) {
            // add events for displaying the tooltip with the title
            var self_1 = this;
            text.on('mouseover', function (event) {
                self_1.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: text,
                    content: text.text(),
                });
            })
                .on('mousemove', function (event) {
                self_1.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                    event: event,
                });
            })
                .on('mouseout', function () {
                self_1.services.events.dispatchEvent(Events.Tooltip.HIDE);
            });
        }
        text.exit().remove();
    };
    /**
     * Truncates title creating ellipses and attaching tooltip for exposing full title.
     */
    Title.prototype.truncateTitle = function (title, maxWidth) {
        // sanity check to prevent stack overflow on binary search
        if (maxWidth <= 0) {
            return;
        }
        var untruncatedTitle = title.text();
        // check if the title is too big for the containing svg
        if (title.node().getComputedTextLength() > maxWidth) {
            // append the ellipses to their own tspan to calculate the text length
            title.append('tspan').text('...');
            // get the bounding width including the elipses '...'
            var tspanLength = DOMUtils.appendOrSelect(title, 'tspan')
                .node()
                .getComputedTextLength();
            // with elipses
            var titleString = title.text();
            // get the index for creating the max length substring that fit within the svg
            // use one less than the index to avoid crowding (the elipsis)
            var substringIndex = this.getSubstringIndex(title.node(), 0, titleString.length - 1, maxWidth - tspanLength);
            // use the substring as the title
            title
                .html(titleString.substring(0, substringIndex - 1))
                .append('tspan')
                .text('...');
            // add events for displaying the tooltip with the title
            var self_2 = this;
            title
                .on('mouseover', function (event) {
                self_2.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: title,
                    content: untruncatedTitle,
                });
            })
                .on('mousemove', function (event) {
                self_2.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                    event: event,
                });
            })
                .on('mouseout', function () {
                self_2.services.events.dispatchEvent(Events.Tooltip.HIDE);
            });
        }
    };
    // computes the maximum space a title can take
    Title.prototype.getMaxTitleWidth = function () {
        return DOMUtils.getSVGElementSize(this.parent.node(), {
            useAttrs: true,
        }).width;
    };
    /**
     * Returns the index for a maximum length substring that is less than the width parameter.
     * @param title the title node used for getting the text lengths of substrings
     * @param start the start index for the binary search
     * @param end the end index for the binary search
     * @param width the width of the svg container that holds the title
     */
    Title.prototype.getSubstringIndex = function (title, start, end, width) {
        var mid = Math.floor((end + start) / 2);
        if (title.getSubStringLength(0, mid) > width) {
            return this.getSubstringIndex(title, start, mid, width);
        }
        else if (title.getSubStringLength(0, mid) < width) {
            if (title.getSubStringLength(0, mid + 1) > width) {
                return mid;
            }
            return this.getSubstringIndex(title, mid, end, width);
        }
        else {
            return mid;
        }
    };
    return Title;
}(Component));
export { Title };
//# sourceMappingURL=../../../src/components/essentials/title.js.map