import { Ruler } from './ruler';
import { RenderTypes } from '../../interfaces';
export declare class BinnedRuler extends Ruler {
    type: string;
    renderType: RenderTypes;
    showRuler(event: any, [x, y]: [number, number]): void;
}
