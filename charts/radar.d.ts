import { RadarChartModel } from '../model/radar';
import { Chart } from '../chart';
import { ChartConfig, RadarChartOptions } from '../interfaces/index';
export declare class RadarChart extends Chart {
    model: RadarChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<RadarChartOptions>);
    getComponents(): any[];
}
