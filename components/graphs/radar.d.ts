import { Component } from '../component';
import { RenderTypes } from '../../interfaces';
export declare class Radar extends Component {
    type: string;
    renderType: RenderTypes;
    svg: SVGElement;
    groupMapsTo: string;
    uniqueKeys: string[];
    uniqueGroups: string[];
    fullDataNormalized: any;
    groupedDataNormalized: any;
    init(): void;
    render(animate?: boolean): void;
    getAlignmentXOffset(alignment: any, svg: any, parent: any): number;
    getLabelDimensions: (label: string) => {
        width: any;
        height: any;
    };
    normalizeFlatData: (dataset: any) => any;
    normalizeGroupedData: (dataset: any) => any;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    destroy(): void;
    addEventListeners(): void;
}
