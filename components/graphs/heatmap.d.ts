import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Heatmap extends Component {
    type: string;
    renderType: RenderTypes;
    private matrix;
    private xBandwidth;
    private yBandwidth;
    private translationUnits;
    init(): void;
    render(animate?: boolean): void;
    /**
     * Generates a box using lines to create a hover effect
     * The lines have drop shadow in their respective direction
     * @param parentTag - tag name
     * @param xBandwidth - X length
     * @param yBandwidth - y length
     */
    private createOuterBox;
    private determineDividerStatus;
    addEventListener(): void;
    handleAxisOnHover: (event: CustomEvent<any>) => void;
    handleAxisMouseOut: (event: CustomEvent<any>) => void;
    destroy(): void;
}
