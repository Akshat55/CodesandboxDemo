import { WordCloudModel } from '../model/wordcloud';
import { Chart } from '../chart';
import { ChartConfig, WorldCloudChartOptions } from '../interfaces/index';
export declare class WordCloudChart extends Chart {
    model: WordCloudModel;
    constructor(holder: Element, chartConfigs: ChartConfig<WorldCloudChartOptions>);
    getComponents(): any[];
}
