import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';

import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Form,
  FormFeedback,
  Label,
  Input,
  Button,
  Container
} from 'reactstrap';
import PasswordInput from 'components/PasswordInput';
import accountApi from 'api/accountApi';
import { PROJECT_NAME, TOKEN } from 'utils/contants';
import logo from 'assets/images/logo.png';

const Login = (props) => {
  console.log(props)
  const { register, errors, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [remember, setRemember] = useState(false);

  const handleValidSubmit = async (payload) => {
    setLoading(true); setMessage(null);
    try {
      const response = await accountApi.login({ username: payload.username, password: payload.password })

      localStorage.setItem(TOKEN, JSON.stringify(response));
      window.location.replace(window.location.origin + '/');
    } catch (_err) {
      setLoading(false); setMessage(_err);
    }
  }

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-visible">
                <CardBody className="pt-0">
                  <Link to="/">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle" style={{ backgroundColor: '#E7E7E7' }}>
                        <img src={logo} alt="" className="rounded-circle" height="100" />
                      </span>
                    </div>

                  </Link>
                  <div className="p-2 pt-3">
                    {
                      (message !== null)
                        ?
                        <Alert color="danger">{message}</Alert>
                        :
                        null
                    }
                    <Form className="form-horizontal" onSubmit={handleSubmit(handleValidSubmit)}>
                      <Row className="mb-1">
                        <Col>
                          <span>{props.t('Username')}</span>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col>
                          <Input
                            name="username"
                            className={errors.username ? 'form-control is-invalid' : 'form-control'}
                            placeholder={props.t('Enter username')}
                            innerRef={
                              register({
                                required: props.t('Username not entered')
                              })
                            } />
                          <ErrorMessage name="username" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                        </Col>
                      </Row>

                      <Row className="mb-1">
                        <Col>
                          <span>{props.t('Password')}</span>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col>
                          <PasswordInput
                            tag={Input}
                            name="password"
                            className={errors.password ? 'form-control is-invalid' : 'form-control'}
                            placeholder={props.t('Enter password')}
                            innerRef={
                              register({
                                required: props.t('Password not entered')
                              })
                            } />
                          <ErrorMessage name="password" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                        </Col>
                      </Row>

                      <Row className="mb-3" style={{ marginLeft: '1px', marginRight: '1px' }}>
                        <Col className="custom-control custom-checkbox">
                          <Input type="checkbox" className="custom-control-input" id="customControlInline" defaultChecked={remember} />
                          <Label className="custom-control-label" htmlFor="customControlInline">{props.t('Stay logged in')}</Label>                                                </Col>
                      </Row>

                      <Row className="mb-4">
                        <Col>
                          <Button type="submit" className={classNames('w-100', { 'disabled': loading })} color="primary">
                            {
                              loading
                                ?
                                <i className="bx bx-loader-alt bx-spin bx-rotate-90 font-size-16 align-middle"></i>
                                :
                                props.t('Sign in')
                            }
                          </Button>
                        </Col>
                      </Row>

                      <Row>
                        <Col className="text-center">
                          <Link to="/forget-password" className="text-muted">
                            <i className="bx bx-key font-size-12 mr-1"></i> {props.t('Forget Password ?')}
                          </Link>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>{new Date().getFullYear()} © {PROJECT_NAME}.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default withNamespaces()(Login);

