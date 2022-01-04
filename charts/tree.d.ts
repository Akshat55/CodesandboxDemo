import { Chart } from '../chart';
import { TreeChartModel } from '../model/tree';
import { ChartConfig, TreeChartOptions } from '../interfaces/index';
export declare class TreeChart extends Chart {
    model: TreeChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<TreeChartOptions>);
    getComponents(): any[];
}
