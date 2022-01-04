export declare const addControls: (container: any, demoGroup: any, chart: any, configs?: {
    colorPairingOptions: any;
}) => void;
export declare const addRadioButtonEventListeners: (container: any, chart: any, configs: any) => void;
export declare const addOtherVersions: (container: any, demoGroup: any, demo: any, configs?: {
    currentVersion: string;
}) => void;
/**
 * Generates random data going backwards from now once a minute
 * @param {number} quantity number of data points to create
 * @param {number} min min range of integer value
 * @param {number} max max range of integer value
 * @returns {array} randomly generated array of objects with a date and value field
 */
export declare const generateRandomData: (quantity: any, min: any, max: any) => {
    group: string;
    value: number;
    date: Date;
}[];
/**
 * Adds a generate demo data form to the story
 */
export declare const generateHighScaleDemoDataForm: () => string;
export declare const addDemoDataFormListeners: (container: any, demo: any, chart: any) => void;
