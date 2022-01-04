import { Pie } from './pie';
import { RenderTypes } from '../../interfaces';
export declare class Donut extends Pie {
    type: string;
    renderType: RenderTypes;
    render(animate?: boolean): void;
    getInnerRadius(): number;
    centerNumberTween(d3Ref: any): (t: any) => void;
}
