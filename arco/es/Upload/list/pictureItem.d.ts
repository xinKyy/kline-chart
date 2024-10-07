import { ConfigProviderProps } from '../../ConfigProvider';
import { UploadListProps } from '../interface';
import { UploadItem } from '../upload';
declare const PictureItem: (props: UploadListProps & {
    file: UploadItem;
    locale: ConfigProviderProps['locale'];
}) => JSX.Element;
export default PictureItem;
