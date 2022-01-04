import { ChartModel } from './model';
/** The meter chart model layer which extends some of the data setting options.
 * Meter only uses 1 dataset
 *  */
export declare class MeterChartModel extends ChartModel {
    constructor(services: any);
    getMaximumDomain(data: any): any;
    /**
     * Use a provided color for the bar or default to carbon color if no status provided.
     * Defaults to carbon color otherwise.
     * @param group dataset group label
     */
    getFillColor(group: string): any;
    /**
     * Get the associated status for the data by checking the ranges
     */
    getStatus(): any;
    getTabularDataArray(): any[];
}
