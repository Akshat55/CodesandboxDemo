import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Treemap extends Component {
    type: string;
    renderType: RenderTypes;
    init(): void;
    render(animate?: boolean): void;
    addEventListeners(): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
}
