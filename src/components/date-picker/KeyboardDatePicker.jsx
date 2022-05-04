import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'reactstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/vi';
import moment from 'moment';

const locale = 'vi';
const dateFormat = 'DD-MM-YYYY';
const serverDateFormat = 'YYYY-MM-DD';

const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const KeyboardDatePicker = ({
  // popupOnTop,
  value,
  onChange,
  onError,
  readOnly,
  disabledDays,
  placeholder,
}) => {
  const [date, setDate] = useState(null);
  const [input, setInput] = useState(null);
  useEffect(() => {
    if (value && !moment(date).isSame(value)) {
      setDate(new Date(value));
    }
    // eslint-disable-next-line
  }, [value]);
  useEffect(() => {
    if (date) {
      onChange(moment(date).format(serverDateFormat));
    }
    // eslint-disable-next-line
  }, [date]);

  const handleKeyUp = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setDate(null);
    }
    const d = inputValue.replace(/\D/g, '').slice(0, 10);
    if (d.length >= 5) {
      const stringResult = `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
      setInput(stringResult);
    } else if (d.length >= 3) {
      setInput(`${d.slice(0, 2)}-${d.slice(2)}`);
    } else {
      setInput(d);
    }
  };

  return (
    <DayPickerInput
      // classNames={{
      //   overlay: popupOnTop
      //     ? 'DayPickerInput-Overlay overlay-top'
      //     : 'DayPickerInput-Overlay',
      // }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      component={React.forwardRef((props, ref) => <Input {...props} innerRef={ref} />)}
      value={input || date}
      format={dateFormat}
      parseDate={parseDate}
      formatDate={formatDate}
      placeholder={placeholder || dateFormat}
      onDayChange={(d) => {
        if (d === undefined) {
          onError('InvalidDate');
        } else {
          setDate(d || null);
        }
      }}
      inputProps={{
        readOnly,
        maxLength: 10,
        onKeyUp: handleKeyUp,
      }}
      dayPickerProps={{
        months,
        locale,
        localeUtils: MomentLocaleUtils,
        className: readOnly ? 'd-none' : '',
        modifiers: {
          disabled: disabledDays,
        },
      }}
    />
  );
};

KeyboardDatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(Date)]),
  onChange: PropTypes.func,
  onError: PropTypes.func,
  // popupOnTop: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabledDays: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func,
  ]),
  placeholder: PropTypes.string,
};

KeyboardDatePicker.defaultProps = {
  value: null,
  placeholder: '',
  onChange: () => {},
  onError: () => {},
  // popupOnTop: false,
  readOnly: false,
  disabledDays: [],
};

export default KeyboardDatePicker;
