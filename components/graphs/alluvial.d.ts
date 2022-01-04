import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Alluvial extends Component {
    type: string;
    renderType: RenderTypes;
    private graph;
    gradient_id: string;
    render(animate?: boolean): void;
    addLineEventListener(): void;
    addNodeEventListener(): void;
    private traverse;
    getRightArrowIcon(): string;
    destroy(): void;
}
