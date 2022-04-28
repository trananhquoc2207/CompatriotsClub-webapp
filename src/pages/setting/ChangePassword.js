import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col,  
  Card, 
  CardBody,
  Button,
  Label,
  FormGroup
} from 'reactstrap';

// Validation form
import { AvForm, AvField } from 'availity-reactstrap-validation';

// CSS
import 'react-datepicker/dist/react-datepicker.css';

// Compponent
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Notification from '../../components/Notification';

//i18n
import { withNamespaces } from 'react-i18next';

// Api
import accountApi from '../../api/accountApi';

const ChangePassword = (props) => {

  // Notification
  const [ notification, setNotification ] = useState([]);


  const changePassword = value => {
    const doChangePassword = async (value) => {
      const params = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword
      }

      await accountApi.changePassword(params)
                .then(response => {
                  setNotification([ ...notification, {
                    id: Math.floor((Math.random() * 100) + 1),
                    type: 'success',
                    title: props.t('Success'),
                    description: response,
                    autoDelete: false
                  }]);
                })
                .catch(err => {
                  setNotification([ ...notification, {
                    id: Math.floor((Math.random() * 100) + 1),
                    type: 'danger',
                    title: props.t('Failed'),
                    description: err,
                    autoDelete: false
                  }]);
                });
    }

    doChangePassword(value);
  }

  return (
    <React.Fragment>
        <div className="page-content">
          <Notification notificationList={ notification } autoDelete autoDeleteTime={ 5000 } />
          <Container fluid>
            <Breadcrumbs title={ props.t('Setting') } breadcrumbItem={ props.t('Change Password') } />
            <Row>
              <Col xs={12}>
                <Card>
                  <CardBody className="d-flex justify-content-center">
                    <AvForm onValidSubmit={(event, value) => { changePassword(value) }} style={{ width: '500px', marginTop: '20px' }}>
                    <Row>
                      <Col xs={12}>
                        <FormGroup row>
                          <Label htmlFor="oldPassword" className="text-center" xs={4}>{ props.t('Old Password') }</Label>
                          <Col md={8}>
                            <AvField 
                              className="form-control"
                              type="password"
                              name="oldPassword"
                              id="oldPassword"
                              placeholder={ props.t('Enter old password')}
                              validate={{
                                required: { value: true, errorMessage: props.t('Password can not be empty') }, 
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12}>
                        <FormGroup row>
                          <Label htmlFor="newPassword" className="text-center" xs={4}>{ props.t('New Password') }</Label>
                          <Col md={8}>
                            <AvField 
                              className="form-control"
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              placeholder={ props.t('Enter new password')}
                              validate={{
                                required: { value: true, errorMessage: props.t('Password can not be empty') }, 
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12}>
                        <FormGroup row>
                          <Label htmlFor="reTypePassword" className="text-center" xs={4}>{ props.t('Re-type new password') }</Label>
                          <Col md={8}>
                            <AvField 
                              className="form-control"
                              type="password"
                              name="reTypePassword"
                              id="reTypePassword"
                              placeholder={ props.t('Re-type new password')}
                              validate={{
                                required: { value: true, errorMessage: props.t('Password can not be empty') },
                                match: { value: 'newPassword', errorMessage: props.t('Password does not match')}
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12} className="d-flex justify-content-center">
                        <Button className="btn btn-success waves-effect waves-light mr-3 " color="success" size="md" type="submit">
                          { props.t('Change password') }
                        </Button>
                      </Col>
                    </Row>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row> 
          </Container>
      </div>
    </React.Fragment>
   );
}
        
export default withNamespaces()(ChangePassword);