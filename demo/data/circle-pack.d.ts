export declare const circlePackTwoLevelData: {
    name: string;
    children: {
        name: string;
        value: number;
    }[];
}[];
export declare const circlePackTwoLevelOptions: {
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackTwoLevelCustomColorsOptions: {
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
    color: {
        scale: {
            Asia: string;
            'South America': string;
            'North America': string;
            Europe: string;
        };
    };
};
export declare const circlePackSingleOptions: {
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackSingleLevelData: {
    name: string;
    value: number;
}[];
export declare const circlePackThreeLevelOptions: {
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackThreeLevelData: {
    name: string;
    children: ({
        name: string;
        children: {
            name: string;
            value: number;
        }[];
        value?: undefined;
    } | {
        name: string;
        value: number;
        children?: undefined;
    })[];
}[];
export declare const circlePackThreeLevelsMonochromeOptions: {
    title: string;
    canvasZoom: {
        enabled: boolean;
    };
};
export declare const circlePackThreeLevelsMonochromeData: {
    name: string;
    children: {
        name: string;
        children: ({
            name: string;
            children: {
                name: string;
                value: number;
            }[];
            value?: undefined;
        } | {
            name: string;
            value: number;
            children?: undefined;
        })[];
    }[];
}[];
export declare const circlePackThreeLevelNoZoomOptions: {
    title: string;
    circlePack: {
        hierarchyLevel: number;
    };
    canvasZoom: {
        enabled: boolean;
    };
};
