import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { PROJECT_NAME } from 'utils/contants';

const Footer = () => (
  <>
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col md={6}>
            {new Date().getFullYear()}
            {' '}
            ©
            {PROJECT_NAME}
            .
          </Col>
        </Row>
      </Container>
    </footer>
  </>
  );

export default Footer;
