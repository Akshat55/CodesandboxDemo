import { BaseChartOptions, AxisChartOptions, ScatterChartOptions, LollipopChartOptions, LineChartOptions, BarChartOptions, StackedBarChartOptions, BoxplotChartOptions, AreaChartOptions, PieChartOptions, GaugeChartOptions, DonutChartOptions, BubbleChartOptions, BulletChartOptions, HistogramChartOptions, RadarChartOptions, ComboChartOptions, TreeChartOptions, TreemapChartOptions, CirclePackChartOptions, WorldCloudChartOptions, AlluvialChartOptions, GridOptions, RulerOptions, TimeScaleOptions, TooltipOptions, MeterChartOptions, ProportionalMeterChartOptions, HeatmapChartOptions } from './interfaces';
/**
 * Grid options
 */
export declare const grid: GridOptions;
/**
 * Ruler options
 */
export declare const ruler: RulerOptions;
/**
 * Tooltip options
 */
export declare const baseTooltip: TooltipOptions;
export declare const timeScale: TimeScaleOptions;
export declare const options: {
    chart: BaseChartOptions;
    axisChart: AxisChartOptions;
    simpleBarChart: BarChartOptions;
    groupedBarChart: BarChartOptions;
    stackedBarChart: StackedBarChartOptions;
    boxplotChart: BoxplotChartOptions;
    bubbleChart: BubbleChartOptions;
    bulletChart: BulletChartOptions;
    histogramChart: HistogramChartOptions;
    lineChart: LineChartOptions;
    areaChart: AreaChartOptions;
    stackedAreaChart: AreaChartOptions;
    scatterChart: ScatterChartOptions;
    lollipopChart: LollipopChartOptions;
    pieChart: PieChartOptions;
    donutChart: DonutChartOptions;
    meterChart: MeterChartOptions;
    proportionalMeterChart: ProportionalMeterChartOptions;
    radarChart: RadarChartOptions;
    gaugeChart: GaugeChartOptions;
    comboChart: ComboChartOptions;
    treeChart: TreeChartOptions;
    treemapChart: TreemapChartOptions;
    circlePackChart: CirclePackChartOptions;
    wordCloudChart: WorldCloudChartOptions;
    alluvialChart: AlluvialChartOptions;
    heatmapChart: HeatmapChartOptions;
};
export * from './configuration-non-customizable';
