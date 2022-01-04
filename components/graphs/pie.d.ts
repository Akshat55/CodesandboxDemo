import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Pie extends Component {
    type: string;
    renderType: RenderTypes;
    arc: any;
    hoverArc: any;
    init(): void;
    getInnerRadius(): number;
    render(animate?: boolean): void;
    renderCallouts(calloutData: any[]): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    protected computeRadius(): number;
}
