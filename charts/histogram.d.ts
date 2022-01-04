import { ChartModelBinned } from '../model/binned-charts';
import { AxisChart } from '../axis-chart';
import { ChartConfig, HistogramChartOptions } from '../interfaces/index';
export declare class HistogramChart extends AxisChart {
    model: ChartModelBinned;
    constructor(holder: Element, chartConfigs: ChartConfig<HistogramChartOptions>);
    getComponents(): any[];
}
