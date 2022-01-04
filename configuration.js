var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Tools } from './tools';
import { 
// ENUMS
Alignments, GaugeTypes, LegendPositions, TruncationTypes, ToolbarControlTypes, ZoomBarTypes, LegendItemType, TreeTypes, DividerStatus, } from './interfaces';
import enUSLocaleObject from 'date-fns/locale/en-US/index';
import { circlePack } from './configuration-non-customizable';
/*
 *****************************
 * User configurable options *
 *****************************
 */
/**
 * Default truncation configuration
 */
var standardTruncationOptions = {
    type: TruncationTypes.END_LINE,
    threshold: 16,
    numCharacter: 14,
};
/**
 * Legend options
 */
var legend = {
    enabled: true,
    position: LegendPositions.BOTTOM,
    clickable: true,
    truncation: standardTruncationOptions,
    alignment: Alignments.LEFT,
    order: null,
    additionalItems: [],
};
/**
 * Grid options
 */
export var grid = {
    x: {
        // set enable to false will not draw grid and stroke of grid backdrop
        enabled: true,
        numberOfTicks: 15,
        alignWithAxisTicks: false,
    },
    y: {
        // set enable to false will not draw grid and stroke of grid backdrop
        enabled: true,
        numberOfTicks: 5,
        alignWithAxisTicks: false,
    },
};
/**
 * Ruler options
 */
export var ruler = {
    // enable or disable ruler
    enabled: true,
};
/**
 * Tooltip options
 */
export var baseTooltip = {
    enabled: true,
    showTotal: true,
    truncation: standardTruncationOptions,
    groupLabel: 'Group',
};
// These options will be managed by Tools.mergeDefaultChartOptions
// by removing the ones the user is not providing,
// and by TwoDimensionalAxes.
var axes = {
    top: {
        visible: true,
        includeZero: true,
        truncation: standardTruncationOptions,
    },
    bottom: {
        visible: true,
        includeZero: true,
        truncation: standardTruncationOptions,
    },
    left: {
        visible: true,
        includeZero: true,
        truncation: standardTruncationOptions,
    },
    right: {
        visible: true,
        includeZero: true,
        truncation: standardTruncationOptions,
    },
};
export var timeScale = {
    addSpaceOnEdges: 1,
    showDayName: false,
    localeObject: enUSLocaleObject,
    timeIntervalFormats: {
        '15seconds': { primary: 'MMM d, pp', secondary: 'pp' },
        minute: { primary: 'MMM d, p', secondary: 'p' },
        '30minutes': { primary: 'MMM d, p', secondary: 'p' },
        hourly: { primary: 'MMM d, hh a', secondary: 'hh a' },
        daily: { primary: 'MMM d', secondary: 'd' },
        weekly: { primary: 'eee, MMM d', secondary: 'eee' },
        monthly: { primary: 'MMM yyyy', secondary: 'MMM' },
        quarterly: { primary: "QQQ ''yy", secondary: 'QQQ' },
        yearly: { primary: 'yyyy', secondary: 'yyyy' },
    },
};
var isFullScreenEnabled = typeof document !== 'undefined' &&
    (document['fullscreenEnabled'] ||
        document['webkitFullscreenEnabled'] ||
        document['mozFullScreenEnabled'] ||
        document['msFullscreenEnabled']);
/**
 * Base chart options common to any chart
 */
var chart = {
    width: null,
    height: null,
    resizable: true,
    tooltip: baseTooltip,
    legend: legend,
    style: {
        prefix: 'cc',
    },
    data: {
        groupMapsTo: 'group',
        loading: false,
        selectedGroups: [],
    },
    color: {
        scale: null,
        pairing: {
            numberOfVariants: null,
            option: 1,
        },
        gradient: {
            enabled: false,
        },
    },
    toolbar: {
        enabled: true,
        numberOfIcons: 3,
        controls: __spreadArrays([
            {
                type: ToolbarControlTypes.SHOW_AS_DATATABLE,
            }
        ], (isFullScreenEnabled
            ? [
                {
                    type: ToolbarControlTypes.MAKE_FULLSCREEN,
                },
            ]
            : []), [
            {
                type: ToolbarControlTypes.EXPORT_CSV,
            },
            {
                type: ToolbarControlTypes.EXPORT_PNG,
            },
            {
                type: ToolbarControlTypes.EXPORT_JPG,
            },
        ]),
    },
};
/**
 * Options common to any chart with an axis
 */
var axisChart = Tools.merge({}, chart, {
    axes: axes,
    timeScale: timeScale,
    grid: grid,
    ruler: ruler,
    zoomBar: {
        zoomRatio: 0.4,
        minZoomRatio: 0.01,
        top: {
            enabled: false,
            type: ZoomBarTypes.GRAPH_VIEW,
        },
    },
});
/**
 * options specific to simple bar charts
 */
var baseBarChart = Tools.merge({}, axisChart, {
    bars: {
        maxWidth: 16,
    },
    timeScale: Tools.merge(timeScale, {
        addSpaceOnEdges: 1,
    }),
});
/**
 * options specific to simple bar charts
 */
var simpleBarChart = Tools.merge({}, baseBarChart, {});
/**
 * options specific to simple bar charts
 */
var groupedBarChart = Tools.merge({}, baseBarChart, {});
/**
 * options specific to stacked bar charts
 */
var stackedBarChart = Tools.merge({}, baseBarChart, {
    bars: Tools.merge({}, baseBarChart.bars, {
        dividerSize: 1.5,
    }),
});
/**
 * options specific to boxplot charts
 */
var boxplotChart = Tools.merge({}, baseBarChart, {});
/**
 * options specific to scatter charts
 */
var scatterChart = Tools.merge({}, axisChart, {
    points: {
        // default point radius to 4
        radius: 4,
        fillOpacity: 0.3,
        filled: true,
        enabled: true,
    },
});
/**
 * options specific to lollipop charts
 */
var lollipopChart = scatterChart;
/**
 * options specific to line charts
 */
var lineChart = Tools.merge({}, scatterChart, {
    points: {
        // default point radius to 3
        radius: 3,
        filled: false,
        enabled: true,
    },
});
/**
 * options specific to area charts
 */
var areaChart = Tools.merge({}, lineChart, {
    timeScale: Tools.merge(timeScale, {
        addSpaceOnEdges: 0,
    }),
});
/**
 * options specific to stacked area charts
 */
var stackedAreaChart = areaChart;
/**
 * options specific to bubble charts
 */
var bubbleChart = Tools.merge({}, axisChart, {
    bubble: {
        radiusMapsTo: 'radius',
        radiusLabel: 'Radius',
        radiusRange: function (chartSize, data) {
            var smallerChartDimension = Math.min(chartSize.width, chartSize.height);
            return [
                (smallerChartDimension * 3) / 400,
                (smallerChartDimension * 25) / 400,
            ];
        },
        fillOpacity: 0.2,
        enabled: true,
    },
    points: {
        filled: true,
    },
    legend: {
        additionalItems: [
            {
                type: LegendItemType.RADIUS,
                name: 'Radius',
            },
        ],
    },
});
/**
 * options specific to bullet charts
 */
var bulletChart = Tools.merge({}, axisChart, {
    bullet: {
        performanceAreaTitles: ['Poor', 'Satisfactory', 'Great'],
    },
    grid: {
        x: {
            enabled: false,
        },
        y: {
            enabled: false,
        },
    },
    legend: {
        additionalItems: [
            {
                type: LegendItemType.AREA,
                name: 'Poor area',
            },
            {
                type: LegendItemType.AREA,
                name: 'Satisfactory area',
            },
            {
                type: LegendItemType.AREA,
                name: 'Great area',
            },
            {
                type: LegendItemType.QUARTILE,
                name: 'Quartiles',
            },
        ],
    },
});
/**
 * options specific to stacked bar charts
 */
var histogramChart = Tools.merge({}, baseBarChart, {
    bars: {
        dividerSize: 1.5,
    },
    timeScale: Tools.merge(timeScale, {
        addSpaceOnEdges: 0,
    }),
});
/*
 * options specific to word cloud charts
 */
var wordCloudChart = Tools.merge({}, chart, {
    tooltip: Tools.merge({}, baseTooltip, {
        wordLabel: 'Word',
        valueLabel: 'Value',
    }),
    wordCloud: {
        fontSizeMapsTo: 'value',
        fontSizeRange: function (chartSize, data) {
            var smallerChartDimension = Math.min(chartSize.width, chartSize.height);
            return [
                (smallerChartDimension * 20) / 400,
                (smallerChartDimension * 75) / 400,
            ];
        },
        wordMapsTo: 'word',
    },
});
/**
 * options specific to pie charts
 */
var pieChart = Tools.merge({}, chart, {
    pie: {
        labels: {
            formatter: null,
            enabled: true,
        },
        alignment: Alignments.LEFT,
        sortFunction: null,
        valueMapsTo: 'value',
    },
});
/**
 * options specific to gauge charts
 */
var gaugeChart = Tools.merge({}, chart, {
    legend: {
        enabled: false,
    },
    gauge: {
        type: GaugeTypes.SEMI,
        arcWidth: 16,
        deltaArrow: {
            size: function (radius) { return radius / 8; },
            enabled: true,
        },
        showPercentageSymbol: true,
        status: null,
        numberSpacing: 10,
        deltaFontSize: function (radius) { return radius / 8; },
        valueFontSize: function (radius) { return radius / 2.5; },
        numberFormatter: function (number) {
            return number.toFixed(2) % 1 !== 0
                ? number.toFixed(2).toLocaleString()
                : number.toFixed().toLocaleString();
        },
        alignment: Alignments.LEFT,
    },
});
/**
 * options specific to donut charts
 */
var donutChart = Tools.merge({}, pieChart, {
    donut: {
        center: {
            numberFontSize: function (radius) {
                return Math.min((radius / 100) * 24, 24) + 'px';
            },
            titleFontSize: function (radius) { return Math.min((radius / 100) * 15, 15) + 'px'; },
            titleYPosition: function (radius) { return Math.min((radius / 80) * 20, 20); },
            numberFormatter: function (number) { return Math.floor(number).toLocaleString(); },
        },
        alignment: Alignments.LEFT,
    },
});
var meterChart = Tools.merge({}, chart, {
    legend: {
        enabled: false,
        clickable: false,
    },
    meter: {
        proportional: null,
        statusBar: {
            percentageIndicator: {
                enabled: true,
            },
        },
    },
});
var proportionalMeterChart = Tools.merge({}, meterChart, {
    legend: {
        enabled: true,
    },
});
/**
 * options specific to radar charts
 */
var radarChart = Tools.merge({}, chart, {
    radar: {
        axes: {
            angle: 'key',
            value: 'value',
        },
        alignment: Alignments.LEFT,
    },
    tooltip: {
        gridline: {
            enabled: true,
        },
        valueFormatter: function (value) {
            return value !== null && value !== undefined ? value : 'N/A';
        },
    },
});
/**
 * options specific to combo charts
 */
var comboChart = Tools.merge({}, baseBarChart, {
    comboChartTypes: [],
});
/*
 * options specific to tree charts
 */
var treeChart = Tools.merge({
    tree: {
        type: TreeTypes.TREE,
    },
}, chart, {});
/*
 * options specific to treemap charts
 */
var treemapChart = Tools.merge({}, chart, {
    data: Tools.merge(chart.data, {
        groupMapsTo: 'name',
    }),
});
/*
 * options specific to circle pack charts
 */
var circlePackChart = Tools.merge({}, chart, circlePack, {
    data: Tools.merge(chart.data, {
        groupMapsTo: 'name',
    }),
});
var alluvialChart = Tools.merge({}, chart, {
    alluvial: {
        data: Tools.merge(chart.data, {
            groupMapsTo: 'source',
        }),
        nodePadding: 24,
        monochrome: false,
        nodes: [],
    },
});
var heatmapChart = Tools.merge({}, chart, {
    axes: axes,
    heatmap: {
        divider: {
            state: DividerStatus.AUTO,
        },
        colorLegend: {
            type: 'linear',
        },
    },
});
export var options = {
    chart: chart,
    axisChart: axisChart,
    simpleBarChart: simpleBarChart,
    groupedBarChart: groupedBarChart,
    stackedBarChart: stackedBarChart,
    boxplotChart: boxplotChart,
    bubbleChart: bubbleChart,
    bulletChart: bulletChart,
    histogramChart: histogramChart,
    lineChart: lineChart,
    areaChart: areaChart,
    stackedAreaChart: stackedAreaChart,
    scatterChart: scatterChart,
    lollipopChart: lollipopChart,
    pieChart: pieChart,
    donutChart: donutChart,
    meterChart: meterChart,
    proportionalMeterChart: proportionalMeterChart,
    radarChart: radarChart,
    gaugeChart: gaugeChart,
    comboChart: comboChart,
    treeChart: treeChart,
    treemapChart: treemapChart,
    circlePackChart: circlePackChart,
    wordCloudChart: wordCloudChart,
    alluvialChart: alluvialChart,
    heatmapChart: heatmapChart,
};
export * from './configuration-non-customizable';
//# sourceMappingURL=../src/configuration.js.map