import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class StackedArea extends Component {
    type: string;
    renderType: RenderTypes;
    areaGenerator: any;
    init(): void;
    render(animate?: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: () => void;
}
