import React, { useState } from 'react';
import { Row, Col, Card, Form, CardBody, CardTitle, CardSubtitle, Container } from "reactstrap";
import Dropzone from "react-dropzone";

// Breadcrumb

import { Link } from "react-router-dom";
import DiligenceFilter from '../component/DiligenceFilter';

const FormUpload = (props) => {

  const [modalDownload, setModalDownload] = useState([]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col className="col-12">
              <Card onClick={() => setModalDownload(true)} >
                <CardBody style={{ border: '2px dotted black', margin: '30px' }}>
                  <CardTitle className='text-center' style={{ fontSize: "25px", fontWeight: "700" }}>Bảng tính chế độ chuyên cần và nhà trọ</CardTitle>
                  <div className="dropzone">
                    <div
                      className="dz-message needsclick mt-2"
                    >
                      <div className="mb-3 text-center">
                        <i className="display-4 text-muted bx bxs-cloud-download "></i>
                      </div>
                      <h4 className='text-center'>Nhấp vào đây để tải file dữ liệu.</h4>
                    </div>
                  </div>
                  <div
                    className="dropzone-previews mt-3"
                    id="file-previews"
                  >
                  </div>

                  <div className="text-center mt-4">
                    <button type="button" className="btn btn-primary waves-effect waves-light">Tải xuống</button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <DiligenceFilter
        open={modalDownload}
        onClose={() => setModalDownload(false)}
      />
    </React.Fragment >
  );
}

export default FormUpload;
