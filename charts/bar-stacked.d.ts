import { AxisChart } from '../axis-chart';
import { ChartConfig, BarChartOptions } from '../interfaces/index';
export declare class StackedBarChart extends AxisChart {
    constructor(holder: Element, chartConfigs: ChartConfig<BarChartOptions>);
    getComponents(): any[];
}
