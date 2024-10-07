interface ControlBlockParams {
    value: [number, number];
    onChange: (value: [number, number]) => void;
}
export declare const useControlBlock: ({ value, onChange }: ControlBlockParams) => {
    active: boolean;
    blockRef: import("react").MutableRefObject<HTMLDivElement>;
    handlerRef: import("react").MutableRefObject<HTMLDivElement>;
    onMouseDown: (ev: MouseEvent) => void;
};
export {};
