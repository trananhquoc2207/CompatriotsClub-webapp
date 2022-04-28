import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, BreadcrumbItem } from 'reactstrap';

const Breadcrumb = (props) => (
  <Row>
    <Col xs="12">
      <div className="page-title-box d-flex align-items-center justify-content-between">
        {/*   <h4 className="mb-0 font-size-17">{props.breadcrumbItem}</h4> */}
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <BreadcrumbItem className='font-size-16'>
              <Link to={location => ({ ...location, pathname: `/${props.link}` })}>{props.title}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem className='font-size-15' active>
              <Link tp="#" style={{ color: 'blue' }}>{props.breadcrumbItem}</Link>
            </BreadcrumbItem>
          </ol>
        </div>
      </div>
    </Col>
  </Row>
);

export default Breadcrumb;
