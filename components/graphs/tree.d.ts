import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Tree extends Component {
    type: string;
    renderType: RenderTypes;
    getLongestLabel(data: any): string;
    getMockLabelWidth(svg: any, label: any): any;
    render(animate?: boolean): void;
}
