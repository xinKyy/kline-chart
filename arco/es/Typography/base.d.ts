import { PropsWithChildren } from 'react';
import { TypographyParagraphProps, TypographyTitleProps, TypographyTextProps } from './interface';
declare type BaseProps = PropsWithChildren<TypographyParagraphProps & TypographyTitleProps & TypographyTextProps> & {
    componentType: 'Title' | 'Paragraph' | 'Text';
};
declare function Base(props: BaseProps): JSX.Element;
export default Base;
