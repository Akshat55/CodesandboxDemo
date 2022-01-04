import { Service } from '../service';
export declare class Files extends Service {
    constructor(model: any, services: any);
    downloadCSV(content: any, filename: any): void;
    downloadImage(uri: any, name: any): void;
}
