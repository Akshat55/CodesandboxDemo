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
import { Events, RenderTypes, ToolbarControlTypes } from '../../interfaces';
import { Tools } from '../../tools';
// D3 Imports
import { select } from 'd3-selection';
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'toolbar';
        _this.renderType = RenderTypes.HTML;
        return _this;
    }
    Toolbar.prototype.init = function () {
        var _this = this;
        var bodyOnClickHandler = function () { return _this.updateOverflowMenu(false); };
        // Grab the tooltip element
        this.services.events.addEventListener(Events.Toolbar.SHOW_OVERFLOW_MENU, function () {
            _this.renderOverflowMenu();
            // hide overflow menu if user clicks on somewhere in web page
            document.body.addEventListener('click', bodyOnClickHandler);
        });
        // listen to hide overflow menu event to hide the overflow menu
        this.services.events.addEventListener(Events.Toolbar.HIDE_OVERFLOW_MENU, function () {
            // // hide overflow menu if user clicks on somewhere in web page
            document.body.removeEventListener('click', bodyOnClickHandler);
        });
    };
    Toolbar.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var container = this.getComponentContainer().attr('role', 'toolbar');
        var isDataLoading = Tools.getProperty(this.getOptions(), 'data', 'loading');
        if (isDataLoading) {
            container.html('');
            // Set overflow menu to null if data is loading
            // This will render in a new overflow menu when data is done loading
            this.overflowMenu = null;
        }
        else {
            if (!this.overflowMenu) {
                this.overflowMenu = container
                    .append('div')
                    .attr('class', 'bx--overflow-menu-options bx--overflow-menu--flip')
                    .attr('tabindex', -1)
                    .attr('role', 'menu')
                    .html("<ul></ul>");
            }
            // get the toolbar buttons
            var _a = this.getControlConfigs(), buttonList = _a.buttonList, overflowMenuItemList = _a.overflowMenuItemList;
            // overflow button is required only if overflow menu item list is valid
            if (!!overflowMenuItemList) {
                buttonList.push(this.getOverflowButtonConfig());
            }
            var toolbarControls = container
                .selectAll('div.toolbar-control')
                .data(buttonList, function (button) { return button.id; });
            toolbarControls.exit().remove();
            var enteringToolbarControls = toolbarControls
                .enter()
                .append('div')
                .attr('class', 'toolbar-control bx--overflow-menu')
                .attr('role', 'button');
            var self_1 = this;
            var allToolbarControls = enteringToolbarControls
                .merge(toolbarControls)
                .classed('disabled', function (d) { return d.shouldBeDisabled(); })
                .attr('aria-disabled', function (d) { return d.shouldBeDisabled(); })
                .attr('aria-label', function (d) { return d.title; })
                .html(function (d) { return "\n\t\t\t<button\n\t\t\t\tclass=\"bx--overflow-menu__trigger\"\n\t\t\t\taria-haspopup=\"true\" aria-expanded=\"false\" id=\"" + _this.services.domUtils.generateElementIDString("control-" + d.id) + "\" aria-label=\"" + d.title + "\">\n\t\t\t\t<svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\" style=\"will-change: transform; width: " + (d.iconSVG.width !== undefined ? d.iconSVG.width : '20px') + "; height: " + (d.iconSVG.height !== undefined
                ? d.iconSVG.height
                : '20px') + "\" xmlns=\"http://www.w3.org/2000/svg\" class=\"bx--overflow-menu__icon\" viewBox=\"0 0 32 32\" aria-hidden=\"true\">\n\t\t\t\t\t" + d.iconSVG.content + "\n\t\t\t\t</svg>\n\t\t\t</button>"; })
                .each(function (d, index) {
                var _this = this;
                select(this)
                    .select('button')
                    .on('click', function (event) {
                    if (!d.shouldBeDisabled()) {
                        self_1.triggerFunctionAndEvent(d, event, _this);
                    }
                })
                    .on('keydown', function (event) {
                    if ((event.key && event.key === 'Enter') ||
                        event.key === ' ') {
                        event.preventDefault();
                        self_1.triggerFunctionAndEvent(d, event, _this);
                    }
                    else if (event.key && event.key === 'ArrowLeft') {
                        self_1.focusOnPreviousEnabledToolbarItem(index);
                    }
                    else if (event.key &&
                        event.key === 'ArrowRight') {
                        self_1.focusOnNextEnabledToolbarItem(index);
                    }
                });
            });
            this.overflowButton = this.getComponentContainer().select("button.bx--overflow-menu__trigger#" + this.services.domUtils.generateElementIDString('control-toolbar-overflow-menu'));
        }
    };
    Toolbar.prototype.renderOverflowMenu = function () {
        var _this = this;
        var overflowMenuItemList = this.getControlConfigs().overflowMenuItemList;
        var overflowMenuControls = this.overflowMenu
            .select('ul')
            .selectAll('li.bx--overflow-menu-options__option')
            .data(overflowMenuItemList, function (button) {
            return Tools.getProperty(button, 'id');
        });
        overflowMenuControls.exit().remove();
        var enteringOverflowMenuControls = overflowMenuControls
            .enter()
            .append('li')
            .attr('id', function (d) {
            return _this.services.domUtils.generateElementIDString("control-" + d.id);
        })
            .attr('class', 'bx--overflow-menu-options__option')
            .attr('role', 'menuitem');
        enteringOverflowMenuControls
            .append('button')
            .attr('class', 'bx--overflow-menu-options__btn');
        enteringOverflowMenuControls
            .merge(overflowMenuControls)
            .classed('bx--overflow-menu-options__option--disabled', function (d) {
            return d.shouldBeDisabled();
        })
            .attr('aria-disabled', function (d) { return d.shouldBeDisabled(); })
            .selectAll('button')
            .text(function (d) { return d.text; });
    };
    Toolbar.prototype.isOverflowMenuOpen = function () {
        return this.overflowMenu.classed('is-open');
    };
    // show/hide overflow menu
    Toolbar.prototype.updateOverflowMenu = function (show) {
        if (!this.overflowMenu) {
            return;
        }
        this.overflowMenu.classed('is-open', show);
        // update overflow button background
        if (this.overflowButton) {
            this.overflowButton.attr('aria-expanded', show);
            select(this.overflowButton.node().parentNode).classed('bx--overflow-menu--open', show);
        }
        if (show) {
            this.services.events.dispatchEvent(Events.Toolbar.SHOW_OVERFLOW_MENU);
        }
        else {
            this.services.events.dispatchEvent(Events.Toolbar.HIDE_OVERFLOW_MENU);
        }
    };
    // Toolbar controllers
    Toolbar.prototype.focusOnPreviousEnabledToolbarItem = function (currentItemIndex) {
        var buttonList = this.getToolbarButtonItems();
        var previousItemIndex = buttonList.length;
        for (var i = currentItemIndex - 1; i >= 0; i--) {
            var previousButtonItem = buttonList[i];
            if (!previousButtonItem.shouldBeDisabled()) {
                previousItemIndex = i;
                break;
            }
        }
        // only if previous enabled menu item found
        if (previousItemIndex < buttonList.length) {
            var previousItemNode = select("button#" + this.services.domUtils.generateElementIDString("control-" + buttonList[previousItemIndex].id)).node();
            if ('focus' in previousItemNode) {
                previousItemNode.focus();
            }
        }
    };
    Toolbar.prototype.focusOnNextEnabledToolbarItem = function (currentItemIndex) {
        var buttonList = this.getToolbarButtonItems();
        var nextItemIndex = -1;
        for (var i = currentItemIndex + 1; i < buttonList.length; i++) {
            var nextOverflowMenuItem = buttonList[i];
            if (!nextOverflowMenuItem.shouldBeDisabled()) {
                nextItemIndex = i;
                break;
            }
        }
        // only if next enabled menu item found
        if (nextItemIndex > -1) {
            var nextItemNode = select("button#" + this.services.domUtils.generateElementIDString("control-" + buttonList[nextItemIndex].id)).node();
            if ('focus' in nextItemNode) {
                nextItemNode.focus();
            }
        }
    };
    Toolbar.prototype.focusOnPreviousEnabledMenuItem = function (currentItemIndex) {
        var overflowMenuItems = this.getOverflowMenuItems();
        var previousItemIndex = overflowMenuItems.length;
        for (var i = currentItemIndex - 1; i >= 0; i--) {
            var previousOverflowMenuItem = overflowMenuItems[i];
            if (!previousOverflowMenuItem.shouldBeDisabled()) {
                previousItemIndex = i;
                break;
            }
        }
        // only if previous enabled menu item found
        if (previousItemIndex < overflowMenuItems.length) {
            var previousItemNode = select("#" + this.services.domUtils.generateElementIDString("control-" + overflowMenuItems[previousItemIndex].id) + " button").node();
            if ('focus' in previousItemNode) {
                previousItemNode.focus();
            }
        }
    };
    Toolbar.prototype.focusOnNextEnabledMenuItem = function (currentItemIndex) {
        var overflowMenuItems = this.getOverflowMenuItems();
        var nextItemIndex = -1;
        for (var i = currentItemIndex + 1; i < overflowMenuItems.length; i++) {
            var nextOverflowMenuItem = overflowMenuItems[i];
            if (!nextOverflowMenuItem.shouldBeDisabled()) {
                nextItemIndex = i;
                break;
            }
        }
        // only if next enabled menu item found
        if (nextItemIndex > -1) {
            var nextItemNode = select("#" + this.services.domUtils.generateElementIDString("control-" + overflowMenuItems[nextItemIndex].id) + " button").node();
            if ('focus' in nextItemNode) {
                nextItemNode.focus();
            }
        }
    };
    Toolbar.prototype.toggleOverflowMenu = function (event) {
        var _this = this;
        if (this.isOverflowMenuOpen()) {
            // hide overflow menu
            this.updateOverflowMenu(false);
        }
        else {
            // show overflow menu
            this.updateOverflowMenu(true);
            // setup overflow menu item event listener
            var self_2 = this;
            var overflowMenuItems = this.getOverflowMenuItems();
            overflowMenuItems.forEach(function (menuItem, index) {
                var element = select("#" + _this.services.domUtils.generateElementIDString("control-" + menuItem.id));
                if (element !== null) {
                    element.on('click', function () {
                        self_2.triggerFunctionAndEvent(menuItem, event, element.node());
                        // hide overflow menu
                        self_2.updateOverflowMenu(false);
                    });
                    element.on('keydown', function (keyEvent) {
                        if (keyEvent && keyEvent.key === 'Enter') {
                            self_2.triggerFunctionAndEvent(menuItem, event, element.node());
                        }
                        else if (keyEvent && keyEvent.key === 'ArrowUp') {
                            // focus on previous menu item
                            self_2.focusOnPreviousEnabledMenuItem(index);
                        }
                        else if (keyEvent && keyEvent.key === 'ArrowDown') {
                            // focus on next menu item
                            self_2.focusOnNextEnabledMenuItem(index);
                        }
                        else if (keyEvent && keyEvent.key === 'Escape') {
                            self_2.updateOverflowMenu(false);
                        }
                        // Not hide overflow menu by keyboard arrow up/down event
                        // Prevent page from scrolling up/down
                        keyEvent.preventDefault();
                    });
                }
            });
            // default to focus on the first enabled menu item
            self_2.focusOnNextEnabledMenuItem(-1);
        }
        // propogation should not be stopped for keyboard events
        if (!!event) {
            event.stopImmediatePropagation();
        }
    };
    // Calls passed function && dispatches event
    Toolbar.prototype.triggerFunctionAndEvent = function (control, event, element) {
        // Call custom function only if it exists
        if (typeof control.clickFunction === 'function') {
            control.clickFunction(event);
        }
        // Dispatch selection event
        this.services.events.dispatchEvent(Events.Toolbar.BUTTON_CLICK, {
            control: control,
            event: event,
            element: element,
        });
    };
    Toolbar.prototype.getControlConfigs = function () {
        var _this = this;
        var numberOfIcons = Tools.getProperty(this.getOptions(), 'toolbar', 'numberOfIcons') -
            1;
        var controls = Tools.getProperty(this.getOptions(), 'toolbar', 'controls');
        var overflowSpecificControls = [];
        var buttonList = [];
        var overflowList = [];
        controls.forEach(function (control) {
            var controlConfig = null;
            // check if button is custom or default control
            if (control.type === ToolbarControlTypes.CUSTOM) {
                // add generic id if missing
                if (Tools.getProperty(control, 'id') === null) {
                    // add id directly to the data passed so that id isn't reassigned on rerender
                    control.id = "toolbar-button-" + Toolbar.buttonID++;
                }
                // define function if missing
                if (Tools.getProperty(control, 'shouldBeDisabled') === null) {
                    control.shouldBeDisabled = function () { return false; };
                }
                controlConfig = control;
            }
            else {
                controlConfig = _this.getControlConfigByType(control.type);
            }
            // add to list if config is valid
            if (controlConfig) {
                controlConfig.text = control.text ? control.text : control.type;
                if (controlConfig.id.indexOf('toolbar-export') !== -1) {
                    overflowSpecificControls.push(controlConfig);
                }
                else if (buttonList.length < numberOfIcons) {
                    // check if icon exists else assign to the overflow list
                    if (Tools.getProperty(controlConfig, 'iconSVG', 'content') === null) {
                        overflowList.push(controlConfig);
                    }
                    else {
                        buttonList.push(controlConfig);
                    }
                }
                else {
                    overflowList.push(controlConfig);
                }
            }
        });
        // Ensures the `export` controls are always at the bottom
        overflowList.push.apply(overflowList, overflowSpecificControls);
        if (!overflowList.length) {
            return {
                buttonList: buttonList,
            };
        }
        return {
            buttonList: buttonList,
            overflowMenuItemList: overflowList,
        };
    };
    Toolbar.prototype.getToolbarButtonItems = function () {
        var _a = this.getControlConfigs(), buttonList = _a.buttonList, overflowMenuItemList = _a.overflowMenuItemList;
        if (!!overflowMenuItemList) {
            buttonList.push(this.getOverflowButtonConfig());
        }
        if (!!buttonList) {
            return buttonList;
        }
        return [];
    };
    Toolbar.prototype.getOverflowMenuItems = function () {
        var overflowMenuItemList = this.getControlConfigs().overflowMenuItemList;
        if (!!overflowMenuItemList) {
            return overflowMenuItemList;
        }
        else {
            return [];
        }
    };
    // special button config for overflow button
    Toolbar.prototype.getOverflowButtonConfig = function () {
        var _this = this;
        return {
            id: 'toolbar-overflow-menu',
            title: 'More options',
            shouldBeDisabled: function () { return false; },
            iconSVG: {
                content: "<circle cx=\"16\" cy=\"8\" r=\"2\"></circle>\n\t\t\t\t<circle cx=\"16\" cy=\"16\" r=\"2\"></circle>\n\t\t\t\t<circle cx=\"16\" cy=\"24\" r=\"2\"></circle>",
            },
            clickFunction: function (event) { return _this.toggleOverflowMenu(event); },
        };
    };
    Toolbar.prototype.getControlConfigByType = function (controlType) {
        var _this = this;
        var isZoomBarEnabled = this.services.zoom &&
            this.services.zoom.isZoomBarEnabled() &&
            !this.services.zoom.isEmptyState();
        var displayData = this.model.getDisplayData();
        var controlConfig;
        switch (controlType) {
            case ToolbarControlTypes.ZOOM_IN:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-zoomIn',
                        title: 'Zoom in',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMinZoomDomain();
                        },
                        iconSVG: {
                            content: this.getControlIconByType(controlType),
                        },
                        clickFunction: function () { return _this.services.zoom.zoomIn(); },
                    };
                }
                break;
            case ToolbarControlTypes.ZOOM_OUT:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-zoomOut',
                        title: 'Zoom out',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMaxZoomDomain();
                        },
                        iconSVG: {
                            content: this.getControlIconByType(controlType),
                        },
                        clickFunction: function () { return _this.services.zoom.zoomOut(); },
                    };
                }
                break;
            case ToolbarControlTypes.RESET_ZOOM:
                if (isZoomBarEnabled) {
                    controlConfig = {
                        id: 'toolbar-resetZoom',
                        title: 'Reset zoom',
                        shouldBeDisabled: function () {
                            return _this.services.zoom.isMaxZoomDomain();
                        },
                        iconSVG: {
                            content: this.getControlIconByType(controlType),
                        },
                        clickFunction: function () {
                            return _this.services.zoom.resetZoomDomain();
                        },
                    };
                }
                break;
            case ToolbarControlTypes.MAKE_FULLSCREEN:
                controlConfig = {
                    id: 'toolbar-makefullscreen',
                    iconSVG: {
                        content: this.getControlIconByType(controlType),
                        width: '15px',
                        height: '15px',
                    },
                    title: 'Make fullscreen',
                    shouldBeDisabled: function () { return false; },
                    clickFunction: function () {
                        _this.services.domUtils.toggleFullscreen();
                    },
                };
                break;
            case ToolbarControlTypes.SHOW_AS_DATATABLE:
                controlConfig = {
                    id: 'toolbar-showasdatatable',
                    iconSVG: {
                        content: this.getControlIconByType(controlType),
                    },
                    title: 'Show as table',
                    shouldBeDisabled: function () { return displayData.length === 0; },
                    clickFunction: function () {
                        return _this.services.events.dispatchEvent(Events.Modal.SHOW);
                    },
                };
                break;
            case ToolbarControlTypes.EXPORT_CSV:
                controlConfig = {
                    id: 'toolbar-export-CSV',
                    title: 'Export as CSV',
                    shouldBeDisabled: function () { return false; },
                    iconSVG: {
                        content: this.getControlIconByType(controlType),
                    },
                    clickFunction: function () { return _this.model.exportToCSV(); },
                };
                break;
            case ToolbarControlTypes.EXPORT_PNG:
                controlConfig = {
                    id: 'toolbar-export-PNG',
                    title: 'Export as PNG',
                    shouldBeDisabled: function () { return false; },
                    iconSVG: {
                        content: this.getControlIconByType(controlType),
                    },
                    clickFunction: function () { return _this.services.domUtils.exportToPNG(); },
                };
                break;
            case ToolbarControlTypes.EXPORT_JPG:
                controlConfig = {
                    id: 'toolbar-export-JPG',
                    title: 'Export as JPG',
                    shouldBeDisabled: function () { return false; },
                    iconSVG: {
                        content: this.getControlIconByType(controlType),
                    },
                    clickFunction: function () { return _this.services.domUtils.exportToJPG(); },
                };
                break;
            // add more toolbar control configuration here
            default:
                throw Error('Not supported toolbar control type: ' + controlType);
        }
        return controlConfig;
    };
    Toolbar.prototype.getControlIconByType = function (controlType) {
        switch (controlType) {
            case ToolbarControlTypes.ZOOM_IN:
                return "<polygon points=\"19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>";
            case ToolbarControlTypes.ZOOM_OUT:
                return "<rect x=\"9\" y=\"13\" width=\"10\" height=\"2\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>";
            case ToolbarControlTypes.RESET_ZOOM:
                return "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>";
            case ToolbarControlTypes.MAKE_FULLSCREEN:
                return "<polygon points=\"21 2 21 4 26.59 4 17 13.58 18.41 15 28 5.41 28 11 30 11 30 2 21 2\"/><polygon points=\"15 18.42 13.59 17 4 26.59 4 21 2 21 2 30 11 30 11 28 5.41 28 15 18.42\"/>";
            case ToolbarControlTypes.SHOW_AS_DATATABLE:
                return "<rect x=\"4\" y=\"6\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"12\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"18\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"24\" width=\"18\" height=\"2\"/><rect x=\"26\" y=\"6\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"12\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"18\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"24\" width=\"2\" height=\"2\"/>";
            case ToolbarControlTypes.EXPORT_CSV:
                return "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>";
            case ToolbarControlTypes.EXPORT_JPG:
                return "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>";
            case ToolbarControlTypes.EXPORT_PNG:
                return "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>"; // add more icons here
            // svg icon must be with 32x32 viewBox
            default:
                throw Error('Not supported toolbar control type: ' + controlType);
        }
    };
    Toolbar.buttonID = 0;
    return Toolbar;
}(Component));
export { Toolbar };
//# sourceMappingURL=../../../src/components/axes/toolbar.js.map