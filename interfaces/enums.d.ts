import * as EventEnums from './events';
export declare const Events: typeof EventEnums;
export declare enum RenderTypes {
    HTML = "html",
    SVG = "svg"
}
/**
 * enum of all supported chart themes
 */
export declare enum ChartTheme {
    DEFAULT = "default",
    G100 = "g100",
    G90 = "g90",
    G10 = "g10"
}
/**
 * enum of all color classname types
 */
export declare enum ColorClassNameTypes {
    BACKGROUND = "background",
    FILL = "fill",
    STROKE = "stroke",
    TOOLTIP = "tooltip"
}
/**
 * enum of all possible axis positions
 */
export declare enum AxisPositions {
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom"
}
/**
 * enum of all possible axis positions
 */
export declare enum ZoomBarTypes {
    GRAPH_VIEW = "graph_view",
    SLIDER_VIEW = "slider_view"
}
/**
 * enum of all possible truncation types
 */
export declare enum TruncationTypes {
    END_LINE = "end_line",
    MID_LINE = "mid_line",
    FRONT_LINE = "front_line",
    NONE = "none"
}
/**
 * enum of all possible cartesian orientations
 * to be used for determining the orientation
 * of graphs being draw over
 * cartesian scales
 */
export declare enum CartesianOrientations {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}
/**
 * enum of all possible scale types
 */
export declare enum ScaleTypes {
    TIME = "time",
    LINEAR = "linear",
    LOG = "log",
    LABELS = "labels",
    LABELS_RATIO = "labels-ratio"
}
/**
 * enum of all possible legend positions
 */
export declare enum LegendPositions {
    RIGHT = "right",
    LEFT = "left",
    TOP = "top",
    BOTTOM = "bottom"
}
/**
 * enum of all possible alignments
 */
export declare enum Alignments {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}
/**
 * enum of all possible legend orientations
 */
export declare enum LegendOrientations {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}
/**
 * enum of tree types for the tree chart
 */
export declare enum TreeTypes {
    TREE = "tree",
    DENDROGRAM = "dendrogram"
}
/**
 * enum of all possible layout directions
 */
export declare enum LayoutDirection {
    ROW = "row",
    COLUMN = "column",
    ROW_REVERSE = "row-reverse",
    COLUMN_REVERSE = "column-reverse"
}
/**
 * enum of all possible layout growth values
 */
export declare enum LayoutGrowth {
    FIXED = "fixed",
    PREFERRED = "preferred",
    STRETCH = "stretch"
}
/**
 * enum of all possible layout align-items values
 */
export declare enum LayoutAlignItems {
    CENTER = "center"
}
/**
 * enum of all possible callout directions
 */
export declare enum CalloutDirections {
    LEFT = "left",
    RIGHT = "right"
}
/**
 * enum of all possible skeleton/empty state types
 */
export declare enum Skeletons {
    GRID = "grid",
    VERT_OR_HORIZ = "vertOrHoriz",
    PIE = "pie",
    DONUT = "donut"
}
/**
 * enum of all possible attributes used to aling text horizontally
 */
export declare enum TextAnchor {
    START = "start",
    MIDDLE = "middle",
    END = "end"
}
/**
 * enum of all possible attributes used to aling text vertically
 */
export declare enum DominantBaseline {
    BASELINE = "baseline",
    MIDDLE = "middle",
    HANGING = "hanging"
}
export declare enum GaugeTypes {
    SEMI = "semi",
    FULL = "full"
}
/**
 * enum of all possible callout directions
 */
export declare enum ArrowDirections {
    UP = "up",
    DOWN = "down"
}
/**
 * enum of carbon statuses
 */
export declare enum Statuses {
    SUCCESS = "success",
    WARNING = "warning",
    DANGER = "danger"
}
/**
 * enum of axis ticks rotation
 */
export declare enum TickRotations {
    ALWAYS = "always",
    AUTO = "auto",
    NEVER = "never"
}
/**
 * enum of chartTypes that work with combo chart
 */
export declare enum ChartTypes {
    SCATTER = "scatter",
    LINE = "line",
    SIMPLE_BAR = "simple-bar",
    STACKED_BAR = "stacked-bar",
    GROUPED_BAR = "grouped-bar",
    AREA = "area",
    STACKED_AREA = "stacked-area"
}
/**
 * enum of supported toolbar control types
 */
export declare enum ToolbarControlTypes {
    EXPORT_CSV = "Export as CSV",
    EXPORT_PNG = "Export as PNG",
    EXPORT_JPG = "Export as JPG",
    ZOOM_IN = "Zoom in",
    ZOOM_OUT = "Zoom out",
    RESET_ZOOM = "Reset zoom",
    MAKE_FULLSCREEN = "Make fullscreen",
    SHOW_AS_DATATABLE = "Show as data-table",
    CUSTOM = "Custom"
}
/**
 * enum of title orientations for _vertical axes_
 */
export declare enum AxisTitleOrientations {
    LEFT = "left",
    RIGHT = "right"
}
/**
 * enum of legend item type
 */
export declare enum LegendItemType {
    CHECKBOX = "checkbox",
    RADIUS = "radius",
    AREA = "area",
    SIZE = "size",
    LINE = "line",
    QUARTILE = "quartile",
    ZOOM = "zoom"
}
/**
 * enum of color legend types
 */
export declare enum ColorLegendType {
    LINEAR = "linear",
    QUANTIZE = "quantize"
}
/**
 * enum of divider status for heatmap
 */
export declare enum DividerStatus {
    ON = "on",
    AUTO = "auto",
    OFF = "off"
}
/**
 * enum of axis flavor
 */
export declare enum AxisFlavor {
    DEFAULT = "default",
    HOVERABLE = "hoverable"
}
