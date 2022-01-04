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
// Internal imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import * as Configuration from '../../configuration';
import { Events, ColorClassNameTypes, RenderTypes } from '../../interfaces';
// D3 imports
import { select } from 'd3-selection';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
var Alluvial = /** @class */ (function (_super) {
    __extends(Alluvial, _super);
    function Alluvial() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'alluvial';
        _this.renderType = RenderTypes.SVG;
        _this.gradient_id = 'gradient-id-' + Math.floor(Math.random() * 99999999999);
        return _this;
    }
    Alluvial.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        // svg and container widths
        var svg = this.getComponentContainer({ withinChartClip: true });
        svg.html('');
        var _a = DOMUtils.getSVGElementSize(svg, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        // Because of a Firefox bug with regards to sizing & d3 packs,
        // rather than checking if height or width aren't 0,
        // we have to make sure they're not smaller than 1
        if (width < 1 || height < 1) {
            return;
        }
        var options = this.model.getOptions();
        var data = this.model.getDisplayData();
        // Is gradient enabled or not
        var isGradientAllowed = Tools.getProperty(this.getOptions(), 'color', 'gradient', 'enabled');
        // Set the custom node padding if provided
        var nodePadding = Configuration.alluvial.minNodePadding;
        if (options.alluvial.nodePadding > Configuration.alluvial.minNodePadding) {
            nodePadding = options.alluvial.nodePadding;
        }
        var sankey = d3Sankey()
            .nodeId(function (d) { return d.name; })
            .nodeWidth(Configuration.alluvial.nodeWidth)
            // Distance nodes are apart from each other
            .nodePadding(nodePadding)
            // Size of the chart and its padding
            // Chart starts at 2 and ends at width - 2 so the outer nodes can expand from center
            // Chart starts from 30 so node categories can be displayed
            .extent([
            [2, 30],
            [width - 2, height],
        ]);
        // Construct a graph with the provided user data
        // Data must be deep cloned to ensure user passed data isn't deleted when themes change
        this.graph = sankey({
            nodes: options.alluvial.nodes.map(function (d) { return Object.assign({}, d); }),
            links: data.map(function (d) { return Object.assign({}, d); }),
        });
        // Filter out unused nodes so they are not rendered
        this.graph.nodes = this.graph.nodes.filter(function (node) { return node.value !== 0; });
        // Determine the category name placement x position
        var nodeCoordinates = {};
        this.graph.nodes.forEach(function (element) {
            var _a;
            var point = element.x0;
            // Only 1 category per x-value
            if (element.category) {
                nodeCoordinates[point] = (_a = element) === null || _a === void 0 ? void 0 : _a.category;
            }
        });
        // Add node category text
        var alluvialCategory = svg
            .append('g')
            .classed('header-arrows', true)
            .selectAll('g')
            .data(Object.keys(nodeCoordinates))
            .join('g')
            .attr('transform', function (d) {
            return "translate(" + d + ", 0)";
        });
        // Add the category text
        alluvialCategory
            .append('text')
            .attr('id', function (d, i) {
            return _this.services.domUtils.generateElementIDString("alluvial-category-" + i);
        })
            .style('font-size', '14px')
            .text(function (d) {
            if (nodeCoordinates[d]) {
                return nodeCoordinates[d];
            }
            return '';
        })
            .attr('y', 20)
            .attr('x', function (d, i) {
            var elementID = _this.services.domUtils.generateElementIDString("alluvial-category-" + i);
            var width = DOMUtils.getSVGElementSize(select("text#" + elementID), { useBBox: true }).width;
            // Make the text on the left on node group (except first column)
            var x = 0;
            if (d + x >= width) {
                x = -width + 4;
            }
            return x;
        });
        // Draws the links (Waves)
        var links = svg
            .append('g')
            .attr('fill', 'none')
            .selectAll('g')
            .data(this.graph.links);
        // Exit so we can have multiple appends in group
        links.exit().remove();
        // Add gradient if requsted
        if (isGradientAllowed) {
            var scale_1 = Tools.getProperty(this.getOptions(), 'color', 'scale');
            if (scale_1) {
                links
                    .enter()
                    .append('linearGradient')
                    .attr('id', function (d) { return _this.gradient_id + "-link-" + d.index; })
                    .attr('gradientUnits', 'userSpaceOnUse')
                    .call(function (gradient) {
                    return gradient
                        .append('stop')
                        .attr('offset', '0%')
                        .attr('stop-color', function (d) {
                        return scale_1[d.source.name];
                    });
                })
                    .call(function (gradient) {
                    return gradient
                        .append('stop')
                        .attr('offset', '100%')
                        .attr('stop-color', function (d) {
                        return scale_1[d.target.name];
                    });
                });
            }
            // Exit so path can be appended to the group
            links.exit().remove();
        }
        links
            .enter()
            .append('path')
            .classed('link', true)
            .attr('d', sankeyLinkHorizontal())
            .attr('id', function (d) {
            return _this.services.domUtils.generateElementIDString("alluvial-line-" + d.index);
        })
            .attr('class', function (d) {
            // Use a single color for the lines
            if (options.alluvial.monochrome) {
                return _this.model.getColorClassName({
                    classNameTypes: [ColorClassNameTypes.STROKE],
                    dataGroupName: 0,
                    originalClassName: 'link',
                });
            }
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.STROKE],
                dataGroupName: d.source.index,
                originalClassName: 'link',
            });
        })
            .style('stroke', function (d) {
            if (isGradientAllowed) {
                return "url(#" + _this.gradient_id + "-link-" + d.index + ")";
            }
            return _this.model.getFillColor(d.source.name);
        })
            .attr('stroke-width', function (d) { return Math.max(1, d.width); })
            .style('stroke-opacity', Configuration.alluvial.opacity.default)
            .attr('aria-label', function (d) {
            return d.source.name + " \u2192 " + d.target.name + " (" + d.value + (options.alluvial.units
                ? ' ' + options.alluvial.units
                : '') + ")";
        });
        // Creating the groups
        var node = svg
            .append('g')
            .selectAll('g')
            .data(this.graph.nodes)
            .enter()
            .append('g')
            .attr('id', function (d) {
            return _this.services.domUtils.generateElementIDString("alluvial-node-" + d.index);
        })
            .classed('node-group', true)
            .attr('transform', function (d) { return "translate(" + d.x0 + ", " + d.y0 + ")"; });
        // Creating the nodes
        node.append('rect')
            .classed('node', true)
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('fill', 'black');
        // Group to hold the text & rectangle background
        var textNode = node
            .append('g')
            .attr('id', function (d) {
            return _this.services.domUtils.generateElementIDString("alluvial-node-title-" + d.index);
        });
        // Node title - text
        textNode
            .append('text')
            .attr('id', function (d) {
            return _this.services.domUtils.generateElementIDString("alluvial-node-text-" + d.index);
        })
            .attr('class', 'node-text')
            .style('font-size', '12px')
            .attr('text-anchor', 'start')
            .attr('fill', 'white')
            // Padding to text
            .attr('x', 4)
            // shift 13 pixels down to fit background container
            .attr('dy', 13)
            .text(function (d) {
            return d.name + " (" + d.value + ")";
        })
            .attr('aria-label', function (d) {
            return d.name + " (" + d.value + ")";
        });
        // Text background
        textNode
            .append('rect')
            .classed('node-text-bg', true)
            .attr('width', function (d, i) {
            var elementID = _this.services.domUtils.generateElementIDString("alluvial-node-text-" + i);
            // Determine rectangle width based on text width
            var width = DOMUtils.getSVGElementSize(select("text#" + elementID), { useBBox: true }).width;
            return width + 8;
        })
            .attr('height', 18)
            .attr('stroke-width', 2)
            .lower();
        // Position group based on text width
        textNode.attr('transform', function (d, i) {
            var elementID = _this.services.domUtils.generateElementIDString("alluvial-node-text-" + i);
            var width = DOMUtils.getSVGElementSize(select("text#" + elementID), { useBBox: true }).width;
            // Subtracting 9 since text background is 18 to center
            var y = (d.y1 - d.y0) / 2 - 9;
            // Node width
            var x = d.x1 - d.x0;
            // Display bars on the right instead of left of the node
            if (d.x1 >= width) {
                // 16 = node width (4) + text container padding (8) + distance between node and text container (4)
                x = x - (width + 16);
            }
            else {
                // Add padding to text containers
                x += 4;
            }
            return "translate(" + x + ", " + y + ")";
        });
        this.addLineEventListener();
        this.addNodeEventListener();
    };
    Alluvial.prototype.addLineEventListener = function () {
        var options = this.getOptions();
        var self = this;
        // Set delay to counter flashy behaviour
        var debouncedLineHighlight = Tools.debounce(function (link, event) {
            if (event === void 0) { event = 'mouseover'; }
            var allLinks = self.parent
                .selectAll('path.link')
                .transition()
                .call(function (t) {
                return self.services.transitions.setupTransition({
                    transition: t,
                    name: 'alluvial-links-mouse-highlight',
                });
            });
            if (event === 'mouseout') {
                select(link).lower();
                allLinks.style('stroke-opacity', Configuration.alluvial.opacity.default);
            }
            else {
                allLinks.style('stroke-opacity', function () {
                    // highlight and raise if link is this
                    if (link === this) {
                        select(this).raise();
                        return Configuration.alluvial.opacity.selected;
                    }
                    return Configuration.alluvial.opacity.unfocus;
                });
            }
        }, 33);
        this.parent
            .selectAll('path.link')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            debouncedLineHighlight(this, 'mouseover');
            hoveredElement.classed('link-hovered', true);
            var strokeColor = getComputedStyle(this).getPropertyValue('stroke');
            // Dispatch mouse over event
            self.services.events.dispatchEvent(Events.Alluvial.LINE_MOUSEOVER, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Dispatch tooltip show event
            self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                event: event,
                hoveredElement: hoveredElement,
                items: [
                    {
                        label: datum.target.name,
                        value: datum.value +
                            (options.alluvial.units
                                ? " " + options.alluvial.units
                                : ''),
                        color: strokeColor,
                        labelIcon: self.getRightArrowIcon(),
                    },
                ],
            });
        })
            .on('mousemove', function (event, datum) {
            // Dispatch mouse move event
            self.services.events.dispatchEvent(Events.Alluvial.LINE_MOUSEMOVE, {
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
            self.services.events.dispatchEvent(Events.Alluvial.LINE_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            debouncedLineHighlight(this, 'mouseout');
            hoveredElement.classed('link-hovered', false);
            // Dispatch mouse out event
            self.services.events.dispatchEvent(Events.Alluvial.LINE_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Dispatch hide tooltip event
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                event: event,
                hoveredElement: hoveredElement,
            });
        });
    };
    Alluvial.prototype.addNodeEventListener = function () {
        var _this = this;
        var self = this;
        // Set delay to counter flashy behaviour
        var debouncedLineHighlight = Tools.debounce(function (links, event) {
            if (links === void 0) { links = []; }
            if (event === void 0) { event = 'mouseover'; }
            if (event === 'mouseout' || links.length === 0) {
                // set all links to default opacity & corret link order
                self.parent
                    .selectAll('path.link')
                    .classed('link-hovered', false)
                    .data(_this.graph.links, function (d) { return d.index; })
                    .order()
                    .style('stroke-opacity', Configuration.alluvial.opacity.default);
                return;
            }
            // Highlight all nodes
            var allLinks = self.parent
                .selectAll('path.link')
                .transition()
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'alluvial-link-mouse-highlight',
                });
            });
            allLinks.style('stroke-opacity', function (d) {
                // Raise the links & increase stroke-opacity to selected
                if (links.some(function (element) { return element === d.index; })) {
                    select(this).classed('link-hovered', true).raise();
                    return Configuration.alluvial.opacity.selected;
                }
                return Configuration.alluvial.opacity.unfocus;
            });
        }, 66);
        self.parent
            .selectAll('.node-group')
            .on('mouseover', function (event, datum) {
            var hoveredElement = select(this);
            // Highlight all links that pass through node
            var paths = [];
            // Outgoing links
            self.traverse({ link: 'sourceLinks', node: 'target' }, datum, paths);
            //Incoming links
            self.traverse({ link: 'targetLinks', node: 'source' }, datum, paths);
            // Highlight all linked lines in the graph data structure
            if (paths.length) {
                // Get transformation value of node
                var nodeMatrix = Tools.getTranformOffsets(hoveredElement.attr('transform'));
                // Move node to the left by 2 to grow node from the center
                hoveredElement.attr('transform', "translate(" + (nodeMatrix.x - 2) + ", " + nodeMatrix.y + ")");
                hoveredElement
                    .classed('node-hovered', true)
                    .selectAll('rect.node')
                    .attr('width', 8);
                // Translate first column text container to the
                // right so it doesn't clash with expanding node
                if (datum.x0 - 2 === 0) {
                    var elementID_1 = self.services.domUtils.generateElementIDString("alluvial-node-title-" + datum.index);
                    var titleContainer = self.parent.select("g#" + elementID_1);
                    var titleMatrix = Tools.getTranformOffsets(titleContainer.attr('transform'));
                    titleContainer.attr('transform', "translate(" + (titleMatrix.x + 4) + "," + titleMatrix.y + ")");
                }
                var elementID = self.services.domUtils.generateElementIDString("alluvial-node-text-" + datum.index);
                self.parent
                    .select("text#" + elementID)
                    .style('font-weight', 'bold');
                debouncedLineHighlight(paths, 'mouseover');
                // Dispatch mouse over event
                self.services.events.dispatchEvent(Events.Alluvial.NODE_MOUSEOVER, {
                    event: event,
                    element: hoveredElement,
                    datum: datum,
                });
            }
        })
            .on('mousemove', function (event, datum) {
            // Dispatch mouse move event
            self.services.events.dispatchEvent(Events.Alluvial.NODE_MOUSEMOVE, {
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
            self.services.events.dispatchEvent(Events.Alluvial.NODE_CLICK, {
                event: event,
                element: select(this),
                datum: datum,
            });
        })
            .on('mouseout', function (event, datum) {
            var hoveredElement = select(this);
            // Set the node position to initial state (unexpanded)
            var nodeMatrix = Tools.getTranformOffsets(hoveredElement.attr('transform'));
            hoveredElement
                .classed('node-hovered', false)
                .attr('transform', "translate(" + (nodeMatrix.x + 2) + ", " + nodeMatrix.y + ")")
                .select('rect.node')
                .attr('width', Configuration.alluvial.nodeWidth);
            // Translate text container back to initial state
            if (datum.x0 - 2 === 0) {
                var elementID_2 = self.services.domUtils.generateElementIDString("alluvial-node-title-" + datum.index);
                var titleContainer = self.parent.select("g#" + elementID_2);
                var titleMatrix = Tools.getTranformOffsets(titleContainer.attr('transform'));
                titleContainer.attr('transform', "translate(" + (titleMatrix.x - 4) + "," + titleMatrix.y + ")");
            }
            var elementID = self.services.domUtils.generateElementIDString("alluvial-node-text-" + datum.index);
            self.parent
                .select("text#" + elementID)
                .style('font-weight', 'normal');
            debouncedLineHighlight([], 'mouseout');
            // Dispatch mouse out event
            self.services.events.dispatchEvent(Events.Alluvial.NODE_MOUSEOUT, {
                event: event,
                element: hoveredElement,
                datum: datum,
            });
            // Dispatch hide tooltip event
            self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
                hoveredElement: hoveredElement,
            });
        });
    };
    // Traverse graph and get all connected links to node
    Alluvial.prototype.traverse = function (direction, node, visited) {
        var _this = this;
        if (visited === void 0) { visited = []; }
        var links = node[direction.link].map(function (element) {
            visited.push(element.index);
            return element[direction.node];
        });
        // Retrieve the child nodes
        links.forEach(function (element) { return _this.traverse(direction, element, visited); });
    };
    Alluvial.prototype.getRightArrowIcon = function () {
        return "\n\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n\t\t\t<polygon points=\"18 6 16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6\"/>\n\t\t\t<rect  data-name=\"&lt;Transparent Rectangle&gt;\" style=\"fill: none;\" width=\"32\" height=\"32\"/>\n\t\t</svg>";
    };
    // Remove event listeners
    Alluvial.prototype.destroy = function () {
        this.parent
            .selectAll('path.line,.node-group')
            .on('mouseover', null)
            .on('mousemove', null)
            .on('click', null)
            .on('mouseout', null);
    };
    return Alluvial;
}(Component));
export { Alluvial };
//# sourceMappingURL=../../../src/components/graphs/alluvial.js.map