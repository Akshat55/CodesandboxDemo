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
import { Events, RenderTypes, TreeTypes } from '../../interfaces';
import { Tools } from '../../tools';
// D3 Imports
import { cluster as d3Cluster, tree as d3Tree, hierarchy } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';
import { select } from 'd3-selection';
var NODE_OFFSET = 6;
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'tree';
        _this.renderType = RenderTypes.SVG;
        return _this;
    }
    Tree.prototype.getLongestLabel = function (data) {
        var _this = this;
        var longestLabel = '';
        data.forEach(function (d) {
            var longestLabelInChildren = d.children
                ? _this.getLongestLabel(d.children)
                : '';
            if (longestLabelInChildren.length > longestLabel.length ||
                d.name.length > longestLabel.length) {
                longestLabel =
                    longestLabelInChildren.length > d.name.length
                        ? longestLabelInChildren
                        : d.name;
            }
        });
        return longestLabel;
    };
    Tree.prototype.getMockLabelWidth = function (svg, label) {
        // Add mock label to get dimensions
        var mockLabel = svg
            .append('text')
            .attr('dy', '0.31em')
            .attr('x', 0)
            .attr('text-anchor', 'end')
            .text(label);
        // Get the mock label width
        var mockLabelWidth = DOMUtils.getSVGElementSize(mockLabel.node(), {
            useBBox: true,
        }).width;
        // Remove the mock title label
        mockLabel.remove();
        return mockLabelWidth;
    };
    Tree.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getComponentContainer();
        // Empty out the svg before rendering the tree
        svg.html('');
        var _a = DOMUtils.getSVGElementSize(this.parent, {
            useAttrs: true,
        }), width = _a.width, height = _a.height;
        if (width < 1 || height < 1) {
            return;
        }
        var options = this.model.getOptions();
        var displayData = this.model.getDisplayData();
        var rootTitle = Tools.getProperty(options, 'tree', 'rootTitle') || 'Tree';
        var mockRootTitleWidth = this.getMockLabelWidth(svg, rootTitle);
        var longestLabel = this.getLongestLabel(displayData);
        var mockLongestLabelWidth = this.getMockLabelWidth(svg, longestLabel);
        var margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: mockRootTitleWidth > 0
                ? mockRootTitleWidth + NODE_OFFSET
                : 30 - NODE_OFFSET,
        };
        var root = hierarchy({
            name: rootTitle,
            children: displayData,
        });
        var dx = 10;
        var dy = width / 6;
        var update = function (source) {
            var nodes = root.descendants().reverse();
            var links = root.links();
            var left = root;
            var right = root;
            root.eachBefore(function (node) {
                if (node.x < left.x)
                    left = node;
                if (node.x > right.x)
                    right = node;
            });
            var height = right.x - left.x;
            var transition = svg
                .transition()
                .call(function (t) {
                return _this.services.transitions.setupTransition({
                    transition: t,
                    name: 'tree-update-viewbox',
                    animate: true,
                });
            })
                .attr('viewBox', [-margin.left, left.x, width, height]);
            // Update data on nodes
            var nodeGroups = nodeGroup
                .selectAll('g')
                .data(nodes, function (d) { return d.id; });
            var self = _this;
            // Add any entering nodes
            var nodeGroupsEnter = nodeGroups
                .enter()
                .append('g')
                .attr('transform', function () { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .attr('class', function (d) {
                return d.depth !== 0 && d.children && d.children.length > 0
                    ? 'clickable'
                    : null;
            })
                .on('mouseover', function (event, d) {
                // Dispatch mouse event
                self.services.events.dispatchEvent(Events.Tree.NODE_MOUSEOVER, {
                    event: event,
                    element: select(this),
                    datum: d,
                });
            })
                .on('click', function (event, d) {
                if (d.depth !== 0) {
                    d.children = d.children ? null : d._children;
                    update(d);
                }
                // Dispatch mouse event
                self.services.events.dispatchEvent(Events.Tree.NODE_CLICK, {
                    event: event,
                    element: select(this),
                    datum: d,
                });
            })
                .on('mouseout', function (event, d) {
                // Dispatch mouse event
                self.services.events.dispatchEvent(Events.Tree.NODE_MOUSEOUT, {
                    event: event,
                    element: select(this),
                    datum: d,
                });
            });
            // Add node circles to entering nodes
            nodeGroupsEnter
                .append('circle')
                .attr('r', 2.5)
                .attr('class', function (d) { return (d._children ? 'parent' : 'child'); })
                .attr('stroke-width', 10);
            // Add node labels
            nodeGroupsEnter
                .append('text')
                .attr('dy', '0.31em')
                .attr('x', function (d) { return (d._children ? -NODE_OFFSET : NODE_OFFSET); })
                .attr('text-anchor', function (d) { return (d._children ? 'end' : 'start'); })
                .text(function (d) { return d.data.name; })
                .clone(true)
                .attr('class', 'text-stroke')
                .lower();
            // Reposition nodes
            nodeGroups
                .merge(nodeGroupsEnter)
                .transition(transition)
                .attr('transform', function (d) { return "translate(" + d.y + "," + d.x + ")"; })
                .attr('fill-opacity', 1)
                .attr('stroke-opacity', 1);
            // Remove exiting nodes
            nodeGroups
                .exit()
                .transition(transition)
                .remove()
                .attr('transform', function () { return "translate(" + source.y + "," + source.x + ")"; })
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0);
            // Update data on links
            var linkPaths = linkGroup
                .selectAll('path')
                .data(links, function (d) { return d.target.id; });
            // Add any entering link paths
            var linkPathsEnter = linkPaths
                .enter()
                .append('path')
                .attr('d', function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });
            // Reposition updating link paths
            linkPaths
                .merge(linkPathsEnter)
                .transition(transition)
                .attr('d', diagonal);
            // Remove any exiting link paths
            linkPaths
                .exit()
                .transition(transition)
                .remove()
                .attr('d', function () {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });
            // Update position data for nodes
            root.eachBefore(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        };
        var descendants = root.descendants();
        var maxDepth = descendants[descendants.length - 1].depth;
        var tree = Tools.getProperty(options, 'tree', 'type') === TreeTypes.DENDROGRAM
            ? d3Cluster().size([
                height,
                width -
                    mockLongestLabelWidth -
                    maxDepth * NODE_OFFSET -
                    mockRootTitleWidth,
            ])
            : d3Tree()
                .nodeSize([dx, dy])
                .size([
                height,
                width -
                    mockLongestLabelWidth -
                    maxDepth * NODE_OFFSET -
                    mockRootTitleWidth,
            ]);
        var diagonal = linkHorizontal()
            .x(function (d) { return d.y; })
            .y(function (d) { return d.x; });
        root.x0 = dy / 2;
        root.y0 = 0;
        root.descendants().forEach(function (d, i) {
            d.id = i;
            d._children = d.children;
        });
        tree(root);
        svg.attr('viewBox', [-margin.left, -margin.top, width, dx]).style('user-select', 'none');
        var linkGroup = svg.append('g').attr('class', 'links');
        var nodeGroup = svg.append('g').attr('class', 'nodes');
        update(root);
    };
    return Tree;
}(Component));
export { Tree };
//# sourceMappingURL=../../../src/components/graphs/tree.js.map