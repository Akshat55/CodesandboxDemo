import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class ChartBrush extends Component {
    static DASH_LENGTH: number;
    type: string;
    renderType: RenderTypes;
    selectionSelector: string;
    frontSelectionSelector: string;
    render(animate?: boolean): void;
}
