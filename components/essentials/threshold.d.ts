import { Component } from '../component';
import { ChartModel } from '../../model/model';
import { RenderTypes } from '../../interfaces';
import Position from '@carbon/utils-position';
export declare class Threshold extends Component {
    type: string;
    renderType: RenderTypes;
    label: any;
    positionService: Position;
    constructor(model: ChartModel, services: any);
    render(animate?: boolean): void;
    getFormattedValue(datum: any): any;
    appendThresholdLabel(): void;
    setThresholdLabelPosition({ event, datum }: {
        event: any;
        datum: any;
    }): void;
    constructDatumObj(d: any, element: any): {};
    addEventListeners(): void;
}
