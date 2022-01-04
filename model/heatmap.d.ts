import { AxisFlavor } from '../interfaces';
import { ChartModelCartesian } from './cartesian-charts';
/** The gauge chart model layer */
export declare class HeatmapModel extends ChartModelCartesian {
    protected axisFlavor: AxisFlavor;
    private _colorScale;
    private _domains;
    private _ranges;
    private _matrix;
    constructor(services: any);
    /**
     * Get min and maximum value of the display data
     * @returns Array consisting of smallest and largest values in  data
     */
    getValueDomain(): any[];
    /**
     * @override
     * @param value
     * @returns
     */
    getFillColor(value: number): any;
    /**
     * Generate a list of all unique domains
     * @returns String[]
     */
    getUniqueDomain(): string[];
    /**
     * Generates a list of all unique ranges
     * @returns String[]
     */
    getUniqueRanges(): string[];
    /**
     * Generates a matrix (If doesn't exist) and returns it
     * @returns Object
     */
    getMatrix(): {};
    /**
     *
     * @param newData The new raw data to be set
     */
    setData(newData: any): any;
    /**
     * Converts Object matrix into a single array
     * @returns Object[]
     */
    getMatrixAsArray(): Object[];
    /**
     * Generate tabular data from display data
     * @returns Array<Object>
     */
    getTabularDataArray(): any[];
    getColorClassName(configs: {
        value?: number;
        originalClassName?: string;
    }): string;
    protected setColorClassNames(): void;
}
