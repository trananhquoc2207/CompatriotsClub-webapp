import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Row, Col, Input } from 'reactstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/vi';
import moment from 'moment';

const locale = 'vi';
const dateFormat = 'DD-MM-YYYY';

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

const KeyboardDateTimePicker = (props) => {
  const {
    value,
    onChange,
    onError,
    readOnly,
    disabledDays,
    isHavingTime,
  } = props;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [input, setInput] = useState(null);
  useEffect(() => {
    if (value) {
      setDate(new Date(value));
      if (isHavingTime) {
        setTime(moment(value).format('HH:mm'));
      } else {
        setTime('');
      }
    } else {
      setDate(null);
      setInput(null);
      setTime('');
    }
    // eslint-disable-next-line
  }, [value]);
  useEffect(() => {
    if (date) {
      onChange(
        moment(
          `${moment(date).format('DD-MM-YYYY')} ${time}`,
          'DD-MM-YYYY HH:mm',
        ).format(),
        !time,
      );
    }
    // eslint-disable-next-line
  }, [date, time]);

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
    <Form>
      <Row>
        <Col>
          <DayPickerInput
            // classNames={{
            //   overlay: popupOnTop
            //     ? 'DayPickerInput-Overlay overlay-top'
            //     : 'DayPickerInput-Overlay',
            // }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            component={React.forwardRef((prop, ref) => <Input {...prop} innerRef={ref} />)}
            value={input || date}
            format={dateFormat}
            parseDate={parseDate}
            formatDate={formatDate}
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
        </Col>
        <Col>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Col>
      </Row>
    </Form>
  );
};

KeyboardDateTimePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(Date)]),
  onChange: PropTypes.func,
  onError: PropTypes.func,
  readOnly: PropTypes.bool,
  isHavingTime: PropTypes.bool,
  disabledDays: PropTypes.arrayOf(PropTypes.shape({})),
};

KeyboardDateTimePicker.defaultProps = {
  value: moment(),
  onChange: () => {},
  onError: () => {},
  readOnly: false,
  isHavingTime: false,
  disabledDays: [],
};

export default KeyboardDateTimePicker;
