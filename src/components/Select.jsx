import React from 'react';
import Select from 'react-select';

const StyledSelect = (props) => (
  <Select
    styles={{
      control: (styles, { selectProps: { menuIsOpen }}) => ({
        ...styles,
        boxShadow: 'none',
        border: menuIsOpen ? '1px solid #96c8da' : '1px solid hsl(0,0%,80%)',
        borderBottom: menuIsOpen ? 0 : '1px solid hsl(0,0%,80%)',
        borderBottomLeftRadius: menuIsOpen ? 0 : '4px',
        borderBottomRightRadius: menuIsOpen ? 0 : '4px',
        ':hover': {
          border: '1px solid #96c8da',
          borderBottom: menuIsOpen ? 0 : '1px solid #96c8da',
        },
      }),
      menu: (styles) => ({
        ...styles,
        marginTop: 0,
        boxShadow: 'none',
        border: '1px solid #96c8da',
        borderTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }),
      menuList: (styles) => ({
          ...styles,
          padding: 0,
      }),
      option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        background: isFocused || isSelected ? 'rgba(0,0,0,.03)' : '#ffffff',
        color: isSelected ? 'rgba(0,0,0,.95)' : '#000000',
        fontSize: '15px',
      }),
      input: (styles) => ({
        ...styles,
        fontSize: '15px',
      }),
      singleValue: (styles) => ({
        ...styles,
        fontSize: '15px',
      })
    }}
    {...props}
  />
);

export default StyledSelect;
