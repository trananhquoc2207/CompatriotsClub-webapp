import React, { useState, useEffect } from 'react';
import {
    Spinner,
    Container,
    Row,
    Col,
    Button
} from 'reactstrap';

// Component
import toastr from 'toastr';
import { AvForm, AvInput } from 'availity-reactstrap-validation';

//i18n
import { withNamespaces } from 'react-i18next';

// API
import insuranceApi from 'api/insuranceApi';

const LoadingIndicator = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: window.innerHeight / 3
            }}
        >
            <Spinner color="primary" />
        </div>
    )
}

const SettingInsurance = (props) => {

    // Loading
    const [loading, setLoading] = useState(false);

    // Data
    const [data, setData] = useState({
        TiLeBHXH: {
            id: -1, name: 'TiLeBHXH', value: 0
        },
        TiLeBHYT: {
            id: -1, name: 'TiLeBHYT', value: 0
        },
        TileBHTN: {
            id: -1, name: 'TileBHTN', value: 0
        }
    });

    // Function
    const notify = (type, message) => {
        toastr.options = {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
            extendedTimeOut: 3000,
            closeButton: true,
            preventDuplicates: true
        }

        if (type === 'success')
            toastr.success(message, props.t('Success'));
        else if (type === 'info')
            toastr.info(message);
        else if (type === 'warning')
            toastr.warning(message);
        else if (type === 'danger')
            toastr.error(message, props.t('Failed'));
        else
            toastr.secondary(message);
    }

    const updateInsurance = async (value) => {
        let params = [];
        Object.keys(value).forEach(async (key) => {
            if (value[key] !== '' && !isNaN(parseFloat(value[key])))
                params.push({ id: data[key].id, tenCD: data[key].name, giaTri: parseFloat(value[key]) })
        })

        await insuranceApi
            .put(params)
            .then(response => { notify('success', props.t('Updated.')); fetchInsurance() })
            .catch(error => notify('danger', error));
    }

    const fetchInsurance = async () => {
        setLoading(true);

        try {
            const response = await insuranceApi.getAll();
            let dataFilter = {};
            response.data.forEach((item, idx) => {
                if ((item.tenCD === 'TiLeBHXH' || item.tenCD === 'TiLeBHYT' || item.tenCD === 'TileBHTN')) {
                    dataFilter[item.tenCD] = {
                        id: item.id,
                        name: item.tenCD,
                        value: item.giaTri
                    }
                }
            })

            setData(dataFilter); setLoading(false);
        } catch (error) {
            setLoading(false);
            notify('danger', error);
        }
    }

    useEffect(() => {
        fetchInsurance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {loading ? <LoadingIndicator /> :
                        <>
                            <Row>
                                <Col>
                                    <div style={{ backgroundColor: '#FFF', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '1px 1px 3px -1px #ccc', padding: '10px', marginBottom: '10px' }}>
                                        <AvForm id="table" onValidSubmit={(event, value) => updateInsurance(value)}>
                                            <div className="d-flex mb-3">
                                                <div style={{ padding: '0.47rem 0.75rem' }}>
                                                    {props.t('Social Insurance') + ' (%)'}
                                                </div>
                                                <AvInput type="text" className="text-right" style={{ marginLeft: 'auto', maxWidth: '240px' }} name={data.TiLeBHXH.name} value={data.TiLeBHXH.value} />
                                            </div>
                                            <div className="d-flex mb-3">
                                                <div style={{ padding: '0.47rem 0.75rem' }}>
                                                    {props.t('Health Insurance') + ' (%)'}
                                                </div>
                                                <AvInput type="text" className="text-right" style={{ marginLeft: 'auto', maxWidth: '240px' }} name={data.TiLeBHYT.name} value={data.TiLeBHYT.value} />
                                            </div>
                                            <div className="d-flex">
                                                <div style={{ padding: '0.47rem 0.75rem' }}>
                                                    {props.t('Accident Insurance') + ' (%)'}
                                                </div>
                                                <AvInput type="text" className="text-right" style={{ marginLeft: 'auto', maxWidth: '240px' }} name={data.TileBHTN.name} value={data.TileBHTN.value} />
                                            </div>
                                        </AvForm>
                                    </div>
                                    <Button type="submit" form="table" color="success">{props.t('Update')}</Button>
                                </Col>
                            </Row>
                        </>
                    }
                </Container>
            </div>
        </React.Fragment>
    );

}

export default withNamespaces()(SettingInsurance);