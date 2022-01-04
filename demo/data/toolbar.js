import * as barChart from './bar';
import * as lineChart from './line';
// utility function to enable toolbar option
var addToolbarOptions = function (options, configs) {
    options.toolbar = {
        enabled: true,
        numberOfIcons: 3,
    };
    options.zoomBar = {
        top: {
            enabled: true,
        },
    };
    options.toolbar.controls = [
        {
            type: 'Zoom in',
        },
        {
            type: 'Zoom out',
        },
        {
            type: 'Reset zoom',
        },
        {
            type: 'Custom',
            text: 'Custom button',
            shouldBeDisabled: function () { return false; },
            clickFunction: function () {
                console.log('Custom click function executed. Event `toolbar-button-click` has also been dispatched.');
            },
            iconSVG: {
                content: "<path d=\"M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z\"/>\n\t\t\t\t<path d=\"M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z\"/><rect data-name=\"&lt;Transparent Rectangle&gt;\" width=\"32\" height=\"32\" style=\"fill: none\"/>",
            },
        },
    ];
    if (configs) {
        if (configs.titleSuffix) {
            options.title += configs.titleSuffix;
        }
        if (configs.numberOfIcons) {
            options.toolbar.numberOfIcons = configs.numberOfIcons;
        }
        if (configs.controls) {
            options.toolbar.controls = configs.controls;
        }
    }
    return options;
};
export var toolbarStackedBarTimeSeriesData = barChart.stackedBarTimeSeriesData;
export var toolbarStackedBarTimeSeriesOptions = addToolbarOptions(Object.assign({}, barChart.stackedBarTimeSeriesOptions));
export var toolbarLineTimeSeriesData = lineChart.lineTimeSeriesData;
export var toolbarLineTimeSeriesOptions = addToolbarOptions(Object.assign({}, lineChart.lineTimeSeriesOptions), {
    titleSuffix: ' - two icons',
    numberOfIcons: 2,
    controls: [
        {
            type: 'Reset zoom',
        },
        {
            type: 'Zoom in',
        },
        {
            type: 'Zoom out',
        },
    ],
});
//# sourceMappingURL=../../../demo/data/toolbar.js.map