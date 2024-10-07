import { HSV } from '../interface';
interface UseColorPickerProps {
    value?: string;
    defaultValue?: string;
    defaultPopupVisible?: boolean;
    disabledAlpha?: boolean;
    popupVisible?: boolean;
    format?: 'hex' | 'rgb';
    onChange?: (value: string) => void;
    onVisibleChange?: (visible: boolean) => void;
}
export declare const useColorPicker: (props: UseColorPickerProps) => {
    value: string;
    popupVisible: boolean;
    color: {
        hsv: HSV;
        rgb: {
            r: number;
            g: number;
            b: number;
        };
        hex: string;
    };
    alpha: number;
    colorString: string;
    onHsvChange: (_value: HSV) => void;
    onAlphaChange: (_value: number) => void;
    onVisibleChange: (newVisible: any) => void;
};
export {};
