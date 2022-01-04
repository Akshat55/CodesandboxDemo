import { Component } from '../component';
import { AxisPositions, ScaleTypes } from '../../interfaces';
import { ChartModel } from '../../model/model';
import { RenderTypes } from '../../interfaces/enums';
export declare class Axis extends Component {
    type: string;
    renderType: RenderTypes;
    margins: any;
    truncation: {
        [AxisPositions.LEFT]: boolean;
        [AxisPositions.RIGHT]: boolean;
        [AxisPositions.TOP]: boolean;
        [AxisPositions.BOTTOM]: boolean;
    };
    scale: any;
    scaleType: ScaleTypes;
    constructor(model: ChartModel, services: any, configs?: any);
    render(animate?: boolean): void;
    addEventListeners(): void;
    getInvisibleAxisRef(): any;
    getTitleRef(): any;
    getNumberOfFittingTicks(size: any, tickSize: any, spaceRatio: any): any;
    destroy(): void;
}
