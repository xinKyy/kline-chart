import React, { ReactNode } from 'react';
import { Color, HSV } from './interface';
interface PanelProps {
    color: Color;
    alpha: number;
    disabledAlpha: boolean;
    colorString: string;
    showHistory?: boolean;
    historyColors?: string[];
    showPreset?: boolean;
    presetColors?: string[];
    renderHistory?: () => ReactNode;
    renderPreset?: () => ReactNode;
    renderPickSection?: () => ReactNode;
    onHsvChange: (value: HSV) => void;
    onAlphaChange: (value: number) => void;
}
export declare const Panel: React.FC<PanelProps>;
export {};
