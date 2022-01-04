import { Service } from '../service';
interface setupTransitionConfigs {
    transition?: any;
    name?: string;
    animate?: boolean;
}
export declare class Transitions extends Service {
    pendingTransitions: {};
    init(): void;
    setupTransition({ transition: t, name, animate }: setupTransitionConfigs): any;
    getPendingTransitions(): {};
}
export {};
