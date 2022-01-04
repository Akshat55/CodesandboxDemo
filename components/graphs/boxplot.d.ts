import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Boxplot extends Component {
    type: string;
    renderType: RenderTypes;
    render(animate: boolean): void;
    addBoxEventListeners(): void;
    addCircleEventListeners(): void;
}
