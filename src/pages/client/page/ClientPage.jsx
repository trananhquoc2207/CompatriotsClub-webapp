
import React, { useEffect } from 'react';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import HeaderClient from 'pages/client/components/HeaderClient'
import TitlePage from 'pages/client/components/TitlePage'
import SidebarClient from 'pages/client/components/SidebarClient'
import Activate from 'pages/client/components/Activate'
import styled from 'styled-components';
import 'assets/scss/custom/pages/_client.scss';

function ClientPage()
{
    return (
      <>
      <HeaderClient></HeaderClient>
      <div className="page-content">
      
        <Container fluid>
          <Row>
            <Col xs="8">
           <TitlePage></TitlePage>
           <Activate></Activate>
            </Col>
            <Col xs="4">
            <SidebarClient/>
            </Col>
          </Row>
        </Container>
      </div>
    
    </>
     ); 
}

export default ClientPage