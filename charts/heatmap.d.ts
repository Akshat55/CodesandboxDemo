import { HeatmapModel } from '../model/heatmap';
import { AxisChart } from '../axis-chart';
import { HeatmapChartOptions, ChartConfig } from '../interfaces/index';
import { Modal, LayoutComponent, AxisChartsTooltip } from '../components';
export declare class HeatmapChart extends AxisChart {
    model: HeatmapModel;
    constructor(holder: Element, chartConfigs: ChartConfig<HeatmapChartOptions>);
    protected getAxisChartComponents(graphFrameComponents: any[], configs?: any): (AxisChartsTooltip | Modal | LayoutComponent)[];
    getComponents(): any[];
}
