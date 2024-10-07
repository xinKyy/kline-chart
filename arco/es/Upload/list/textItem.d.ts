import { UploadItem } from '../upload';
import { UploadListProps } from '../interface';
import { ConfigProviderProps } from '../../ConfigProvider';
declare const TextItem: (props: UploadListProps & {
    file: UploadItem;
    locale: ConfigProviderProps['locale'];
}) => JSX.Element;
export default TextItem;
