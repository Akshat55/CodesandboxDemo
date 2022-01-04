import { Chart } from '../chart';
import { TreemapChartModel } from '../model/treemap';
import { ChartConfig, TreemapChartOptions } from '../interfaces/index';
export declare class TreemapChart extends Chart {
    model: TreemapChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<TreemapChartOptions>);
    getComponents(): any[];
}
