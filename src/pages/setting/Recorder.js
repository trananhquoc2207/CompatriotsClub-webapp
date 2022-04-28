import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import dayJS from 'dayjs';
import classNames from 'classnames';
import {
    Container,
    Table,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    Button
} from 'reactstrap';

// Component
import toastr from 'toastr';
import Select from 'react-select';
import Toolbox from 'components/Toolbox';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from 'components/Pagination';
import CustomToolTip from 'components/CustomToolTip';

// Hook
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';

// i18n
import { withNamespaces } from 'react-i18next';

// API
import recorderApi from 'api/recorderApi';

const TableBody = (props) => {
    const { data, handleCheckBox, handleEdit, handleDelete } = props;
    const recorderType = ['Time recorder', 'Camera'];
    const statusType = ['Connected', 'Disconnected'];
    return (
        <tbody>
            { (!data || data.length < 1)
                ? <tr><td colSpan={8} className="text-center">{props.t('No information')}</td></tr>
                : data.map((item, idx) => {
                    const { id, domain, code, type, ip, port, status, isChecked } = item;

                    return (
                        <tr className={classNames({ 'bg-green': isChecked })} key={'recorder_' + idx}>
                            <td>
                                <div className="custom-control custom-checkbox">
                                    <Input type="checkbox" className="custom-control-input" id={'checkbox_' + id} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                                    <Label className="custom-control-label" htmlFor={'checkbox_' + id}>&nbsp;</Label>
                                </div>
                            </td>
                            <td className="text-left">
                                {code}
                            </td>
                            <td className="text-left">
                                {props.t(recorderType[type])}
                            </td>
                            <td className="text-left">
                                {domain}
                            </td>
                            <td className="text-left">
                                {`${ip}:${port}`}
                            </td>
                            <td className="text-left">
                                {props.t(statusType[status])}
                            </td>
                            <td className="text-center">
                                <span id={'edit_' + idx} className="mr-2" onClick={event => handleEdit(event)}><i className="bx bx-xs bx-pencil"></i></span>
                                <CustomToolTip id={'edit_' + idx} message={props.t('Edit')} />

                                <span id={'delete_' + idx} onClick={event => handleDelete(event)}><i className="bx bx-xs bx-trash-alt"></i></span>
                                <CustomToolTip id={'delete_' + idx} message={props.t('Delete')} />
                            </td>
                        </tr>
                    );
                })
            }
        </tbody>
    );
}

const Recorder = (props) => {
    // Hook
    const pushQueryString = usePushQueryString();

    // Loading
    const [loading, setLoading] = useState(false);

    // Form
    const { register, errors, control, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });

    // Toolbox
    const [toolBox, setToolBox] = useState({
        search: {
            isShow: false,
            value: '',
            handle: null
        },
        datePicker: {
            isShow: false,
            value: null,
            handle: null
        },
        groupBy: {
            isShow: false,
            value: '',
            option: [],
            handle: null
        },
        attendance: {
            isShow: false,
            data: null,
            handle: null
        },
        import: {
            isShow: false,
            handle: null
        },
        export: {
            isShow: false,
            handle: null
        },
        add: {
            isShow: false,
            handle: null
        },
        delete: {
            isShow: false,
            handle: null
        },
    })
    //filter
    const [filters, setFilters] = useState({
        page_size: 10,
        page_number: 1,
        keyword: ''
    })
    // Modal
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState({
        isShow: false,
        recorder: {
            id: -1,
            domain: '',
            code: 0,
            type: 0,
            ip: '127.0.0.1',
            port: 8080
        }
    })
    const [modalDelete, setModalDelete] = useState({
        isShow: false,
        id: null
    });

    // Filter
    const { page, search } = useQueryString();

    // Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalRows: 1
    });

    // Data
    const [data, setData] = useState([]);
    const recorderType = [
        { value: 0, label: props.t('Time recorder') },
        { value: 1, label: props.t('Camera') }
    ]

    // Handle
    const handleCheckBox = event => {
        let dataFilter = [], nextToolBox = toolBox, flag = false, id = event.target.id;
        if (id === 'checkbox_all') {
            if (event.target.checked)
                flag = true;

            dataFilter = data.map(item => {
                return { ...item, isChecked: flag };
            })
        }
        else {
            if (event.target.checked)
                flag = true;

            id = id.substr(id.indexOf('_') + 1);
            dataFilter = data.map(item => {
                if (item.id === parseInt(id))
                    return { ...item, isChecked: flag };

                return item;
            })
        }

        if (!flag) {
            for (let i = 0; i < dataFilter.length; i++) {
                if (dataFilter[i].isChecked) {
                    flag = true;
                    break;
                }
            }
        }

        if (flag) {
            nextToolBox.search = { ...nextToolBox.search, isShow: false };
            nextToolBox.add = { ...nextToolBox.add, isShow: false };
            nextToolBox.delete = { ...nextToolBox.delete, isShow: true };
        }
        else {
            nextToolBox.search = { ...nextToolBox.search, isShow: false };
            nextToolBox.add = { ...nextToolBox.add, isShow: true };
            nextToolBox.delete = { ...nextToolBox.delete, isShow: false };
        }

        setData(dataFilter); setToolBox(nextToolBox);
    }

    const handlePageChange = newPage => {
        if (newPage === page)
            return false;

        let query = { search: '' };
        if (newPage !== 1 || page !== 1)
            query.page = newPage;

        pushQueryString(query);
    }

    const handleFilter = filter => {
        if (!filter)
            return false;

        pushQueryString({ search: filter.keyword });
    }

    const handleEdit = event => {
        let id = event.target.parentElement.id; id = id.substr(id.indexOf('_') + 1);
        if (isNaN(parseInt(id)) || data[id] === undefined)
            return false;

        setModalEdit({ ...modalEdit, isShow: true, recorder: data[id] });
    }

    const handleDelete = event => {
        let id = event.target.parentElement.id; id = id.substr(id.indexOf('_') + 1);
        if (isNaN(parseInt(id)))
            return false;

        setModalDelete({ isShow: true, id: id });
    }

    // Function
    const init = () => {
        let nextToolBox = toolBox;
        nextToolBox.search = {
            isShow: false,
            value: '',
            handle: handleFilter
        };

        nextToolBox.add = {
            isShow: true,
            handle: () => { setModalAdd(true) }
        }

        nextToolBox.delete = {
            isShow: false,
            handle: handleDelete
        }

        setToolBox(nextToolBox);
    }

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


    const reload = (type = 'add') => {
        let page = Math.ceil(pagination.totalRows / pagination.limit);
        if (data.length >= pagination.limit) {
            if (type === 'add')
                page = page + 1;
            else if (type === 'delete')
                page = page - 1;
        }

        // Modal
        setModalAdd(false);
        setModalEdit({
            isShow: false,
            recorder: {
                id: -1,
                domain: '',
                code: 0,
                type: 0,
                ip: '127.0.0.1',
                port: 8080
            }
        });
        setModalDelete({ isShow: false, id: - 1 });

        // Toolbox
        if (toolBox.search.isShow) {
            let nextToolBox = toolBox;
            toolBox.search.value = null;

            setToolBox(nextToolBox);
        }

        // Filter
        setFilters(prevState => ({ ...prevState, page_number: page, keyword: '' }));
    }

    const addRecorder = async (payload) => {
        /* Request */
        const params = {
            soHieuMay: parseInt(payload.code),
            loaiMay: payload.type.value,
            tenMien: payload.domain,
            ip: payload.ip,
            port: parseInt(payload.port)
        };

        await recorderApi
            .post(params)
            .then(() => { notify('success', props.t('Added.')); reload('add'); })
            .catch(error => notify('danger', error));
    }

    const editRecorder = async (payload) => {
        const params = {
            id: modalEdit.recorder.id,
            soHieuMay: parseInt(payload.code),
            loaiMay: payload.type.value,
            tenMien: payload.domain,
            ip: payload.ip,
            port: parseInt(payload.port)
        };

        if (params.soHieuMay !== modalEdit.recorder.code || params.loaiMay !== modalEdit.recorder.type || params.tenMien !== modalEdit.recorder.domain || params.ip !== modalEdit.recorder.ip || params.port !== modalEdit.recorder.port) {
            await recorderApi
                .put(params.id, params)
                .then(() => { notify('success', props.t('Updated.')); reload('edit'); })
                .catch(error => notify('danger', error));
        }
    }

    const deleteRecorder = async (id) => {
        if (id === 'all') {
            let requests = [];
            data.forEach(item => {
                if (item.isChecked) {
                    requests.push(recorderApi
                        .delete(item.id)
                        .catch(() => { notify('danger', props.t('Can\'t delete shift #') + item.code) }));
                }
            });

            await Promise
                .all(requests)
                .then(() => { notify('success', props.t('Deleted.')); reload('delete'); })
                .catch(error => { notify('danger', error) });
        }
        else if (data[id] !== undefined) {
            await recorderApi
                .delete(data[id].id)
                .then(() => { notify('success', props.t('Deleted.')); reload(); })
                .catch(error => notify('danger', error));
        }
        else
            notify('danger', props.t('Recorder ID not found'));
    }

    const fetchData = async () => {
        setLoading(true);
        let params = { page_size: pagination.limit, page_number: 1 };
        if (page !== undefined)
            params.page_number = page;
        if (search !== undefined)
            params.SoHieuMay = search;

        try {
            const response = await recorderApi.getAll({ LoaiMay: 1 });
            const dataFetch = response.data.map(item => {
                return {
                    id: item.id,
                    domain: item.tenMien,
                    code: item.soHieuMay,
                    type: item.loaiMay,
                    ip: item.ip,
                    port: item.port,
                    status: item.trangThaiKetNoi
                }
            })
            const dataRecorder = [...dataFetch];
            const res = await recorderApi.getAll({ LoaiMay: 0 });
            res.data.map(item => {
                dataRecorder.push({
                    id: item.id,
                    domain: item.tenMien,
                    code: item.soHieuMay,
                    type: item.loaiMay,
                    ip: item.ip,
                    port: item.port,
                    status: item.trangThaiKetNoi
                }
                )
            })

            setPagination({
                page: response.meta.page_number,
                limit: response.meta.page_size,
                totalRows: response.meta.total
            });


            setData(dataRecorder); setLoading(false);
        } catch (error) {
            setLoading(false); notify('danger', error);
        }
    }

    useEffect(() => {
        init();
        fetchData();
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col>
                            {
                                loading
                                    ?
                                    <LoadingIndicator />
                                    :
                                    <>
                                        <Row>
                                            <Col sm={6} md={4} xl={3}>
                                                <Modal size={'sm'} isOpen={modalAdd}>
                                                    <ModalHeader toggle={() => setModalAdd(false)}>
                                                        <span className="font-weight-bold">{props.t('Add new time recorder')}</span>
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <Form onSubmit={handleSubmit(addRecorder)}>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="domain">{props.t('Domain')}</Label>
                                                                        <Input
                                                                            name="domain"
                                                                            className={errors.domain ? 'is-invalid' : ''}
                                                                            placeholder={props.t('Enter domain')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Domain not entered'),
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="domain" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="code">{props.t('Recorder code')}</Label>
                                                                        <Input
                                                                            name="code"
                                                                            className={errors.code ? 'is-invalid' : ''}
                                                                            placeholder={props.t('Enter recorder code')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Recorder code not entered'),
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="code" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="type">{props.t('Recorder type')}</Label>
                                                                        <Controller
                                                                            as={Select}
                                                                            name={'type'}
                                                                            control={control}
                                                                            styles={{
                                                                                control: (base, state) => (
                                                                                    errors.type
                                                                                        ?
                                                                                        {
                                                                                            ...base,
                                                                                            boxShadow: state.isFocused ? null : null,
                                                                                            borderColor: '#F46A6A',
                                                                                            '&:hover': {
                                                                                                borderColor: '#F46A6A'
                                                                                            }
                                                                                        }
                                                                                        :
                                                                                        {
                                                                                            ...base,
                                                                                            boxShadow: state.isFocused ? null : null,
                                                                                            borderColor: '#CED4DA',
                                                                                            '&:hover': {
                                                                                                borderColor: '#2684FF'
                                                                                            }
                                                                                        }
                                                                                )
                                                                            }}
                                                                            isClearable
                                                                            options={recorderType}
                                                                            placeholder={props.t('Choose recorder type')}
                                                                            defaultValue={''}
                                                                            rules={{ required: props.t('Recorder type not entered') }}
                                                                        />
                                                                        <ErrorMessage name="type" errors={errors} render={({ message }) =>
                                                                            <div style={{ display: 'block', width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                                                                {message}
                                                                            </div>
                                                                        } />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs={7}>
                                                                    <FormGroup>
                                                                        <Label for="ip">{props.t('IP')}</Label>
                                                                        <Input
                                                                            name="ip"
                                                                            className={errors.ip ? 'is-invalid' : ''}
                                                                            placeholder={props.t('Enter ip')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('IP not entered'),
                                                                                    validate: input => {
                                                                                        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input))
                                                                                            return true;

                                                                                        return props.t('IP is invalid');
                                                                                    }
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="ip" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={5}>
                                                                    <FormGroup>
                                                                        <Label for="port">{props.t('Port')}</Label>
                                                                        <Input
                                                                            name="port"
                                                                            className={errors.port ? 'is-invalid' : ''}
                                                                            placeholder={props.t('Enter port')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Port not entered'),
                                                                                    validate: input => {
                                                                                        if (!isNaN(parseInt(input)))
                                                                                            return true;

                                                                                        return props.t('Port is invalid')
                                                                                    }
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="port" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Button type="submit" color="success">{props.t('Add')}</Button>
                                                            <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalAdd(false) }}>{props.t('Cancel')}</Button>
                                                        </Form>
                                                    </ModalBody>
                                                </Modal>
                                                <Modal size={'sm'} isOpen={modalEdit.isShow}>
                                                    <ModalHeader toggle={() => setModalEdit({ isShow: false, recorder: { id: -1, domain: '', code: 0, type: 0, ip: '127.0.0.1', port: '8080' } })}>
                                                        <span className="font-weight-bold">{props.t('Edit recorder') + ' #' + (modalEdit.recorder.code !== 0 ? modalEdit.recorder.code : 'ID')}</span>
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <Form onSubmit={handleSubmit(editRecorder)}>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="domain">{props.t('Domain')}</Label>
                                                                        <Input
                                                                            name="domain"
                                                                            className={errors.domain ? 'is-invalid' : ''}
                                                                            defaultValue={modalEdit.recorder.domain}
                                                                            placeholder={props.t('Enter domain')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Domain not entered'),
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="domain" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="code">{props.t('Recorder code')}</Label>
                                                                        <Input
                                                                            name="code"
                                                                            className={errors.code ? 'is-invalid' : ''}
                                                                            defaultValue={modalEdit.recorder.code}
                                                                            placeholder={props.t('Enter time recorder code')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Recorder code not entered'),
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="code" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup>
                                                                        <Label for="type">{props.t('Recorder type')}</Label>
                                                                        <Controller
                                                                            as={Select}
                                                                            name={'type'}
                                                                            control={control}
                                                                            styles={{
                                                                                control: (base, state) => (
                                                                                    errors.type
                                                                                        ?
                                                                                        {
                                                                                            ...base,
                                                                                            boxShadow: state.isFocused ? null : null,
                                                                                            borderColor: '#F46A6A',
                                                                                            '&:hover': {
                                                                                                borderColor: '#F46A6A'
                                                                                            }
                                                                                        }
                                                                                        :
                                                                                        {
                                                                                            ...base,
                                                                                            boxShadow: state.isFocused ? null : null,
                                                                                            borderColor: '#CED4DA',
                                                                                            '&:hover': {
                                                                                                borderColor: '#2684FF'
                                                                                            }
                                                                                        }
                                                                                )
                                                                            }}
                                                                            isClearable
                                                                            options={recorderType}
                                                                            placeholder={props.t('Choose recorder type')}
                                                                            defaultValue={{
                                                                                label: recorderType[modalEdit.recorder.type].label,
                                                                                value: modalEdit.recorder.type
                                                                            }}
                                                                            rules={{ required: props.t('Recorder type not entered') }}
                                                                        />
                                                                        <ErrorMessage name="type" errors={errors} render={({ message }) =>
                                                                            <div style={{ display: 'block', width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                                                                {message}
                                                                            </div>
                                                                        } />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs={7}>
                                                                    <FormGroup>
                                                                        <Label for="ip">{props.t('IP')}</Label>
                                                                        <Input
                                                                            name="ip"
                                                                            className={errors.ip ? 'is-invalid' : ''}
                                                                            defaultValue={modalEdit.recorder.ip}
                                                                            placeholder={props.t('Enter ip')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('IP not entered'),
                                                                                    validate: input => {
                                                                                        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input))
                                                                                            return true;

                                                                                        return props.t('IP is invalid');
                                                                                    }
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="ip" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs={5}>
                                                                    <FormGroup>
                                                                        <Label for="port">{props.t('Port')}</Label>
                                                                        <Input
                                                                            name="port"
                                                                            className={errors.port ? 'is-invalid' : ''}
                                                                            defaultValue={modalEdit.recorder.port}
                                                                            placeholder={props.t('Enter port')}
                                                                            innerRef={
                                                                                register({
                                                                                    required: props.t('Port not entered'),
                                                                                    validate: input => {
                                                                                        if (!isNaN(parseInt(input)))
                                                                                            return true;

                                                                                        return props.t('Port is invalid')
                                                                                    }
                                                                                })
                                                                            } />
                                                                        <ErrorMessage name="port" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Button type="submit" color="success">{props.t('Update')}</Button>
                                                            <Button type="button" className="ml-2" color="secondary" onClick={() => setModalEdit({ isShow: false, recorder: { id: -1, domain: '', code: 0, type: 0, ip: '127.0.0.1', port: '8080' } })}>{props.t('Cancel')}</Button>
                                                        </Form>
                                                    </ModalBody>
                                                </Modal>
                                                <Modal size={'sm'} isOpen={modalDelete.isShow} style={{ top: '100px', maxWidth: '350px' }}>
                                                    <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
                                                        <div style={{ margin: '15px auto', textAlign: 'center' }}>
                                                            <i className="bx bxs-x-circle" style={{ color: '#f15e5e', fontSize: '80px' }}></i>
                                                        </div>
                                                        <span>
                                                            <h5 style={{ display: 'block', maxWidth: '100%', margin: '0px 0px .5em', color: 'rgb(89, 89, 89)', fontSize: '1.875em', fontWeight: '600', textAlign: 'center', textTransform: 'none', overflowWrap: 'break-word' }}>
                                                                {props.t('Confirm')}
                                                            </h5>
                                                        </span>
                                                        <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
                                                            {props.t('Do you really want to delete this record(s)?\nThis process cannot be undone.')}
                                                        </p>
                                                    </ModalHeader>
                                                    <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
                                                        <Button type="button" color="danger" size="md" onClick={() => { deleteRecorder(modalDelete.id) }}>
                                                            {props.t('Accept')}
                                                        </Button>
                                                        <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => setModalDelete({ isShow: false, id: null })}>
                                                            {props.t('Cancel')}
                                                        </Button>
                                                    </ModalBody>
                                                </Modal>
                                            </Col>
                                        </Row>

                                        <Toolbox t={props.t} option={toolBox} />
                                        <div className="table-responsive wrapper">
                                            <Table className="table table-wrapper table-hover table-nowrap mb-0">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "20px" }}>
                                                            <div className="custom-control custom-checkbox">
                                                                <Input type="checkbox" className="custom-control-input" id={'checkbox_all'} onChange={(event) => handleCheckBox(event)} />
                                                                <Label className="custom-control-label" htmlFor={'checkbox_all'}>&nbsp;</Label>
                                                            </div>
                                                        </th>
                                                        <th className="text-left">{props.t('Recorder code')}</th>
                                                        <th className="text-left">{props.t('Recorder type')}</th>
                                                        <th className="text-left">{props.t('Domain')}</th>
                                                        <th className="text-left">{props.t('Address')}</th>
                                                        <th className="text-left">{props.t('Status')}</th>
                                                        <th className="text-center" style={{ width: '50px' }}>{props.t('Action')}</th>
                                                    </tr>
                                                </thead>
                                                <TableBody t={props.t} data={data} handleCheckBox={handleCheckBox} handleEdit={handleEdit} handleDelete={handleDelete} />
                                            </Table>
                                        </div>
                                        <Pagination
                                            pagination={pagination}
                                            onPageChange={handlePageChange}
                                        />
                                    </>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withNamespaces()(Recorder);