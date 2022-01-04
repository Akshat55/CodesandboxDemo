import { Component } from '../component';
import { ChartModel } from '../../model/model';
import { RenderTypes } from '../../interfaces';
import Position from '@carbon/utils-position';
export declare class Highlight extends Component {
    type: string;
    renderType: RenderTypes;
    label: any;
    positionService: Position;
    highlightStrokeWidth: number;
    constructor(model: ChartModel, services: any);
    render(animate?: boolean): void;
}
