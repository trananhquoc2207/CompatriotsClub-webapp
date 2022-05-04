import React, { useState } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

const Wrapper = styled.div`
  & .header {
    &__title {
      font-weight: 700;
      font-size: 16px;
      vertical-align: middle;
      &-active {
        margin-bottom: 10px;
      }
      &-active:after {
        transform: rotate(90deg);
      }
      & .icon {
        margin-right: 10px;
      }
      &:after {
        content: "\\ed35";
        font-family: 'boxicons' !important;
        display: block;
        float: right;
        transition: transform .2s;
        font-size: 1rem;
      } 
    }
  }
  & .body {
    &-disable {
      display: none;
    }
  }
`;

const Accordion = (props) => {
  const {
    active,
    icon,
    title,
    children
  } = props;

  const [isActive, setIsActive] = useState(active || false)

  return (
    <Wrapper>
      <div className="wrapper">
        <div className="header" onClick={() => setIsActive(!isActive)}>
          <div className={classnames('header__title', { 'header__title-active': isActive })}>{icon && <i className={`icon bx bx-${icon}`}></i>}{title}</div>
        </div>
        <div className={classnames('body', { 'body-disable': !isActive })}>
          {children}
        </div>
      </div>
    </Wrapper>
  );
};

export default Accordion;