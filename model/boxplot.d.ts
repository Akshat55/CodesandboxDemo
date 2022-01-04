import { ChartModelCartesian } from './cartesian-charts';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export declare class BoxplotChartModel extends ChartModelCartesian {
    constructor(services: any);
    getBoxQuartiles(d: any): {
        q_25: number;
        q_50: number;
        q_75: number;
    };
    getBoxplotData(): any[];
    getTabularDataArray(): any[][];
    protected setColorClassNames(): void;
}
