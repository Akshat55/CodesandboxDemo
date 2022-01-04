import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Area extends Component {
    type: string;
    renderType: RenderTypes;
    gradient_id: string;
    init(): void;
    render(animate?: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    destroy(): void;
}
