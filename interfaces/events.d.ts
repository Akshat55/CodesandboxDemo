/**
 * enum of all events related to the chart on the DOM
 */
export declare enum Chart {
    RENDER_FINISHED = "render-finished",
    RESIZE = "chart-resize",
    MOUSEOVER = "chart-mouseover",
    MOUSEOUT = "chart-mouseout"
}
/**
 * enum of all events related to the overlay modal
 */
export declare enum Modal {
    SHOW = "show-modal",
    HIDE = "hide-modal"
}
/**
 * enum of all events related to the chart model
 */
export declare enum Model {
    UPDATE = "model-update"
}
/**
 * enum of all toolbar events
 */
export declare enum Toolbar {
    SHOW_OVERFLOW_MENU = "show-toolbar-overflow-menu",
    HIDE_OVERFLOW_MENU = "hide-toolbar-overflow-menu",
    BUTTON_CLICK = "toolbar-button-click"
}
/**
 * enum of all events related to the zoom-bar
 */
export declare enum ZoomBar {
    UPDATE = "zoom-bar-update",
    SELECTION_START = "zoom-bar-selection-start",
    SELECTION_IN_PROGRESS = "zoom-bar-selection-in-progress",
    SELECTION_END = "zoom-bar-selection-end"
}
/**
 * enum of all events related to the zoom domain
 */
export declare enum ZoomDomain {
    CHANGE = "zoom-domain-change"
}
/** enum of all events related to canvas zoom *
 *
 */
export declare enum CanvasZoom {
    CANVAS_ZOOM_IN = "canvas-zoom-in",
    CANVAS_ZOOM_OUT = "canvas-zoom-out"
}
/**
 * enum of all axis-related events
 */
export declare enum Axis {
    LABEL_MOUSEOVER = "axis-label-mouseover",
    LABEL_MOUSEMOVE = "axis-label-mousemove",
    LABEL_CLICK = "axis-label-click",
    LABEL_MOUSEOUT = "axis-label-mouseout",
    LABEL_FOCUS = "axis-label-focus",
    LABEL_BLUR = "axis-label-blur",
    RENDER_COMPLETE = "axis-render-complete"
}
/**
 * enum of all area graph events
 */
export declare enum Area {
    POINT_MOUSEOVER = "scatter-mouseover",
    POINT_MOUSEMOVE = "scatter-mousemove",
    POINT_CLICK = "scatter-click",
    POINT_MOUSEOUT = "scatter-mouseout"
}
/**
 * enum of all wordcloud graph events
 */
export declare enum WordCloud {
    WORD_MOUSEOVER = "wordcloud-word-mouseover",
    WORD_MOUSEMOVE = "wordcloud-word-mousemove",
    WORD_CLICK = "wordcloud-word-click",
    WORD_MOUSEOUT = "wordcloud-word-mouseout"
}
/**
 * enum of all pie graph events
 */
export declare enum Pie {
    SLICE_MOUSEOVER = "pie-slice-mouseover",
    SLICE_MOUSEMOVE = "pie-slice-mousemove",
    SLICE_CLICK = "pie-slice-click",
    SLICE_MOUSEOUT = "pie-slice-mouseout"
}
/**
 * enum of all gauge graph events
 */
export declare enum Gauge {
    ARC_MOUSEOVER = "gauge-arc-mouseover",
    ARC_MOUSEMOVE = "gauge-arc-mousemove",
    ARC_CLICK = "gauge-arc-click",
    ARC_MOUSEOUT = "gauge-arc-mouseout"
}
/**
 * enum of all bar graph events
 */
export declare enum Bar {
    BAR_MOUSEOVER = "bar-mouseover",
    BAR_MOUSEMOVE = "bar-mousemove",
    BAR_CLICK = "bar-click",
    BAR_MOUSEOUT = "bar-mouseout"
}
/**
 * enum of all boxplot graph events
 */
export declare enum Boxplot {
    BOX_MOUSEOVER = "box-mouseover",
    BOX_MOUSEMOVE = "box-mousemove",
    BOX_CLICK = "box-click",
    BOX_MOUSEOUT = "box-mouseout",
    OUTLIER_MOUSEOVER = "outlier-mouseover",
    OUTLIER_MOUSEMOVE = "outlier-mousemove",
    OUTLIER_CLICK = "outlier-click",
    OUTLIER_MOUSEOUT = "outlier-mouseout"
}
/**
 * enum of all scatter graph events
 */
export declare enum Scatter {
    SCATTER_MOUSEOVER = "scatter-mouseover",
    SCATTER_MOUSEMOVE = "scatter-mousemove",
    SCATTER_CLICK = "scatter-click",
    SCATTER_MOUSEOUT = "scatter-mouseout"
}
/**
 * enum of all line graph events
 */
export declare enum Line {
    POINT_MOUSEOVER = "scatter-mouseover",
    POINT_MOUSEMOVE = "scatter-mousemove",
    POINT_CLICK = "scatter-click",
    POINT_MOUSEOUT = "scatter-mouseout"
}
/**
 * enum of all radar graph events
 */
export declare enum Radar {
    X_AXIS_MOUSEOVER = "radar-x-axis-mouseover",
    X_AXIS_MOUSEMOVE = "radar-x-axis-mousemove",
    X_AXIS_CLICK = "radar-x-axis-click",
    X_AXIS_MOUSEOUT = "radar-x-axis-mouseout"
}
/**
 * enum of all tree graph events
 */
export declare enum Tree {
    NODE_MOUSEOVER = "tree-node-mouseover",
    NODE_CLICK = "tree-node-click",
    NODE_MOUSEOUT = "tree-node-mouseout"
}
/**
 * enum of all treemap graph events
 */
export declare enum Treemap {
    LEAF_MOUSEOVER = "leaf-mouseover",
    LEAF_MOUSEMOVE = "leaf-mousemove",
    LEAF_CLICK = "leaf-click",
    LEAF_MOUSEOUT = "leaf-mouseout"
}
/**
 * enum of all tooltip events
 */
export declare enum Tooltip {
    SHOW = "show-tooltip",
    MOVE = "move-tooltip",
    HIDE = "hide-tooltip"
}
/**
 * enum of all threshold events
 */
export declare enum Threshold {
    SHOW = "show-threshold",
    HIDE = "hide-threshold"
}
/**
 * enum of all legend related events
 */
export declare enum Legend {
    ITEM_HOVER = "legend-item-onhover",
    ITEM_CLICK = "legend-item-onclick",
    ITEM_MOUSEOUT = "legend-item-onmouseout",
    ITEMS_UPDATE = "legend-items-update"
}
/**
 * enum of all circlepack related events
 */
export declare enum CirclePack {
    CIRCLE_MOUSEOVER = "circle-leaf-mouseover",
    CIRCLE_CLICK = "circle-leaf-click",
    CIRCLE_MOUSEOUT = "circle-leaf-mouseout",
    CIRCLE_MOUSEMOVE = "circle-leaf-mousemove"
}
/**
 * enum of all alluvial related events
 */
export declare enum Alluvial {
    NODE_MOUSEOVER = "alluvial-node-mouseover",
    NODE_CLICK = "alluvial-node-click",
    NODE_MOUSEOUT = "alluvial-node-mouseout",
    NODE_MOUSEMOVE = "alluvial-node-mousemove",
    LINE_MOUSEOVER = "alluvial-line-mouseover",
    LINE_CLICK = "alluvial-line-click",
    LINE_MOUSEOUT = "alluvial-line-mouseout",
    LINE_MOUSEMOVE = "alluvial-line-mousemove"
}
/**
 * enum of all meter related events
 */
export declare enum Meter {
    METER_MOUSEOVER = "meter-mouseover",
    METER_CLICK = "meter-click",
    METER_MOUSEOUT = "meter-mouseout",
    METER_MOUSEMOVE = "meter-mousemove"
}
/**
 * enum of all heatmap related events
 */
export declare enum Heatmap {
    HEATMAP_MOUSEOVER = "heatmap-mouseover",
    HEATMAP_CLICK = "heatmap-click",
    HEATMAP_MOUSEOUT = "heatmap-mouseout",
    HEATMAP_MOUSEMOVE = "hetmap-mousemove"
}
