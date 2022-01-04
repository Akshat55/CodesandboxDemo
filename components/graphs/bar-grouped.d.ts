import { Bar } from './bar';
import { RenderTypes } from '../../interfaces';
import { ScaleBand } from 'd3-scale';
export declare class GroupedBar extends Bar {
    type: string;
    renderType: RenderTypes;
    groupScale: ScaleBand<any>;
    padding: number;
    init(): void;
    render(animate: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    destroy(): void;
    protected getDataCorrespondingToLabel(label: string): any;
    protected getGroupWidth(): number;
    protected getTotalGroupPadding(): number;
    protected getBarWidth(): any;
    protected setGroupScale(): void;
}
