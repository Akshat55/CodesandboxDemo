import { Scatter } from './scatter';
import { RenderTypes } from '../../interfaces';
import { Selection } from 'd3-selection';
export declare class Bubble extends Scatter {
    type: string;
    renderType: RenderTypes;
    getRadiusScale(selection: Selection<any, any, any, any>): import("d3-scale").ScaleLinear<number, number>;
    styleCircles(selection: Selection<any, any, any, any>, animate: boolean): void;
    getTooltipAdditionalItems(datum: any): {
        label: any;
        value: any;
    }[];
}
