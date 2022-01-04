import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Legend extends Component {
    type: string;
    renderType: RenderTypes;
    render(): void;
    sortDataGroups(dataGroups: any, legendOrder: any): any;
    addAdditionalItem(additionalItem: any, itemConfig: any, indexOfItem: any): void;
    truncateLegendText(): void;
    addEventListeners(): void;
}
