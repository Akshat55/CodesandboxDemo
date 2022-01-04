var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Internal Imports
import { LayoutGrowth, LayoutAlignItems, LayoutDirection, LegendOrientations, Events as ChartEvents, RenderTypes, } from './interfaces';
// Misc
import { ChartModel } from './model/model';
import { Modal, Title, Legend, LayoutComponent, Toolbar, Tooltip, Spacer, CanvasChartClip, } from './components';
import { Tools } from './tools';
// Services
import { CanvasZoom, DOMUtils, Events, Files, GradientUtils, Transitions, } from './services/index';
var Chart = /** @class */ (function () {
    function Chart(holder, chartConfigs) {
        this.services = {
            domUtils: DOMUtils,
            files: Files,
            events: Events,
            gradientUtils: GradientUtils,
            transitions: Transitions,
            canvasZoom: CanvasZoom,
        };
        this.model = new ChartModel(this.services);
        // do nothing.
    }
    // Contains the code that uses properties that are overridable by the super-class
    Chart.prototype.init = function (holder, chartConfigs) {
        var _this = this;
        // Store the holder in the model
        this.model.set({ holder: holder }, { skipUpdate: true });
        // Initialize all services
        Object.keys(this.services).forEach(function (serviceName) {
            var serviceObj = _this.services[serviceName];
            _this.services[serviceName] = new serviceObj(_this.model, _this.services);
        });
        // Call update() when model has been updated
        this.services.events.addEventListener(ChartEvents.Model.UPDATE, function (e) {
            var animate = !!Tools.getProperty(e, 'detail', 'animate');
            _this.update(animate);
        });
        // Set model data & options
        this.model.setData(chartConfigs.data);
        // Set chart resize event listener
        this.services.events.addEventListener(ChartEvents.Chart.RESIZE, function () {
            _this.update(false);
        });
        this.components = this.getComponents();
        this.update();
    };
    Chart.prototype.getComponents = function () {
        console.error('getComponents() method is not implemented');
        return null;
    };
    Chart.prototype.update = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        if (!this.components) {
            return;
        }
        // Update all services
        Object.keys(this.services).forEach(function (serviceName) {
            var serviceObj = _this.services[serviceName];
            serviceObj.update();
        });
        // Render all components
        this.components.forEach(function (component) { return component.render(animate); });
        // Asynchronously dispatch a "render-finished" event
        // This is needed because of d3-transitions
        // Since at the start of the transition
        // Elements do not hold their final size or position
        var pendingTransitions = this.services.transitions.getPendingTransitions();
        var promises = Object.keys(pendingTransitions).map(function (transitionID) {
            var transition = pendingTransitions[transitionID];
            return transition.end().catch(function (e) { return e; }); // Skip rejects since we don't care about those;
        });
        Promise.all(promises).then(function () {
            return _this.services.events.dispatchEvent(ChartEvents.Chart.RENDER_FINISHED);
        });
    };
    Chart.prototype.destroy = function () {
        // Call the destroy() method on all components
        this.components.forEach(function (component) { return component.destroy(); });
        // Remove the chart holder
        this.services.domUtils.getHolder().remove();
        this.model.set({ destroyed: true }, { skipUpdate: true });
    };
    Chart.prototype.getChartComponents = function (graphFrameComponents, configs) {
        var options = this.model.getOptions();
        var toolbarEnabled = Tools.getProperty(options, 'toolbar', 'enabled');
        var legendComponent = {
            id: 'legend',
            components: [new Legend(this.model, this.services)],
            growth: LayoutGrowth.PREFERRED,
        };
        // if canvas zoom is enabled
        var isZoomEnabled = Tools.getProperty(options, 'canvasZoom', 'enabled');
        if (isZoomEnabled && isZoomEnabled === true) {
            graphFrameComponents.push(new CanvasChartClip(this.model, this.services));
        }
        var titleAvailable = !!this.model.getOptions().title;
        var titleComponent = {
            id: 'title',
            components: [new Title(this.model, this.services)],
            growth: LayoutGrowth.STRETCH,
        };
        var toolbarComponent = {
            id: 'toolbar',
            components: [new Toolbar(this.model, this.services)],
            growth: LayoutGrowth.PREFERRED,
        };
        var headerComponent = {
            id: 'header',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays([
                    // always add title to keep layout correct
                    titleComponent
                ], (toolbarEnabled ? [toolbarComponent] : [])), {
                    direction: LayoutDirection.ROW,
                    alignItems: LayoutAlignItems.CENTER,
                }),
            ],
            growth: LayoutGrowth.PREFERRED,
        };
        var graphFrameComponent = {
            id: 'graph-frame',
            components: graphFrameComponents,
            growth: LayoutGrowth.STRETCH,
            renderType: Tools.getProperty(configs, 'graphFrameRenderType') ||
                RenderTypes.SVG,
        };
        var isLegendEnabled = Tools.getProperty(configs, 'excludeLegend') !== true &&
            options.legend.enabled !== false;
        // TODORF - REUSE BETWEEN AXISCHART & CHART
        // Decide the position of the legend in reference to the chart
        var fullFrameComponentDirection = LayoutDirection.COLUMN;
        if (isLegendEnabled) {
            var legendPosition = Tools.getProperty(options, 'legend', 'position');
            if (legendPosition === 'left') {
                fullFrameComponentDirection = LayoutDirection.ROW;
                if (!options.legend.orientation) {
                    options.legend.orientation = LegendOrientations.VERTICAL;
                }
            }
            else if (legendPosition === 'right') {
                fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;
                if (!options.legend.orientation) {
                    options.legend.orientation = LegendOrientations.VERTICAL;
                }
            }
            else if (legendPosition === 'bottom') {
                fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
            }
        }
        var legendSpacerComponent = {
            id: 'spacer',
            components: [new Spacer(this.model, this.services)],
            growth: LayoutGrowth.PREFERRED,
        };
        var fullFrameComponent = {
            id: 'full-frame',
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays((isLegendEnabled ? [legendComponent] : []), (isLegendEnabled ? [legendSpacerComponent] : []), [
                    graphFrameComponent,
                ]), {
                    direction: fullFrameComponentDirection,
                }),
            ],
            growth: LayoutGrowth.STRETCH,
        };
        // Add chart title if it exists
        var topLevelLayoutComponents = [];
        if (titleAvailable || toolbarEnabled) {
            topLevelLayoutComponents.push(headerComponent);
            var titleSpacerComponent = {
                id: 'spacer',
                components: [
                    new Spacer(this.model, this.services, toolbarEnabled ? { size: 15 } : undefined),
                ],
                growth: LayoutGrowth.PREFERRED,
            };
            topLevelLayoutComponents.push(titleSpacerComponent);
        }
        topLevelLayoutComponents.push(fullFrameComponent);
        return [
            new Tooltip(this.model, this.services),
            new Modal(this.model, this.services),
            new LayoutComponent(this.model, this.services, topLevelLayoutComponents, {
                direction: LayoutDirection.COLUMN,
            }),
        ];
    };
    return Chart;
}());
export { Chart };
//# sourceMappingURL=../src/chart.js.map