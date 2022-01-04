import { Scatter } from './scatter';
import { RenderTypes } from '../../interfaces';
export declare class StackedScatter extends Scatter {
    type: string;
    renderType: RenderTypes;
    render(animate: boolean): void;
    getTooltipData(hoveredX: any, hoveredY: any): any;
}
