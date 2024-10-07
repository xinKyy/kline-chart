import React, { CSSProperties } from 'react';
import { Color } from './interface';
interface ControlBarProps {
    x: number;
    type?: 'hue' | 'alpha';
    colorString: string;
    color?: Color;
    onChange: (x: number) => void;
    style?: CSSProperties;
}
export declare const ControlBar: React.FC<ControlBarProps>;
export {};
