import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
import { Selection } from 'd3-selection';
export declare class Scatter extends Component {
    type: string;
    renderType: RenderTypes;
    scatterData: any;
    init(): void;
    filterBasedOnZoomDomain(data: any): any;
    getScatterData(): any;
    render(animate: boolean): void;
    isDatapointThresholdAnomaly(datum: any, index: number): boolean;
    styleCircles(selection: Selection<any, any, any, any>, animate: boolean): void;
    handleChartHolderOnHover: (event: CustomEvent<any>) => void;
    handleChartHolderOnMouseOut: (event: CustomEvent<any>) => void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    getTooltipAdditionalItems(datum: any): any;
    addEventListeners(): void;
    destroy(): void;
}
