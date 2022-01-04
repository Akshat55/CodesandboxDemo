import { Bar } from './bar';
import { RenderTypes } from '../../interfaces';
export declare class StackedBar extends Bar {
    type: string;
    renderType: RenderTypes;
    init(): void;
    render(animate: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    destroy(): void;
}
