import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import Tooltip from 'components/CustomToolTip';

const StyledButton = styled(Button)`
  padding: 0.35em 0.65em;
  align-items: center;
  display: flex !important;
  & i {
    font-size: 18px;
    font-weight: 700;
  }
`;

const Action = (props) => {
  const {
    name,
    label,
    icon,
    color,
    action,
    text,
  } = props;
  return (
    <>
      <StyledButton
        outline
        id={`table_${name}`}
        color={color}
        onClick={() => {
          if (typeof action === 'function') {
            action();
          }
        }}
      >
        <i className={`bx bx-${icon}`}></i>
        {text}
      </StyledButton>
      <Tooltip id={`table_${name}`} message={label} />
    </>
  )
};

export default Action;