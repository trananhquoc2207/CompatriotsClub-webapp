import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function NumericInput(props) {
  const { tag: Tag, name, defaultValue, ...otherProps } = props;
  const [value, setValue] = useState('');

  const numeric = number => {

    number += '';

    let x = number.split('.');
    let y = x[0];
    let z = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(y)) {
      // eslint-disable-next-line no-useless-concat
      y = y.replace(rgx, '$1' + ',' + '$2');
    }

    return y + z;
  }

  const handleChange = event => {
    let value = event.target.value.replace(/[^\d]/g, '');
    setValue(numeric(value));
  }

  useEffect(() => {
    if (defaultValue && defaultValue !== '')
      setValue(numeric(defaultValue));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag name={name} value={value} onChange={event => handleChange(event)} {...otherProps} />
  )
}

NumericInput.propTypes = {
  tag: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired
}

export default NumericInput;