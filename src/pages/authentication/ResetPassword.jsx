import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import queryString from 'query-string';

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
import { PROJECT_NAME, API_URL } from 'utils/contants';
import logo from 'assets/images/logo.png';

const ForgetPassword = (props) => {
    const { register, errors, watch, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ color: 'danger', data: null });

    const handleValidSubmit = async (payload) => {
        setLoading(false); setMessage({ color: 'danger', data: null });

        if (token === null) {
            setLoading(false); setMessage({ color: 'danger', data: props.t('Recovery password link is incorrect') });
            return;
        }

        await fetch(`${API_URL}/v1/TaiKhoan/ResetMatKhau`, {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify({ newPassword: payload.password })
        }).then(response => {
            if (response.status_code === 200) {
                setLoading(false); setMessage({ color: 'danger', data: props.t('Congratulations! Your password has been changed successfully. Please sign in again') });
                return;
            }

            throw response;
        }).catch(err => {
            setLoading(false); setMessage({ color: 'danger', data: props.t('Something went wrong, please contact our support team.') });
        });
    }

    useEffect(() => {
        const params = queryString.parse(props.location.search);
        if (!params.token) {
            setMessage({ color: 'danger', data: props.t('Recovery password link is incorrect') });
            return;
        }

        setToken(params.token);
    }, [props]);

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
                                            <span className="avatar-title" style={{ backgroundColor: '#E7E7E7' }}>
                                                <img src={logo} height="100" />
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="p-2">
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
                                                    <span>{props.t('Password')}</span>
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        className={errors.password ? 'form-control is-invalid' : 'form-control'}
                                                        placeholder={props.t('Enter password')}
                                                        innerRef={
                                                            register({
                                                                required: props.t('Password not entered')
                                                            })
                                                        } />
                                                    <ErrorMessage name="password" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                                </Col>
                                            </Row>

                                            <Row className="mb-1">
                                                <Col>
                                                    <span>{props.t('Re-type password')}</span>
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col>
                                                    <Input
                                                        type="password"
                                                        name="retypePassword"
                                                        className={errors.retypePassword ? 'form-control is-invalid' : 'form-control'}
                                                        placeholder={props.t('Enter re-type password')}
                                                        innerRef={
                                                            register({
                                                                required: props.t('Re-type password not entered'),
                                                                validate: payload => {
                                                                    if (!payload.localeCompare(watch('retypePassword')))
                                                                        return props.t('Time out is invalid');;

                                                                    return true;
                                                                }
                                                            })
                                                        } />
                                                    <ErrorMessage name="retypePassword" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
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
                                                                props.t('Reset password')
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
