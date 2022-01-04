import { DOMUtils } from '../services';
import { RenderTypes } from '../interfaces';
import { Tools } from '../tools';
// D3 Imports
import { select } from 'd3-selection';
// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
var Component = /** @class */ (function () {
    function Component(model, services, configs) {
        this.renderType = RenderTypes.HTML;
        this.configs = {};
        this.model = model;
        this.services = services;
        if (configs) {
            this.configs = configs;
            if (this.configs.id) {
                var chartprefix = Tools.getProperty(this.model.getOptions(), 'style', 'prefix');
                this.id = chartprefix + "--" + this.configs.id;
            }
        }
        // Set parent element to shell SVG if no parent exists for component
        if (!this.parent) {
            this.setParent(select(this.services.domUtils.getMainContainer()));
        }
    }
    Component.prototype.init = function () {
        // do nothing.
    };
    Component.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        console.error('render() method is not implemented');
    };
    Component.prototype.destroy = function () {
        // do nothing.
    };
    // Used to pass down information to the components
    Component.prototype.setModel = function (newObj) {
        this.model = newObj;
    };
    // Used to pass down information to the components
    Component.prototype.setServices = function (newObj) {
        this.services = newObj;
    };
    Component.prototype.setParent = function (parent) {
        var oldParent = this.parent;
        this.parent = parent;
        if (oldParent && oldParent.node() === parent.node()) {
            return;
        }
        if (this.type) {
            var chartprefix = Tools.getProperty(this.model.getOptions(), 'style', 'prefix');
            this.parent.classed(settings.prefix + "--" + chartprefix + "--" + this.type, true);
            if (oldParent) {
                oldParent.classed(settings.prefix + "--" + chartprefix + "--" + this.type, false);
            }
        }
    };
    Component.prototype.getParent = function () {
        return this.parent;
    };
    Component.prototype.getComponentContainer = function (configs) {
        if (configs === void 0) { configs = { withinChartClip: false }; }
        if (this.type) {
            var chartprefix = Tools.getProperty(this.model.getOptions(), 'style', 'prefix');
            var idSelector = this.id ? "#" + this.id : '';
            var container = DOMUtils.appendOrSelect(this.parent, "" + (this.renderType === RenderTypes.SVG ? 'svg' : 'div') + idSelector + "." + settings.prefix + "--" + chartprefix + "--" + this.type);
            if (configs.withinChartClip) {
                // get unique chartClipId int this chart from model
                var chartClipId = this.model.get('chartClipId');
                if (chartClipId) {
                    var chartClipSelection = select("#" + chartClipId);
                    var chartClipRectSelection = chartClipSelection.select('rect');
                    /*
                     * these checks are needed because of a chrome bug
                     * related to the rendering of the clip path
                     */
                    if (chartClipRectSelection.size() !== 0 &&
                        parseFloat(chartClipRectSelection.attr('height')) > 0) {
                        container.attr('clip-path', "url(#" + chartClipId + ")");
                    }
                }
            }
            return container.attr('width', '100%').attr('height', '100%');
        }
        return this.parent;
    };
    /**
     * graphs used in combo charts share a model with global options but can receive their own local options.
     * this function retrieves the global options and merges it with any options passed into this
     * component's config.options object.
     */
    Component.prototype.getOptions = function () {
        if (this.configs.options) {
            var options = Tools.merge({}, this.model.getOptions(), this.configs.options);
            return options;
        }
        return this.model.getOptions();
    };
    return Component;
}());
export { Component };
//# sourceMappingURL=../../src/components/component.js.map