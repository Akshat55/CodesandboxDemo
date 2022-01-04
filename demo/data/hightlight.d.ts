export declare const highlightBoundedAreaTimeSeriesData: {
    group: string;
    date: Date;
    value: number;
    min: number;
    max: number;
}[];
export declare const boundedAreaTimeSeriesWithHighlightsOptions: {
    title: string;
    legend: {
        enabled: boolean;
    };
    bounds: {
        upperBoundMapsTo: string;
        lowerBoundMapsTo: string;
    };
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            scaleType: string;
            highlights: {
                highlightStartMapsTo: string;
                highlightEndMapsTo: string;
                labelMapsTo: string;
                data: {
                    startHighlight: Date;
                    label: string;
                    endHighlight: Date;
                }[];
            };
        };
        left: {
            mapsTo: string;
            scaleType: string;
        };
    };
    curve: string;
};
export declare const boundedAreaTimeSeriesWithHighlightsZoomOptions: any;
