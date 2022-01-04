import { RenderTypes } from '../../interfaces';
import { Legend } from '../';
export declare class ColorScaleLegend extends Legend {
    type: string;
    renderType: RenderTypes;
    private gradient_id;
    init(): void;
    handleAxisComplete: (event: CustomEvent<any>) => void;
    render(animate?: boolean): void;
    destroy(): void;
}
