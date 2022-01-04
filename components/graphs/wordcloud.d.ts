import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class WordCloud extends Component {
    type: string;
    renderType: RenderTypes;
    init(): void;
    render(animate?: boolean): void;
    getFontSizeScale(data: any): import("d3-scale").ScaleLinear<number, number>;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
}
