import { ReactElement } from 'react';
import { Dayjs } from 'dayjs';
import { PickerProps, CalendarValue, ModeType } from './interface';
import { TimePickerProps } from '../TimePicker/interface';
interface InnerPickerProps extends PickerProps {
    disabledDate?: (current: Dayjs) => boolean;
    picker?: ReactElement;
    format?: string;
    defaultValue?: CalendarValue | CalendarValue[];
    value?: CalendarValue | CalendarValue[];
    showTime?: boolean | TimePickerProps;
    onSelect?: (dateString: string, date: Dayjs) => void;
    onChange?: (dateString: string, date: Dayjs) => void;
    showNowBtn?: boolean;
    mode: ModeType;
}
declare const Picker: (baseProps: InnerPickerProps) => JSX.Element;
export default Picker;
