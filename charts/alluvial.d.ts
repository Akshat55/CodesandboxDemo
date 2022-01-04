import { Chart } from '../chart';
import { AlluvialChartModel } from '../model/alluvial';
import { ChartConfig, AlluvialChartOptions } from '../interfaces/index';
export declare class AlluvialChart extends Chart {
    model: AlluvialChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<AlluvialChartOptions>);
    getComponents(): any[];
}
