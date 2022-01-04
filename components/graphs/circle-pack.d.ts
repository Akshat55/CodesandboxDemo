import { Component } from '../component';
import { RenderTypes } from '../../interfaces/enums';
export declare class CirclePack extends Component {
    type: string;
    renderType: RenderTypes;
    focal: any;
    render(animate?: boolean): void;
    unhighlightChildren(childData: any): void;
    highlightChildren(childData: any): void;
    getZoomClass(node: any): "focal" | "non-focal";
    addLegendListeners(): void;
    removeBackgroundListeners(): void;
    setBackgroundListeners(): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    getZoomIcon(): string;
    addEventListeners(): void;
    destroy(): void;
}
