import { Service } from '../service';
import { Selection } from 'd3-selection';
interface getSVGElementSizeOptions {
    useAttrs?: boolean;
    useClientDimensions?: boolean;
    useBBox?: boolean;
    useBoundingRect?: boolean;
}
export declare class DOMUtils extends Service {
    private chartID;
    constructor(model: any, services: any);
    static getHTMLElementSize(element: HTMLElement): {
        width: number;
        height: number;
    };
    static getSVGElementSize(svgSelector: Selection<any, any, any, any>, options?: getSVGElementSizeOptions): any;
    static appendOrSelect(parent: any, query: any): any;
    protected mainContainer: HTMLElement;
    protected width: string;
    protected height: string;
    init(): void;
    getChartID(): string;
    generateElementIDString(originalID: any): string;
    addMainContainer(): void;
    update(): void;
    styleHolderElement(): void;
    getHolder(): any;
    exportToJPG(): void;
    exportToPNG(): void;
    toggleFullscreen(): void;
    handleFullscreenChange(): void;
    verifyCSSStylesBeingApplied(): void;
    setSVGMaxHeight(): void;
    getMainContainer(): HTMLElement;
    addHolderListeners(): void;
    addResizeListener(): void;
}
export {};
