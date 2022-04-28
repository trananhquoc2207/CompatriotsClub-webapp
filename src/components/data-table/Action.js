/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import styled from 'styled-components';

import {
  Button, ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import Tooltip from 'components/CustomToolTip';

const StyledButton = styled(Button)`
  padding: 0.45em 0.75em;
  & i {
    position: absolute;
    top: 8px;
    font-size: 18px;
    font-weight: 700;
    vertical-align: middle;
    padding-bottom: 2px;
  }
  & span {
    margin-left: 24px;
  }
`;

const Action = (props) => {
  const {
    name,
    label,
    icon,
    color,
    action,
    note,
    style,
  } = props;

  return (
    <>
      <StyledButton
        style={style}
        outline
        id={`table_${name}`}
        color={color}
        onClick={() => {
          if (typeof action === 'function') {
            action();
          }
        }}
      >
        <i className={`bx bx-${icon}`} />
        <span>{label}</span>
      </StyledButton>
      <Tooltip id={`table_${name}`} message={note} />
    </>
  );
};

const StyledDropdownToggle = styled(DropdownToggle)`
  font-size: 0.8125rem;
  line-height: 1.5;
  padding: 0.45em 0.75em;
  & i {
    position: absolute;
    top: 5px;
    font-size: 18px;
    font-weight: 700;
    vertical-align: middle;
    padding-bottom: 2px;
  }
  & span {
    margin-left: 24px;
  }
`;
const StyledDropdownMenu = styled(DropdownMenu)`
  overflow-x: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
`;
const StyledDropdownItem = styled(DropdownItem)`
  font-size: 15px;
`;

const ActionDropdown = (props) => {
  const {
    icon,
    label,
    dropdownActions: actions,
  } = props;
  const [toggle, setToggle] = useState(false);
  return (
    <ButtonDropdown direction="left" isOpen={Boolean(toggle)} toggle={() => setToggle(!toggle)}>
      <StyledDropdownToggle caret outline color="success">
        <i className={`bx bx-${icon}`} />
        <span>{label}</span>
      </StyledDropdownToggle>
      <StyledDropdownMenu>
        {(actions || []).map((action) => (
          <StyledDropdownItem key={`action_${action.name}`} onClick={() => action?.onClick()}>
            {action.label}
          </StyledDropdownItem>
        ))}
      </StyledDropdownMenu>
    </ButtonDropdown>
  );
};

export { Action, ActionDropdown };
