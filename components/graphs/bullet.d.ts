import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Bullet extends Component {
    type: string;
    renderType: RenderTypes;
    init(): void;
    render(animate: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    destroy(): void;
}
