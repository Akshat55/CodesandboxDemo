import { Component } from '../component';
import { ChartModelCartesian } from '../../model/cartesian-charts';
import { RenderTypes } from '../../interfaces';
export declare class ZoomBar extends Component {
    type: string;
    renderType: RenderTypes;
    MIN_SELECTION_DIFF: number;
    brushSelector: string;
    maxSelectionRange: [0, 0];
    clipId: string;
    brush: import("d3-brush").BrushBehavior<unknown>;
    xScale: any;
    yScale: any;
    highlightStrokeWidth: number;
    protected model: ChartModelCartesian;
    init(): void;
    render(animate?: boolean): void;
    addBrushEventListener(zoomDomain: any, axesLeftMargin: any, width: any): void;
    handleBrushedEvent(event: any, zoomDomain: any, scale: any, selection: any): void;
    updateBrushHandle(svg: any, selection: any, domain: any): void;
    updateSliderSelectedArea(selection: any): void;
    renderZoomBarArea(container: any, querySelector: any, data: any, clipId: any): void;
    updateClipPath(svg: any, clipId: any, x: any, y: any, width: any, height: any): void;
    compensateDataForDefaultDomain(data: any, defaultDomain: any): any;
    renderZoomBarBaseline(container: any, startX: any, endX: any, skeletonClass?: boolean): void;
    renderSkeleton(container: any, startX: any, endX: any): void;
    destroy(): void;
}
