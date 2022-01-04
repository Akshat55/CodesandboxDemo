import { Component } from '../component';
import { RenderTypes, ToolbarControlTypes } from '../../interfaces';
export declare class Toolbar extends Component {
    static buttonID: number;
    type: string;
    renderType: RenderTypes;
    overflowButton: any;
    overflowMenu: any;
    init(): void;
    render(animate?: boolean): void;
    renderOverflowMenu(): void;
    isOverflowMenuOpen(): any;
    updateOverflowMenu(show: boolean): void;
    focusOnPreviousEnabledToolbarItem(currentItemIndex: any): void;
    focusOnNextEnabledToolbarItem(currentItemIndex: any): void;
    focusOnPreviousEnabledMenuItem(currentItemIndex: any): void;
    focusOnNextEnabledMenuItem(currentItemIndex: any): void;
    toggleOverflowMenu(event: any): void;
    triggerFunctionAndEvent(control: any, event: any, element?: any): void;
    getControlConfigs(): {
        buttonList: any[];
        overflowMenuItemList?: undefined;
    } | {
        buttonList: any[];
        overflowMenuItemList: any[];
    };
    getToolbarButtonItems(): any[];
    getOverflowMenuItems(): any[];
    getOverflowButtonConfig(): {
        id: string;
        title: string;
        shouldBeDisabled: () => boolean;
        iconSVG: {
            content: string;
        };
        clickFunction: (event: any) => void;
    };
    getControlConfigByType(controlType: ToolbarControlTypes): any;
    getControlIconByType(controlType: ToolbarControlTypes): "<polygon points=\"19 13 15 13 15 9 13 9 13 13 9 13 9 15 13 15 13 19 15 19 15 15 19 15 19 13\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>" | "<rect x=\"9\" y=\"13\" width=\"10\" height=\"2\"/>\n\t\t\t\t\t\t<path d=\"M22.45,21A10.87,10.87,0,0,0,25,14,11,11,0,1,0,14,25a10.87,10.87,0,0,0,7-2.55L28.59,30,30,28.59ZM14,23a9,9,0,1,1,9-9A9,9,0,0,1,14,23Z\"/>" | "<path d=\"M22.4478,21A10.855,10.855,0,0,0,25,14,10.99,10.99,0,0,0,6,6.4658V2H4v8h8V8H7.332a8.9768,8.9768,0,1,1-2.1,8H3.1912A11.0118,11.0118,0,0,0,14,25a10.855,10.855,0,0,0,7-2.5522L28.5859,30,30,28.5859Z\"/>" | "<polygon points=\"21 2 21 4 26.59 4 17 13.58 18.41 15 28 5.41 28 11 30 11 30 2 21 2\"/><polygon points=\"15 18.42 13.59 17 4 26.59 4 21 2 21 2 30 11 30 11 28 5.41 28 15 18.42\"/>" | "<rect x=\"4\" y=\"6\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"12\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"18\" width=\"18\" height=\"2\"/><rect x=\"4\" y=\"24\" width=\"18\" height=\"2\"/><rect x=\"26\" y=\"6\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"12\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"18\" width=\"2\" height=\"2\"/><rect x=\"26\" y=\"24\" width=\"2\" height=\"2\"/>";
}
