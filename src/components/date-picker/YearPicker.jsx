import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

const Wrapper = styled.div`
    & button {
        background-color: inherit !important;
        color: black !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
`;

const YearPicker = (props) => {
  const {
    initial,
    format,
    range,
    value,
    onChange: onChangeProps
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(new Date());

  const onChange = (d) => {
    setSelectedValue(d);
    if (typeof onChangeProps === 'function') {
      if (range) {
        onChangeProps(format ? `${d.getFullYear()}-01-01` : d, format ? `${d.getFullYear()}-12-31` : d);
      } else {
        onChangeProps(format ? `${d.getFullYear()}-01-01` : d);
      }
    }
  }

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    if (initial) {
      if (typeof onChangeProps === 'function') {
        const d = new Date();
        if (range) {
          onChangeProps(format ? `${d.getFullYear()}-01-01` : d, format ? `${d.getFullYear()}-12-31` : d);
        } else {
          onChangeProps(format ? `${d.getFullYear()}-01-01` : d);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (value?.getMonth && typeof value.getMonth === 'function') {
      setSelectedValue(value);
    }
  }, [value]);

  return (
    <Wrapper>
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle caret>
          Năm {selectedValue.getFullYear()}
        </DropdownToggle>
        <DropdownMenu>
          {([-2, -1, 0, 1, 2]).map((o, i) => (
            <DropdownItem key={`option_${i}`} onClick={() => { onChange(new Date(selectedValue.getFullYear() + o, 0, 1)) }}>{`Năm ${new Date(selectedValue.getFullYear() + o, 0, 1).getFullYear()}`}</DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </Wrapper>
  );
};

YearPicker.defaultProps = {
  initial: false,
  format: false,
  range: false,
  value: new Date(),
  onChange: () => { },
};

YearPicker.propTypes = {
  initial: PropTypes.bool,
  format: PropTypes.bool,
  range: PropTypes.bool,
  value: PropTypes.shape(new Date()),
  onChange: PropTypes.func,
};


export default YearPicker;