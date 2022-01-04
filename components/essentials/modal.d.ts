import { Component } from '../component';
import { ChartModel } from '../../model/model';
export declare class Modal extends Component {
    type: string;
    isEventListenerAdded: boolean;
    modal: any;
    constructor(model: ChartModel, services: any, configs?: any);
    handleShowModal: () => void;
    addEventListeners(): void;
    removeEventListeners(): void;
    getModalHTML(): string;
    render(): void;
    destroy(): void;
}
