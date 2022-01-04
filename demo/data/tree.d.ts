export declare const treeData: {
    name: string;
    children: ({
        name: string;
        value: number;
        children?: undefined;
    } | {
        name: string;
        children: {
            name: string;
            value: number;
        }[];
        value?: undefined;
    })[];
}[];
export declare const treeOptions: {
    title: string;
    height: string;
    tree: {
        rootTitle: string;
    };
};
export declare const dendogramOptions: {
    title: string;
    height: string;
    tree: {
        type: string;
        rootTitle: string;
    };
};
