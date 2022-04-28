/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
  & .background {
    background-color: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
    box-shadow: 1px 1px 3px -1px #cccccc;
  }
  & .accordion {
    padding: 10px;
    &__header {
      font-weight: 700;
      font-size: 14px !important;
      vertical-align: middle;
      & .icon {
        margin-right: 10px;
      }
      &-active {
        margin-bottom: 10px;
      }
      &-active:after {
        transform: rotate(90deg);
      }
      &:after {
        content: "\\ed35";
        font-family: 'boxicons' !important;
        display: block;
        float: ${(props) => props?.icon ? 'right' : 'left'};
        margin: ${(props) => props.icon ? '0' : '0 6px 0 0'};
        transition: transform .2s;
        font-size: 1rem;
      } 
    }
    &__body {
      display: none !important;
      &-active {
        display: block !important;
      }
    }
  }
`;
const subStringUtil = (string = '', displayLength) => {
  if (!string) {
    return null;
  }
  if (string.length <= displayLength) {
    return string;
  }
  return `${string.substr(0, displayLength / 2)}...${string.substr(
    string.length - displayLength / 2,
  )}`;
};
const Accordion = (props) => {
  const {
    expand,
    background,
    icon,
    title,
    children,
  } = props;
  const [isExpand, setIsExpand] = useState(expand || false);
  return (
    <Wrapper icon={icon}>
      <div className={classnames('accordion', { background })}>
        <div className={classnames('accordion__header', { 'accordion__header-active': isExpand })} onClick={() => setIsExpand(!isExpand)}>
          {icon && <i className={`icon bx bx-${icon}`} />}
          {subStringUtil(title, 25)}
        </div>
        <div className={classnames('accordion__body', { 'accordion__body-active': isExpand })}>
          {children}
        </div>
      </div>
    </Wrapper>
  );
};

export default Accordion;
