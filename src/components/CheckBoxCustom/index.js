import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

function CheckBoxCustom (props) {
  const { value, handle, ...otherProps } = props;

  const checkBox = useRef();
  const [ state, setState ] = useState(0);

  const handleChange = event => {
    let nextState = (state + 1) % 3;
    setState(nextState); handle(event, nextState);
  }

  useEffect(() => {
    if (value !== undefined)
      setState(value);
  }, [value]);

  useEffect(() => {
    if (state === 2)
      checkBox.current.indeterminate = true;
    else
      checkBox.current.indeterminate = false;
  }, [state]);

  return (
    <Input type={ 'checkbox' } value={ state } checked={ state === 1 } innerRef={ checkBox } onChange={ handleChange } { ...otherProps } /> 
  )
}

CheckBoxCustom.propTypes = {
  handle: PropTypes.func.isRequired
}

export default CheckBoxCustom;