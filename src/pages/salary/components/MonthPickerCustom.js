import React from 'react';
import moment from 'moment';

import {
    DatePicker,
    ConfigProvider
} from 'antd';

// CSS
import 'antd/dist/antd.css';

// Hook
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';

// Config
import vnLocale from 'antd/lib/locale-provider/vi_VN';

moment.updateLocale('vi', {
    monthsShort: 'T1_T2_T3_T4_T5_T6_T7_T8_T9_T10_T11_T12'.split('_')
});

const MonthPickerCustom = props => {
    const { time } = useQueryString();

    // Hook
    const pushQueryString = usePushQueryString();

    // Handle
    const onChange = time =>
        pushQueryString({ time: time !== null ? time.format('MM/YYYY') : moment().format('MM/YYYY') });

    return (
        <ConfigProvider locale={vnLocale}>
            <DatePicker
                style={{ maxWidth: '140px', borderRadius: '4px' }}
                picker="month"
                format="MM-YYYY"
                defaultValue={time ? moment(time.split('/').reverse().join('-')) : moment()}
                onChange={time => onChange(time)}
            />
        </ConfigProvider>
    )
}

export default MonthPickerCustom;