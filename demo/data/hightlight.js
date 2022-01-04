import { addZoomBarToOptions } from './zoom-bar';
import { boundedAreaTimeSeriesData } from './area';
export var highlightBoundedAreaTimeSeriesData = boundedAreaTimeSeriesData;
export var boundedAreaTimeSeriesWithHighlightsOptions = {
    title: 'Bounded area (time series - natural curve)',
    legend: {
        enabled: false,
    },
    bounds: {
        upperBoundMapsTo: 'max',
        lowerBoundMapsTo: 'min',
    },
    axes: {
        bottom: {
            title: '2019 Annual Sales Figures',
            mapsTo: 'date',
            scaleType: 'time',
            highlights: {
                highlightStartMapsTo: 'startHighlight',
                highlightEndMapsTo: 'endHighlight',
                labelMapsTo: 'label',
                data: [
                    {
                        startHighlight: new Date(2019, 0, 3),
                        label: 'Custom formatter',
                        endHighlight: new Date(2019, 0, 8),
                    },
                    {
                        startHighlight: new Date(2019, 0, 13),
                        label: 'Custom formatter',
                        endHighlight: new Date(2019, 0, 14),
                    },
                ],
            },
        },
        left: {
            mapsTo: 'value',
            scaleType: 'linear',
        },
    },
    curve: 'curveNatural',
};
export var boundedAreaTimeSeriesWithHighlightsZoomOptions = addZoomBarToOptions(Object.assign({}, boundedAreaTimeSeriesWithHighlightsOptions));
//# sourceMappingURL=../../../demo/data/hightlight.js.map