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
    Input,
    Button,
    Container
} from 'reactstrap';
import accountApi from 'api/accountApi';
import { PROJECT_NAME } from 'utils/contants';
import logo from 'assets/images/logo.png';

const ForgetPassword = (props) => {
    const { register, errors, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ color: 'warning', data: props.t('Enter your user account\'s verified email address and we will send you a password reset link.') });

    const handleValidSubmit = async (payload) => {
        setLoading(true); setMessage({ color: 'danger', data: null });

        try {
            const url = window.location.origin + '/reset-password';
            const response = await accountApi.forgetPassword({ email: payload.email, username: payload.username, passwordResetUrl: url })

            setLoading(false); setMessage({ color: 'success', data: response.data });
        } catch (_err) {
            setLoading(false); setMessage({ color: 'danger', data: _err });
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
                                            (message.data !== null)
                                                ?
                                                <Alert color={message.color}>{message.data}</Alert>
                                                :
                                                null
                                        }
                                        <Form className="form-horizontal" onSubmit={handleSubmit(handleValidSubmit)}>
                                            <Row className="mb-1">
                                                <Col>
                                                    <span>{props.t('Email')}</span>
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col>
                                                    <Input
                                                        name="email"
                                                        className={errors.email ? 'form-control is-invalid' : 'form-control'}
                                                        placeholder={props.t('Enter email')}
                                                        innerRef={
                                                            register({
                                                                required: props.t('Email not entered'),
                                                                validate: payload => {
                                                                    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(payload))
                                                                        return props.t('Email is invalid');

                                                                    return true;
                                                                }
                                                            })
                                                        } />
                                                    <ErrorMessage name="email" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                                </Col>
                                            </Row>

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
                                                                required: props.t('Username not entered'),
                                                            })
                                                        } />
                                                    <ErrorMessage name="username" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                                </Col>
                                            </Row>

                                            <Row className="mb-4">
                                                <Col>
                                                    <Button type="submit" className={classNames('w-100', { 'disabled': loading })} color="primary">
                                                        {
                                                            loading
                                                                ?
                                                                <i className="bx bx-loader-alt bx-spin bx-rotate-90 font-size-16 align-middle"></i>
                                                                :
                                                                props.t('Send')
                                                        }
                                                    </Button>
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

export default withNamespaces()(ForgetPassword);
