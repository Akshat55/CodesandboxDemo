import { Component } from '../component';
import { ChartModel } from '../../model/model';
import { RenderTypes } from '../../interfaces';
export declare class ChartClip extends Component {
    type: string;
    renderType: RenderTypes;
    chartClipId: string;
    chartClipPath: any;
    constructor(model: ChartModel, services: any, configs?: any);
    init(): void;
    render(animate?: boolean): void;
    createClipPath(): void;
}
