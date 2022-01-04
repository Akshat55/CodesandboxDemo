export declare const meterData: {
    group: string;
    value: number;
}[];
export declare const meterOptionsWithStatus: {
    title: string;
    meter: {
        peak: number;
        status: {
            ranges: {
                range: number[];
                status: string;
            }[];
        };
    };
    height: string;
};
export declare const meterOptionsCustomColor: {
    title: string;
    meter: {
        peak: number;
        status: {
            ranges: {
                range: number[];
                status: string;
            }[];
        };
    };
    color: {
        scale: {
            'Dataset 1': string;
        };
    };
    height: string;
};
export declare const meterOptionsNoStatus: {
    title: string;
    meter: {
        peak: number;
    };
    height: string;
};
export declare const propMeterData: {
    group: string;
    value: number;
}[];
export declare const propMeterOptions: {
    title: string;
    height: string;
    meter: {
        proportional: {
            total: number;
            unit: string;
        };
    };
    color: {
        pairing: {
            option: number;
        };
    };
};
export declare const propMeterStatusOptions: {
    title: string;
    height: string;
    meter: {
        peak: number;
        proportional: {
            total: number;
            unit: string;
        };
        status: {
            ranges: {
                range: number[];
                status: string;
            }[];
        };
    };
    color: {
        pairing: {
            option: number;
        };
    };
};
export declare const propMeterTruncationOptions: {
    title: string;
    height: string;
    meter: {
        proportional: {
            total: number;
            unit: string;
            totalFormatter: (total: any) => string;
            breakdownFormatter: (x: any) => string;
        };
    };
};
