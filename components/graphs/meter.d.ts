import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Meter extends Component {
    type: string;
    renderType: RenderTypes;
    getStackedBounds(data: any, scale: any): any;
    render(animate?: boolean): void;
    addEventListeners(): void;
    destroy(): void;
}
