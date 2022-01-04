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
import * as Configuration from '../../configuration';
import { Events, RenderTypes, DividerStatus } from '../../interfaces';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { get } from 'lodash-es';
// D3 Imports
import { min } from 'd3-array';
import { select } from 'd3-selection';
var Heatmap = /** @class */ (function (_super) {
    __extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'heatmap';
        _this.renderType = RenderTypes.SVG;
        _this.matrix = {};
        _this.xBandwidth = 0;
        _this.yBandwidth = 0;
        _this.translationUnits = {
            x: 0,
            y: 0,
        };
        // Highlight elements that match the hovered axis item
        _this.handleAxisOnHover = function (event) {
            var detail = event.detail;
            var datum = detail.datum;
            // Unique ranges and domains
            var ranges = _this.model.getUniqueRanges();
            var domains = _this.model.getUniqueDomain();
            // Labels
            var domainLabel = _this.services.cartesianScales.getDomainLabel();
            var rangeLabel = _this.services.cartesianScales.getRangeLabel();
            // Scales
            var mainXScale = _this.services.cartesianScales.getMainXScale();
            var mainYScale = _this.services.cartesianScales.getMainYScale();
            var label = '', sum = 0, minimum = 0, maximum = 0;
            // Check to see where datum belongs
            if (_this.matrix[datum] !== undefined) {
                label = domainLabel;
                // Iterate through Object and get sum, min, and max
                ranges.forEach(function (element) {
                    var value = _this.matrix[datum][element].value || 0;
                    sum += value;
                    minimum = value < minimum ? value : minimum;
                    maximum = value > maximum ? value : maximum;
                });
            }
            else {
                label = rangeLabel;
                domains.forEach(function (element) {
                    var value = _this.matrix[element][datum].value || 0;
                    sum += value;
                    minimum = value < minimum ? value : minimum;
                    maximum = value > maximum ? value : maximum;
                });
            }
            if (mainXScale(datum) !== undefined) {
                _this.parent
                    .select('g.multi-cell.column-highlight')
                    .classed('highlighter-hidden', false)
                    .attr('transform', "translate(" + mainXScale(datum) + ", " + min(mainYScale.range()) + ")");
            }
            else if (mainYScale(datum) !== undefined) {
                _this.parent
                    .select('g.multi-cell.row-highlight')
                    .classed('highlighter-hidden', false)
                    .attr('transform', "translate(" + min(mainXScale.range()) + "," + mainYScale(datum) + ")");
            }
            // Dispatch tooltip show event
            _this.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                event: detail.event,
                hoveredElement: select(event.detail.element),
                items: [
                    {
                        label: label,
                        value: datum,
                        bold: true,
                    },
                    {
                        label: 'Min',
                        value: minimum,
                    },
                    {
                        label: 'Max',
                        value: maximum,
                    },
                    {
                        label: 'Average',
                        value: sum / domains.length,
                    },
                ],
            });
        };
        // Un-highlight all elements
        _this.handleAxisMouseOut = function (event) {
            // Hide column/row
            _this.parent
                .selectAll('g.multi-cell')
                .classed('highlighter-hidden', true);
            // Dispatch hide tooltip event
            _this.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                event: event,
            });
        };
        return _this;
    }
    Heatmap.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct cells on Axis item hovers
        eventsFragment.addEventListener(Events.Axis.LABEL_MOUSEOVER, this.handleAxisOnHover);
        // Highlight correct cells on Axis item mouseouts
        eventsFragment.addEventListener(Events.Axis.LABEL_MOUSEOUT, this.handleAxisMouseOut);
        // Highlight correct cells on Axis item focus
        eventsFragment.addEventListener(Events.Axis.LABEL_FOCUS, this.handleAxisOnHover);
        // Highlight correct cells on Axis item  blur
        eventsFragment.addEventListener(Events.Axis.LABEL_BLUR, this.handleAxisMouseOut);
    };
    Heatmap.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getComponentContainer({ withinChartClip: true });
        // Lower the chart so the axes are always visible
        svg.lower();
        var cartesianScales = this.services.cartesianScales;
        this.matrix = this.model.getMatrix();
        svg.html('');
        if (Tools.getProperty(this.getOptions(), 'data', 'loading')) {
            return;
        }
        // determine x and y axis scale
        var mainXScale = cartesianScales.getMainXScale();
        var mainYScale = cartesianScales.getMainYScale();
        var domainIdentifier = cartesianScales.getDomainIdentifier();
        var rangeIdentifier = cartesianScales.getRangeIdentifier();
        // Get unique axis values & create a matrix
        var uniqueDomain = this.model.getUniqueDomain();
        var uniqueRange = this.model.getUniqueRanges();
        // Get matrix in the form of an array to create a single heatmap group
        var matrixArray = this.model.getMatrixAsArray();
        // Get available chart area
        var xRange = mainXScale.range();
        var yRange = mainYScale.range();
        // Determine rectangle dimensions based on the number of unique domain and range
        this.xBandwidth = Math.abs((xRange[1] - xRange[0]) / uniqueDomain.length);
        this.yBandwidth = Math.abs((yRange[1] - yRange[0]) / uniqueRange.length);
        var patternID = this.services.domUtils.generateElementIDString("heatmap-pattern-stripes");
        // Create a striped pattern for missing data
        svg.append('defs')
            .append('pattern')
            .attr('id', patternID)
            .attr('width', 3)
            .attr('height', 3)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('patternTransform', 'rotate(45)')
            .append('rect')
            .classed('pattern-fill', true)
            .attr('width', 0.5)
            .attr('height', 8);
        var rectangles = svg
            .selectAll()
            .data(matrixArray)
            .enter()
            .append('g')
            .attr('class', function (d) { return "heat-" + d.index; })
            .classed('cell', true)
            .attr('transform', function (d) {
            return "translate(" + mainXScale(d[domainIdentifier]) + ", " + mainYScale(d[rangeIdentifier]) + ")";
        })
            .append('rect')
            .attr('class', function (d) {
            return _this.model.getColorClassName({
                value: d.value,
                originalClassName: "heat-" + d.index,
            });
        })
            .classed('heat', true)
            .classed('null-state', function (d) {
            return d.index === -1 || d.value === null ? true : false;
        })
            .attr('width', this.xBandwidth)
            .attr('height', this.yBandwidth)
            .style('fill', function (d) {
            // Check if a valid value exists
            if (d.index === -1 || d.value === null) {
                return "url(#" + patternID + ")";
            }
            return _this.model.getFillColor(Number(d.value));
        })
            .attr('aria-label', function (d) { return d.value; });
        // Cell highlight box
        this.createOuterBox('g.cell-highlight', this.xBandwidth, this.yBandwidth);
        // Column highlight box
        this.createOuterBox('g.multi-cell.column-highlight', this.xBandwidth, Math.abs(yRange[1] - yRange[0]));
        // Row highlight box
        this.createOuterBox('g.multi-cell.row-highlight', Math.abs(xRange[1] - xRange[0]), this.yBandwidth);
        if (this.determineDividerStatus()) {
            rectangles.style('stroke-width', '1px');
            this.parent.select('g.cell-highlight').classed('cell-2', true);
        }
        this.addEventListener();
    };
    /**
     * Generates a box using lines to create a hover effect
     * The lines have drop shadow in their respective direction
     * @param parentTag - tag name
     * @param xBandwidth - X length
     * @param yBandwidth - y length
     */
    Heatmap.prototype.createOuterBox = function (parentTag, xBandwidth, yBandwidth) {
        // Create a highlighter in the parent component so the shadow and the lines do not get clipped
        var highlight = DOMUtils.appendOrSelect(this.parent, parentTag)
            .classed('shadows', true)
            .classed('highlighter-hidden', true);
        DOMUtils.appendOrSelect(highlight, 'line.top')
            .attr('x1', -1)
            .attr('x2', xBandwidth + 1);
        DOMUtils.appendOrSelect(highlight, 'line.left')
            .attr('x1', 0)
            .attr('y1', -1)
            .attr('x2', 0)
            .attr('y2', yBandwidth + 1);
        DOMUtils.appendOrSelect(highlight, 'line.down')
            .attr('x1', -1)
            .attr('x2', xBandwidth + 1)
            .attr('y1', yBandwidth)
            .attr('y2', yBandwidth);
        DOMUtils.appendOrSelect(highlight, 'line.right')
            .attr('x1', xBandwidth)
            .attr('x2', xBandwidth)
            .attr('y1', -1)
            .attr('y2', yBandwidth + 1);
    };
    Heatmap.prototype.determineDividerStatus = function () {
        // Add dividers if status is not off, will assume auto or on by default.
        var dividerStatus = Tools.getProperty(this.getOptions(), 'heatmap', 'divider', 'state');
        // Determine if cell divider should be displayed
        if (dividerStatus !== DividerStatus.OFF) {
            if ((dividerStatus === DividerStatus.AUTO &&
                Configuration.heatmap.minCellDividerDimension <=
                    this.xBandwidth &&
                Configuration.heatmap.minCellDividerDimension <=
                    this.yBandwidth) ||
                dividerStatus === DividerStatus.ON) {
                return true;
            }
        }
        return false;
    };
    Heatmap.prototype.addEventListener = function () {
        var self = this;
        var cartesianScales = this.services.cartesianScales;
        var options = this.getOptions();
        var totalLabel = get(options, 'tooltip.totalLabel');
        var domainIdentifier = cartesianScales.getDomainIdentifier();
        var rangeIdentifier = cartesianScales.getRangeIdentifier();
        var domainLabel = cartesianScales.getDomainLabel();
        var rangeLabel = cartesianScales.getRangeLabel();
        this.parent
            .selectAll('g.cell')
            .on('mouseover', function (event, datum) {
            var cell = select(this);
            var hoveredElement = cell.select('rect.heat');
            var nullState = hoveredElement.classed('null-state');
            // Dispatch event and tooltip only if value exists
            if (!nullState) {
                // Get transformation value of node
                var transform = Tools.getTranformOffsets(cell.attr('transform'));
                select('g.cell-highlight')
                    .attr('transform', "translate(" + (transform.x + self.translationUnits.x) + ", " + (transform.y + self.translationUnits.y) + ")")
                    .classed('highlighter-hidden', false);
                // Dispatch mouse over event
                self.services.events.dispatchEvent(Events.Heatmap.HEATMAP_MOUSEOVER, {
                    event: event,
                    element: hoveredElement,
                    datum: datum,
                });
                // Dispatch tooltip show event
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    items: [
                        {
                            label: domainLabel,
                            value: datum[domainIdentifier],
                        },
                        {
                            label: rangeLabel,
                            value: datum[rangeIdentifier],
                        },
                        {
                            label: totalLabel || 'Total',
                            value: datum['value'],
                            color: hoveredElement.style('fill'),
                        },
                    ],
                });
            }
        })
            .on('mousemove', function (event, datum) {
            // Dispatch mouse move event
            self.services.events.dispatchEvent(Events.Heatmap.HEATMAP_MOUSEMOVE, {
                event: event,
                element: select(this),
                datum: datum,
            });
            // Dispatch tooltip move event
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('click', function (event, datum) {
            // Dispatch mouse click event
            self.services.events.dispatchEvent(Events.Heatmap.HEATMAP_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var cell = select(this);
            var hoveredElement = cell.select('rect.heat');
            var nullState = hoveredElement.classed('null-state');
            select('g.cell-highlight').classed('highlighter-hidden', true);
            // Dispatch event and tooltip only if value exists
            if (!nullState) {
                // Dispatch mouse out event
                self.services.events.dispatchEvent(Events.Heatmap.HEATMAP_MOUSEOUT, {
                    event: event,
                    element: hoveredElement,
                    datum: datum,
                });
                // Dispatch hide tooltip event
                self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                    event: event,
                    hoveredElement: hoveredElement,
                });
            }
        });
    };
    // Remove event listeners
    Heatmap.prototype.destroy = function () {
        this.parent
            .selectAll('rect.heat')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('click', null)
            .on('mouseout', null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleAxisOnHover);
        eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleAxisMouseOut);
    };
    return Heatmap;
}(Component));
export { Heatmap };
//# sourceMappingURL=../../../src/components/graphs/heatmap.js.map