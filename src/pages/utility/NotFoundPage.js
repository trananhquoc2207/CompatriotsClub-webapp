import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from 'reactstrap';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
const ErrorCode = styled.p`
  font-size: 100px;
  margin-bottom: 0px;
`;
const Message = styled.p`
  font-size: 20px;
`;
const StyledButton = styled(Button)`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
`;

const NotFoundPage = () => {
  const history = useHistory();
  return (
    <Wrapper>
      <ErrorCode>
        404
      </ErrorCode>
      <Message>
        Page not found!
      </Message>
      <StyledButton onClick={() => { history.push('/') }}>Go back</StyledButton>
    </Wrapper>
  )
};

export default NotFoundPage;