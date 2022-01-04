import { AxisChart } from '../axis-chart';
import { BulletChartModel } from '../model/bullet';
import { ChartConfig, BulletChartOptions } from '../interfaces/index';
export declare class BulletChart extends AxisChart {
    model: BulletChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<BulletChartOptions>);
    getComponents(): any[];
}
