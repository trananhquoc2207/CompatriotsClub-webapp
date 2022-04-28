import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import Tooltip from 'components/CustomToolTip';

const StyledButton = styled(Button)`
  padding: 0.35em 0.65em;
 
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
    style,
  } = props;
  return (
    <>
      <StyledButton
        style={{ display: 'none !important' }}
        outline
        id={`table_${name}`}
        color={color}
        onClick={() => {
          if (typeof action === 'function') {
            action();
          }
        }}
      >
        <i className={`bx bx-${icon} mr-1`}></i>
        {text}
      </StyledButton>
      <Tooltip id={`table_${name}`} message={label} />
    </>
  )
};

export default Action;