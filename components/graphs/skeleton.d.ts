import { Component } from '../component';
export declare class Skeleton extends Component {
    type: string;
    xScale: any;
    yScale: any;
    backdrop: any;
    render(): void;
    renderSkeleton(showShimmerEffect: boolean): void;
    renderGridSkeleton(showShimmerEffect: boolean): void;
    renderVertOrHorizSkeleton(showShimmerEffect: boolean): void;
    renderPieSkeleton(showShimmerEffect: boolean): void;
    renderDonutSkeleton(showShimmerEffect: boolean): void;
    setScales(): void;
    drawBackdrop(showShimmerEffect: boolean): void;
    drawXGrid(showShimmerEffect: boolean): void;
    drawYGrid(showShimmerEffect: boolean): void;
    drawRing(outerRadius: number, innerRadius: number, shimmer?: boolean): void;
    computeOuterRadius(): number;
    computeInnerRadius(): number;
    setShimmerEffect(gradientId: string): void;
    removeSkeleton(): void;
}
