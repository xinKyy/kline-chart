import React from 'react';
export interface ResizeProps {
    throttle?: boolean;
    onResize?: (entry: ResizeObserverEntry[]) => void;
    children?: React.ReactNode;
}
declare class ResizeObserverComponent extends React.Component<ResizeProps> {
    resizeObserver: any;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount: () => void;
    createResizeObserver: () => void;
    destroyResizeObserver: () => void;
    render(): React.ReactNode;
}
export default ResizeObserverComponent;
