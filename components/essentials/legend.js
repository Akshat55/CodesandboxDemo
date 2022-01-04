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
import { Tools } from '../../tools';
import { Alignments, ColorClassNameTypes, LegendItemType, RenderTypes, Roles, Events, TruncationTypes, } from '../../interfaces';
import * as Configuration from '../../configuration';
// D3 Imports
import { select } from 'd3-selection';
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'legend';
        _this.renderType = RenderTypes.HTML;
        return _this;
    }
    Legend.prototype.render = function () {
        var _this = this;
        var options = this.getOptions();
        var legendOptions = Tools.getProperty(options, 'legend');
        var alignment = Tools.getProperty(legendOptions, 'alignment');
        var legendOrientation = Tools.getProperty(options, 'legend', 'orientation');
        var dataGroups = this.model.getDataGroups();
        // Check if there are disabled legend items
        var DISABLED = Configuration.legend.items.status.DISABLED;
        var hasDeactivatedItems = dataGroups.some(function (dataGroup) { return dataGroup.status === DISABLED; });
        var userProvidedOrder = Tools.getProperty(legendOptions, 'order');
        var svg = this.getComponentContainer()
            .classed('center-aligned', alignment === Alignments.CENTER)
            .classed('right-aligned', alignment === Alignments.RIGHT)
            .classed(legendOrientation, true)
            .classed('has-deactivated-items', hasDeactivatedItems)
            .attr('role', Roles.GROUP)
            .attr('aria-label', 'Data groups')
            .attr('data-name', 'legend-items');
        if (userProvidedOrder) {
            dataGroups = this.sortDataGroups(dataGroups, userProvidedOrder);
        }
        var legendItems = svg
            .selectAll('div.legend-item')
            .data(dataGroups, function (dataGroup) { return dataGroup.name; });
        var addedLegendItems = legendItems
            .enter()
            .append('div')
            .attr('class', 'legend-item');
        addedLegendItems
            .merge(svg.selectAll('div.legend-item'))
            .classed('active', function (d, i) {
            return d.status === Configuration.legend.items.status.ACTIVE;
        });
        var legendClickable = Tools.getProperty(this.getOptions(), 'legend', 'clickable');
        svg.classed('clickable', legendClickable && dataGroups.length > 1);
        var checkboxRadius = Configuration.legend.checkbox.radius;
        var addedCheckboxes = addedLegendItems
            .append('div')
            .classed('checkbox', true);
        var allCheckboxes = addedCheckboxes
            .merge(legendItems.select('div.checkbox'))
            .attr('role', Roles.CHECKBOX)
            .attr('tabindex', legendClickable ? 0 : -1)
            .attr('aria-labelledby', function (d, i) {
            return _this.services.domUtils.generateElementIDString("legend-datagroup-" + i + "-title");
        })
            .attr('aria-checked', function (_a) {
            var status = _a.status;
            return status === Configuration.legend.items.status.ACTIVE;
        })
            .attr('width', checkboxRadius * 2)
            .attr('height', checkboxRadius * 2)
            .attr('class', function (d, i) {
            return _this.model.getColorClassName({
                classNameTypes: [ColorClassNameTypes.BACKGROUND],
                dataGroupName: d.name,
                originalClassName: 'checkbox',
            });
        })
            .style('background', function (d) {
            return d.status === Configuration.legend.items.status.ACTIVE
                ? _this.model.getFillColor(d.name) ||
                    _this.model.getStrokeColor(d.name)
                : null;
        })
            .classed('active', function (d, i) {
            return d.status === Configuration.legend.items.status.ACTIVE;
        });
        var addedCheckIcons = addedCheckboxes
            .append('svg')
            .attr('focusable', false)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', '11')
            .attr('height', '11')
            .attr('viewBox', '0 0 31 28')
            .attr('aria-hidden', true)
            .style('will-change', 'transform')
            .append('path')
            .attr('d', 'M13 21.2l-7.1-7.1-1.4 1.4 7.1 7.1L13 24 27.1 9.9l-1.4-1.5z');
        var addedLegendItemsText = addedLegendItems
            .append('p')
            .merge(legendItems.select('p'));
        var additionalItemsOption = Tools.getProperty(options, 'legend', 'additionalItems');
        // add additional legend items
        if (additionalItemsOption && dataGroups.length) {
            var self_1 = this;
            var additionalItems = svg
                .selectAll('div.additional-item')
                .data(additionalItemsOption);
            additionalItems.exit().remove();
            var addedAdditionalItems = additionalItems
                .enter()
                .append('div')
                .merge(additionalItems)
                .classed('legend-item', true)
                .classed('additional', true)
                .attr('aria-labelledby', function (d, i) {
                return _this.services.domUtils.generateElementIDString("legend-datagroup-" + (allCheckboxes.size() + i) + "-title");
            });
            // remove nested child elements that no longer needed
            addedAdditionalItems.selectAll('*').remove();
            // get index of item with same type to assign distinct classname
            var previousType_1;
            var indexOfItem_1 = 1;
            // add different type of legend items
            addedAdditionalItems
                .append('svg')
                .classed('icon', true)
                .each(function (d, i) {
                var additionalItem = select(this);
                if (!previousType_1 || previousType_1 != d.type) {
                    previousType_1 = d.type;
                    indexOfItem_1 = 1;
                }
                else {
                    indexOfItem_1++;
                }
                self_1.addAdditionalItem(additionalItem, d, indexOfItem_1);
            });
            var addedAdditionalItemsText = addedAdditionalItems
                .append('p')
                .merge(addedAdditionalItems.select('p'));
            this.truncateLegendText();
        }
        // Remove old elements as needed.
        legendItems
            .exit()
            .on('mouseover', null)
            .on('click', null)
            .on('mouseout', null)
            .remove();
        if (legendClickable && addedLegendItems.size() > 1) {
            this.addEventListeners();
        }
    };
    Legend.prototype.sortDataGroups = function (dataGroups, legendOrder) {
        // Sort data in user defined order
        dataGroups.sort(function (dataA, dataB) {
            return legendOrder.indexOf(dataA.name) -
                legendOrder.indexOf(dataB.name);
        });
        // If user only defined partial ordering, ordered items are placed before unordered ones
        if (legendOrder.length < dataGroups.length) {
            var definedOrderIndex = dataGroups.length - legendOrder.length;
            var definedOrder = dataGroups.slice(definedOrderIndex);
            return definedOrder.concat(dataGroups.slice(0, definedOrderIndex));
        }
        return dataGroups;
    };
    Legend.prototype.addAdditionalItem = function (additionalItem, itemConfig, indexOfItem) {
        var _a = Configuration.legend.area, width = _a.width, height = _a.height;
        if (itemConfig.type === LegendItemType.RADIUS) {
            // Circular icon
            additionalItem
                .style('width', height + "px")
                .style('height', height + "px");
        }
        else {
            additionalItem
                .style('width', width + "px")
                .style('height', height + "px");
        }
        if (itemConfig.type === LegendItemType.RADIUS) {
            var _b = Configuration.legend.radius, iconData = _b.iconData, fill = _b.fill, stroke = _b.stroke;
            var circleEnter = additionalItem
                .attr('fill', 'none')
                .selectAll('circle')
                .data(iconData)
                .enter();
            circleEnter
                .append('circle')
                .classed('radius', true)
                .attr('role', Roles.IMG)
                .attr('aria-label', 'radius')
                .attr('cx', function (d) { return d.cx; })
                .attr('cy', function (d) { return d.cy; })
                .attr('r', function (d) { return d.r; })
                .style('fill', itemConfig.fill ? itemConfig.fill : fill)
                .style('stroke', itemConfig.stroke ? itemConfig.stroke : stroke);
        }
        else if (itemConfig.type === LegendItemType.LINE) {
            var lineConfig = Configuration.legend.line;
            if (additionalItem.select('line.line').empty()) {
                additionalItem
                    .append('line')
                    .classed("line-" + indexOfItem, true)
                    .attr('role', Roles.IMG)
                    .attr('aria-label', 'line')
                    .attr('x1', 0)
                    .attr('y1', lineConfig.yPosition)
                    .attr('x2', width)
                    .attr('y2', lineConfig.yPosition)
                    .style('stroke', itemConfig.stroke
                    ? itemConfig.stroke
                    : lineConfig.stroke)
                    .style('stroke-width', lineConfig.strokeWidth);
            }
        }
        else if (itemConfig.type === LegendItemType.AREA) {
            if (additionalItem.select('rect.area').empty()) {
                additionalItem
                    .append('rect')
                    .classed("area-" + indexOfItem, true)
                    .attr('role', Roles.IMG)
                    .attr('aria-label', 'area')
                    .attr('width', width)
                    .attr('height', height)
                    .style('fill', indexOfItem > 3 && !itemConfig.fill
                    ? Configuration.legend.area.fill
                    : itemConfig.fill)
                    .style('stroke', itemConfig.stroke);
            }
        }
        else if (itemConfig.type === LegendItemType.SIZE) {
            var _c = Configuration.legend.size, iconData = _c.iconData, fill = _c.fill, stroke = _c.stroke;
            var sizeEnter = additionalItem
                .attr('fill', 'none')
                .attr('role', Roles.IMG)
                .attr('aria-label', 'size')
                .selectAll('rect')
                .data(iconData)
                .enter();
            sizeEnter
                .append('rect')
                .classed('size', true)
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; })
                .attr('y', function (d) { return 0; })
                .style('fill', itemConfig.fill ? itemConfig.fill : fill)
                .style('stroke', itemConfig.stroke ? itemConfig.stroke : stroke)
                .style('stroke-width', 1);
        }
        else if (itemConfig.type === LegendItemType.QUARTILE) {
            var iconData = Configuration.legend.quartile.iconData;
            var quartileEnter = additionalItem
                .selectAll('rect')
                .attr('role', Roles.IMG)
                .attr('aria-label', 'quartile')
                .data(iconData)
                .enter();
            quartileEnter
                .append('rect')
                .attr('class', function (d, i) { return "quartile-" + (i === 0 ? 'wrapper' : 'line'); })
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; });
        }
        else if (itemConfig.type === LegendItemType.ZOOM) {
            var _d = Tools.getProperty(Configuration, 'legend', 'zoom'), iconData = _d.iconData, color_1 = _d.color;
            var zoomEnter = additionalItem
                .attr('role', Roles.IMG)
                .attr('aria-label', 'zoom')
                .selectAll('g.icon')
                .data(iconData)
                .enter();
            // add '+' for the magnifying icon
            zoomEnter
                .append('g')
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .attr('width', function (d) { return d.width; })
                .attr('height', function (d) { return d.height; })
                .append('polygon')
                .attr('points', '7.7 4.82 5.78 4.82 5.78 2.89 4.82 2.89 4.82 4.82 2.89 4.82 2.89 5.78 4.82 5.78 4.82 7.7 5.78 7.7 5.78 5.78 7.7 5.78 7.7 4.82')
                .attr('fill', function (d) {
                return itemConfig.color ? itemConfig.color : color_1;
            });
            // add the magnifying zoom icon handle/circle
            zoomEnter
                .append('path')
                .attr('d', 'M9.36,8.67A5.22,5.22,0,0,0,10.59,5.3,5.3,5.3,0,1,0,5.3,10.59,5.22,5.22,0,0,0,8.67,9.36L12.32,13l.68-.68Zm-4.06,1A4.34,4.34,0,1,1,9.63,5.3,4.33,4.33,0,0,1,5.3,9.63Z')
                .attr('fill', function (d) {
                return itemConfig.color ? itemConfig.color : color_1;
            });
        }
    };
    Legend.prototype.truncateLegendText = function () {
        var svg = this.getComponentContainer();
        var truncationOptions = Tools.getProperty(this.getOptions(), 'legend', 'truncation');
        // Truncation
        // get user provided custom values for truncation
        var truncationType = Tools.getProperty(truncationOptions, 'type');
        var truncationThreshold = Tools.getProperty(truncationOptions, 'threshold');
        var truncationNumCharacter = Tools.getProperty(truncationOptions, 'numCharacter');
        var addedLegendItemsText = svg.selectAll('div.legend-item p');
        var self = this;
        // Add an ID for the checkbox to use through `aria-labelledby`
        addedLegendItemsText.attr('id', function (d, i) {
            var elementToReference = this.parentNode.querySelector('div.checkbox') ||
                this.parentNode;
            return elementToReference.getAttribute('aria-labelledby');
        });
        // truncate the legend label if it's too long
        if (truncationType !== TruncationTypes.NONE) {
            addedLegendItemsText.html(function (d) {
                if (d.name.length > truncationThreshold) {
                    return Tools.truncateLabel(d.name, truncationType, truncationNumCharacter);
                }
                else {
                    return d.name;
                }
            });
        }
        else {
            addedLegendItemsText.html(function (d) { return d.name; });
        }
    };
    Legend.prototype.addEventListeners = function () {
        var self = this;
        var svg = this.getComponentContainer();
        var options = this.getOptions();
        var legendOptions = Tools.getProperty(options, 'legend');
        var truncationThreshold = Tools.getProperty(legendOptions, 'truncation', 'threshold');
        svg.selectAll('div.legend-item')
            .on('mouseover', function (event) {
            self.services.events.dispatchEvent(Events.Legend.ITEM_HOVER, {
                hoveredElement: select(this),
            });
            var hoveredItem = select(this);
            hoveredItem.select('div.checkbox').classed('hovered', true);
            var hoveredItemData = hoveredItem.datum();
            if (hoveredItemData.name.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: hoveredItem,
                    content: hoveredItemData.name,
                });
            }
        })
            .on('mousemove', function (event) {
            self.services.events.dispatchEvent(Events.Tooltip.MOVE, {
                event: event,
            });
        })
            .on('click', function () {
            self.services.events.dispatchEvent(Events.Legend.ITEM_CLICK, {
                clickedElement: select(this),
            });
            var clickedItem = select(this);
            var clickedItemData = clickedItem.datum();
            self.model.toggleDataLabel(clickedItemData.name);
        })
            .on('mouseout', function () {
            var hoveredItem = select(this);
            hoveredItem.select('div.checkbox').classed('hovered', false);
            self.services.events.dispatchEvent(Events.Tooltip.HIDE);
            self.services.events.dispatchEvent(Events.Legend.ITEM_MOUSEOUT, {
                hoveredElement: hoveredItem,
            });
        });
        svg.selectAll('div.legend-item div.checkbox').on('keyup', function (event) {
            if (event.key && event.key === 'Tab') {
                // Higlight group
                self.services.events.dispatchEvent(Events.Legend.ITEM_HOVER, {
                    hoveredElement: select(this),
                });
            }
        });
        svg.selectAll('div.legend-item div.checkbox').on('keydown', function (event, d) {
            if (event.key && event.key === ' ') {
                event.preventDefault();
                self.model.toggleDataLabel(d.name);
            }
            else if (event.key && event.key === 'Tab') {
                // Unhiglight group
                self.services.events.dispatchEvent(Events.Legend.ITEM_MOUSEOUT, {
                    hoveredElement: select(this),
                });
            }
        });
        svg.selectAll('g.additional-item').on('mouseover', function (event) {
            var hoveredItem = select(this);
            var hoveredItemData = hoveredItem.datum();
            if (hoveredItemData.name.length > truncationThreshold) {
                self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
                    event: event,
                    hoveredElement: hoveredItem,
                    content: hoveredItemData.name,
                });
            }
        });
    };
    return Legend;
}(Component));
export { Legend };
//# sourceMappingURL=../../../src/components/essentials/legend.js.map