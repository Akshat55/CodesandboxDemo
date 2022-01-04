import { RenderTypes } from '../../interfaces';
import { Component } from '../component';
export declare class Histogram extends Component {
    type: string;
    renderType: RenderTypes;
    init(): void;
    render(animate: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    destroy(): void;
}
