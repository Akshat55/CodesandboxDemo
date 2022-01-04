export declare const histogramContinueData: {
    group: string;
    age: number;
}[];
export declare const histogramContinueOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            bins: number;
            limitDomainToBins: boolean;
        };
        left: {
            title: string;
            scaleType: string;
            stacked: boolean;
            binned: boolean;
        };
    };
};
export declare const histogramContinueWithBinsNumberData: {
    group: string;
    value: number;
}[];
export declare const histogramContinueWithBinsNumberOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            bins: number;
            limitDomainToBins: boolean;
        };
        left: {
            title: string;
            scaleType: string;
            binned: boolean;
        };
    };
};
export declare const histogramContinueWithBinsOptions: {
    title: string;
    axes: {
        bottom: {
            title: string;
            mapsTo: string;
            bins: number[];
            limitDomainToBins: boolean;
        };
        left: {
            title: string;
            scaleType: string;
            stacked: boolean;
            binned: boolean;
        };
    };
};
export declare const histogramTimeSeriesData: {
    group: string;
    transactions: number;
    value: number;
}[];
