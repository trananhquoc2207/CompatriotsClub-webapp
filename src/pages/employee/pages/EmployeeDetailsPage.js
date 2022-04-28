import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import InformationGeneral from 'pages/employee/components/details/InformationGeneral';
import Collapse from 'pages/employee/components/details/Collapse';
import ContractDetails from 'pages/employee/components/details/ContractDetails';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from 'pages/employee/actions/employee';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { contractDetailsSelected } = useSelector((state) => state.employee);

  const handleRefresh = () => {
    dispatch(getEmployeeDetails(id));
  };
  useEffect(() => {
    if (id) {
      handleRefresh();
    }
  }, [id]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs="3">
              <InformationGeneral onRefresh={() => handleRefresh()} />
            </Col>
            <Col xs="9">
              {contractDetailsSelected && <ContractDetails />}
              {!contractDetailsSelected && <Collapse />}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EmployeeDetailsPage;
