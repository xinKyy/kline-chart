export declare const cssModuleHMR: () => {
    enforce: string;
    name: string;
    apply: string;
    transform(src: any, id: any): {
        code: string;
    } | undefined;
    handleHotUpdate(context: any): void;
};
