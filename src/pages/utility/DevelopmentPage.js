import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
const Message = styled.p`
  font-size: 20px;
  margin-bottom: 0px;
`;

const DevelopmentPage = () => {
  return (
    <Wrapper>
      <Message>Chức năng này đang được phát triển.</Message>
    </Wrapper>
  )
};

export default DevelopmentPage;
