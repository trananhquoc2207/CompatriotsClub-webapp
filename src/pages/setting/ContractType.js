import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
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
import Toolbox from 'components/Toolbox';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from 'components/Pagination';
import CustomToolTip from 'components/CustomToolTip';

// Hook
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';

//i18n
import { withNamespaces } from 'react-i18next';

// API
import contractTypeApi from 'api/contractTypeApi';

const TableBody = (props) => {
    const { data, handleCheckBox, handleEdit, handleDelete } = props;

    return (
        <tbody>
            { (!data || data.length < 1)
                ? <tr><td colSpan={5} className="text-center">{props.t('No information')}</td></tr>
                : data.map((item, idx) => {
                    const { id, name, isChecked } = item;

                    return (
                        <tr className={classNames({ 'bg-green': isChecked })} key={'contractType_' + idx}>
                            <td>
                                <div className="custom-control custom-checkbox">
                                    <Input type="checkbox" className="custom-control-input" id={'checkbox_' + id} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                                    <Label className="custom-control-label" htmlFor={'checkbox_' + id}>&nbsp;</Label>
                                </div>
                            </td>
                            <td className="text-left">
                                {name}
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

const ContractType = (props) => {
    // Hook
    const pushQueryString = usePushQueryString();

    // Loading
    const [loading, setLoading] = useState(false);

    // Form
    const { register, errors, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });

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

    // Modal
    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState({
        isShow: false,
        contractType: {
            id: -1,
            name: '',
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
            nextToolBox.search = { ...nextToolBox.search, isShow: true };
            nextToolBox.add = { ...nextToolBox.add, isShow: true };
            nextToolBox.delete = { ...nextToolBox.delete, isShow: false };
        }

        setData(dataFilter); setToolBox(nextToolBox);
    }

    const handlePageChange = newPage => {
        pushQueryString({ page: newPage });
    }

    const handleFilter = filter => {
        if (!filter)
            return false;

        let query = {};
        if (filter.keyword && filter.keyword !== '')
            query.search = filter.keyword;

        pushQueryString(query);
    }

    const handleEdit = event => {

        let id = event.target.parentElement.id; id = id.substr(id.indexOf('_') + 1);
        if (isNaN(parseInt(id)) || data[id] === undefined)
            return false;

        setModalEdit({ ...modalEdit, isShow: true, contractType: data[id] });
    }

    const handleDelete = event => {
        if (event === undefined)
            setModalDelete({ isShow: true, id: 'all' });

        let id = event.target.parentElement.id; id = id.substr(id.indexOf('_') + 1);

        if (isNaN(parseInt(id)))
            return false;

        setModalDelete({ isShow: true, id: id });
    }

    // Function
    const init = () => {
        let nextToolBox = toolBox;
        nextToolBox.search = {
            isShow: true,
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
        let newPage = Math.ceil(pagination.totalRows / pagination.limit);
        if (data.length >= pagination.limit) {
            if (type === 'add')
                newPage = newPage + 1;
            else if (type === 'edit')
                newPage = page;
            else if (type === 'delete')
                newPage = newPage - 1;
        }

        // Modal
        setModalAdd(false);
        setModalEdit({ isShow: false, contractType: { id: -1, code: '', name: '' } });
        setModalDelete({ isShow: false, id: - 1 });

        window.location.reload();
    }

    const addContractType = async (payload) => {
        /* Request */
        const params = {
            tenLoaiHopDong: payload.name
        };

        await contractTypeApi
            .post(params)
            .then(() => { notify('success', props.t('Added.')); reload('add'); })
            .catch(error => notify('danger', error));
    }

    const editContractType = async (payload) => {
        if (payload.name !== modalEdit.contractType.name) {
            /* Request */
            const params = {
                id: modalEdit.contractType.id,
                tenLoaiHopDong: payload.name
            }

            await contractTypeApi
                .put(params.id, params)
                .then(() => { notify('success', props.t('Updated.')); reload('edit'); })
                .catch(error => notify('danger', error));
        }
    }

    const deleteContractType = async (id) => {
        if (id === 'all') {
            let requests = [];

            data.forEach(item => {
                if (item.isChecked) {
                    requests.push(contractTypeApi
                        .delete(item.id)
                        .catch(() => { notify('danger', props.t('Can\'t delete contract type #') + item.code) }));
                }
            });

            await Promise
                .all(requests)
                .then(() => { notify('success', props.t('Deleted.')); reload('delete'); })
                .catch(error => { notify('danger', error) });
        }
        else if (data[id] !== undefined) {
            await contractTypeApi
                .delete(data[id].id)
                .then(() => { notify('success', props.t('Deleted.')); reload(); })
                .catch(error => notify('danger', error));
        }
        else
            notify('danger', props.t('ContractType ID not found'));
    }

    const fetchData = async () => {
        setLoading(true);
        let params = { page_size: pagination.limit, page_number: 1 };
        if (page !== undefined)
            params.page_number = page;
        if (search !== undefined)
            params.tenPB = search;

        try {
            const response = await contractTypeApi.getAll(params);
            const dataFetch = response.data.map(item => {
                return {
                    id: item.id,
                    name: item.tenLoaiHopDong,
                    isChecked: false
                }
            })

            setPagination({
                page: response.meta.page_number,
                limit: response.meta.page_size,
                totalRows: response.meta.total
            });

            setData(dataFetch); setLoading(false);
        } catch (error) {
            setLoading(false); notify('danger', error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {loading ? <LoadingIndicator /> :
                        <>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col sm={6} md={4} xl={3}>
                                            <Modal size={'sm'} isOpen={modalAdd}>
                                                <ModalHeader toggle={() => setModalAdd(false)}>
                                                    <span className="font-weight-bold">{props.t('Add new contract type')}</span>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Form onSubmit={handleSubmit(addContractType)}>
                                                        <Row className="mb-1">
                                                            <Col>
                                                                <span style={{ fontSize: '15px', fontWeight: '400' }}>{props.t('Contract type name')}</span>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Col>
                                                                <Input
                                                                    name="name"
                                                                    className={errors.name ? 'form-control is-invalid' : 'form-control'}
                                                                    placeholder={props.t('Enter contract type name')}
                                                                    innerRef={
                                                                        register({
                                                                            required: props.t('Contract type name not entered')
                                                                        })
                                                                    } />
                                                                <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                                            </Col>
                                                        </Row>

                                                        <Button type="submit" color="success">{props.t('Add')}</Button>
                                                        <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalAdd(false) }}>{props.t('Cancel')}</Button>
                                                    </Form>
                                                </ModalBody>
                                            </Modal>
                                            <Modal size={'sm'} isOpen={modalEdit.isShow}>
                                                <ModalHeader toggle={() => setModalEdit({ isShow: false, contractType: { id: -1, name: '' } })}>
                                                    <span className="font-weight-bold">{props.t('Edit contract type') + ' #' + (modalEdit.contractType.id !== '' ? modalEdit.contractType.id : 'ID')}</span>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Form onSubmit={handleSubmit(editContractType)}>
                                                        <Row>
                                                            <Col>
                                                                <FormGroup>
                                                                    <Label for="name">{props.t('Contract type name')}</Label>
                                                                    <Input
                                                                        name="name"
                                                                        className={errors.name ? 'is-invalid' : ''}
                                                                        placeholder={props.t('Enter contract type name')}
                                                                        defaultValue={modalEdit.contractType.name}
                                                                        innerRef={
                                                                            register({
                                                                                required: props.t('Contract type name not entered')
                                                                            })
                                                                        } />
                                                                    <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Button type="submit" color="success">{props.t('Update')}</Button>
                                                        <Button type="button" className="ml-2" color="secondary" onClick={() => setModalEdit({ isShow: false, contractType: { id: -1, code: '', name: '', allowance: 0 } })}>{props.t('Cancel')}</Button>
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
                                                    <Button type="button" color="danger" size="md" onClick={() => { deleteContractType(modalDelete.id) }}>
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
                                                    <th className="text-left">{props.t('Contract type name')}</th>
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
                                </Col>
                            </Row>
                        </>
                    }
                </Container>
            </div>
        </React.Fragment>
    );

}

export default withNamespaces()(ContractType);