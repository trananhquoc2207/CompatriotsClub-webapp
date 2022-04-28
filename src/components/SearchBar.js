import React, { useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import search from 'assets/images/search.png';

const Wrapper = styled.div`
  padding: 0 0 12px 0;
  & i {
    font-size: 16px;
  }
  & .search {
    padding-right: calc(1.5em + 0.75rem);
    background-image: url(${search});
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }
  & .attach {
    & .input-group-text {
      border-bottom-left-radius: 0;
    }
    & .form-control {
      border-bottom-right-radius: 0 !important;
    }
  }
  & .segment {
    display: none;
    padding: 10px;
    background-color: #ffffff;
    border: 1px solid #ced4da;
    border-top: 0;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    &__active {
      display: block;
    }
  }
`;

const SearchBar = (props) => {
  const {
    children,
    text,
    onChange: onChangeProps,
  } = props;

  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);

  const handleChange = (value) => {
    setSearchValue(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        onChangeProps(value.toLowerCase());
      }, 300),
    );
  };

  return (
    <Wrapper>
      <InputGroup className={classnames({ attach: Boolean(children) })}>
        {children && (
          <InputGroupAddon addonType="prepend" onClick={() => setExpand(!expand)}>
            <InputGroupText>
              <i className="bx bx-filter-alt" />
            </InputGroupText>
          </InputGroupAddon>
        )}
        <Input
          className="search"
          value={searchValue}
          placeholder={text}
          onChange={({ target: { value } }) => handleChange(value)}
        />
      </InputGroup>
      {children && (
        <div className={classnames('segment', { segment__active: expand })}>
          {children}
        </div>
      )}
    </Wrapper>
  );
};

export default SearchBar;
