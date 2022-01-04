import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
import { Threshold } from '../essentials/threshold';
export declare class TwoDimensionalAxes extends Component {
    type: string;
    renderType: RenderTypes;
    children: any;
    thresholds: Threshold[];
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    render(animate?: boolean): void;
}
