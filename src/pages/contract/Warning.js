import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import dayJS from 'dayjs';
import {
    Spinner,
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
    Button,
} from 'reactstrap';

// Component
import toastr from 'toastr';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { withNamespaces } from 'react-i18next';
import Toolbox from '../../components/Toolbox';
import Pagination from '../../components/Pagination';
import NumericInput from '../../components/NumericInput';
import MultipleInput from '../../components/MultipleInput';
import CustomToolTip from '../../components/CustomToolTip';

// CSS
import 'toastr/build/toastr.min.css';
import 'react-datepicker/dist/react-datepicker.css';

// i18n

// API
import contractApi from '../../api/contractApi';
import allowanceApi from '../../api/allowanceApi';

const LoadingIndicator = () => (
  <div
    style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: window.innerHeight / 3,
            }}
  >
    <Spinner color="primary" />
  </div>
    );

const TableBody = (props) => {
    const formatCurrency = (number, currency) => `${number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} ${currency}`;

    const { data, handleCheckBox, handleRenew, handleDelete } = props;
    const statusType = ['Not yet', 'In during term of contract', 'Expired contract'];

    return (
      <tbody>
        { (!data || data.length < 1)
                ? <tr><td colSpan={9} className="text-center">{props.t('No information')}</td></tr>
                : data.map((item, idx) => {
                    const { id, contractNumber, contractType, beginDate, endDate, wage, employee, status, isChecked } = item;

                    return (
                      <tr className={classNames({ 'bg-green': isChecked })} key={`contract_${id}`}>
                        <td style={{ width: '20px' }}>
                          <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id={`checkbox_${id}`} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                            <Label className="custom-control-label" htmlFor={`checkbox_${id}`}>&nbsp;</Label>
                          </div>
                        </td>
                        <td className="text-left">{contractNumber}</td>
                        <td className="text-left">{contractType.tenLoaiHopDong}</td>
                        <td className="text-left">{employee.name}</td>
                        <td className="text-right">{formatCurrency(wage, 'đ')}</td>
                        <td className="text-center">{dayJS(beginDate).format('DD/MM/YYYY')}</td>
                        <td className="text-center">{dayJS(endDate).format('DD/MM/YYYY')}</td>
                        <td className="text-left">{props.t(statusType[status])}</td>
                        <td className="text-center">
                          <span id={`renew_${idx}`} className="mr-2" onClick={(event) => handleRenew(event)}><i className="bx bx-xs bx bx-add-to-queue" /></span>
                          <CustomToolTip id={`renew_${idx}`} message={props.t('Renew')} />

                          <span id={`delete_${idx}`} onClick={(event) => handleDelete(event)}><i className="bx bx-xs bx-trash-alt" /></span>
                          <CustomToolTip id={`delete_${idx}`} message={props.t('Delete')} />
                        </td>
                      </tr>
                    );
                })
            }
      </tbody>
    );
};

const Warning = (props) => {
    // Loading
    const [loading, setLoading] = useState(false);

    // Form
    const { watch, register, errors, control, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });

    // Toolbox
    const [toolBox, setToolBox] = useState({
        search: {
            isShow: false,
            value: '',
            handle: null,
        },
        datePicker: {
            isShow: false,
            value: null,
            handle: null,
        },
        groupBy: {
            isShow: false,
            value: '',
            option: [],
            handle: null,
        },
        attendance: {
            isShow: false,
            data: null,
            handle: null,
        },
        import: {
            isShow: false,
            handle: null,
        },
        export: {
            isShow: false,
            handle: null,
        },
        add: {
            isShow: false,
            handle: null,
        },
        delete: {
            isShow: false,
            handle: null,
        },
    });

    // Pagination
    const [filters, setFilters] = useState({
        page_size: 10,
        page_number: 1,
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalRows: 1,
    });

    // Modal
    const [modalRenew, setModalRenew] = useState({
        isShow: false,
        contract: {
            id: -1,
            contractID: '',
            contractType: -1,
            startDate: '',
            endDate: '',
            wage: 0,
            allowance: [],
            employee: {
                id: -1,
                code: '',
                name: '',
            },
        },
    });
    const [modalDelete, setModalDelete] = useState({ isShow: false, id: -1 });

    // Data
    const [data, setData] = useState([]);
    const [contractType, setContractType] = useState([]);
    let dataRenew = {};

    // Handle
    const handlePageChange = (newPage) => {
        setFilters({
            ...filters, page_number: newPage,
        });
    };

    const handleCheckBox = (event) => {
        const dataFilter = []; let flag = false; let
{ id } = event.target;
        if (id === 'checkbox_all') {
            if (event.target.checked) { flag = true; }

            data.forEach((item, idx) => {
                dataFilter[idx] = { ...item, isChecked: flag };
            });
        } else {
            if (event.target.checked) { flag = true; }

            id = parseInt(id.substr(id.indexOf('_') + 1));
            data.forEach((item, idx) => {
                dataFilter[idx] = item;
                if (!isNaN(id) && item.id === id) { dataFilter[idx].isChecked = flag; }
            });
        }

        if (!flag) {
            for (let i = 0; i < dataFilter.length; i++) {
                if (dataFilter[i].isChecked) {
                    flag = true;
                    break;
                }
            }
        }

        const nextToolBox = toolBox;
        if (flag) {
            nextToolBox.search.isShow = false;
            nextToolBox.delete.isShow = true;
        } else {
            nextToolBox.search.isShow = true;
            nextToolBox.delete.isShow = false;
        }

        setData(dataFilter); setToolBox(nextToolBox);
    };

    const handleMultipleInput = (payload) => {
        dataRenew = payload;
    };

    const handleFilter = (filter) => {
        setFilters({ ...filters, keyword: filter.keyword });
    };

    const handleRenew = async (event) => {
        let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
        if (isNaN(parseInt(id))) { return false; }

        let allowance = [];
        const response = await allowanceApi.get(data[id].employee.id);
        if (response && response && response.data.length > 0) {
            allowance = response.data.map((item) => {
                const array = {};
                Object.keys(item).forEach((key) => {
                    array[key] = item[key];
                });

                return array;
            });
        }

        setModalRenew({ isShow: true, contract: { ...data[id], allowance } });
    };

    const handleDelete = (event) => {
        let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
        if (isNaN(parseInt(id))) { return false; }

        setModalDelete({ isShow: true, id: data[id].id });
    };

    // Validate
    const isRegisteredContract = async (payload) => {
        const response = await contractApi.getAll({ soHD: payload });
        if (response && response.data.length > 0) { return props.t('Contract ID is registered'); }

        return true;
    };

    // Function
    const notify = (type, message) => {
        toastr.options = {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
            extendedTimeOut: 3000,
            closeButton: true,
            preventDuplicates: true,
        };

        if (type === 'success') { toastr.success(message, props.t('Success')); } else if (type === 'info') { toastr.info(message); } else if (type === 'warning') { toastr.warning(message); } else if (type === 'danger') { toastr.error(message, props.t('Failed')); } else { toastr.secondary(message); }
    };

    const reload = (type = 'add') => {
        let page = Math.ceil(pagination.totalRows / pagination.limit);
        if (data.length >= pagination.limit) {
            if (type === 'add') page += 1;
            else if (type === 'delete') page -= 1;
        }

        // Modal
        setModalRenew({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: [], employee: { id: -1, code: '', name: '' } } });
        setModalDelete({ isShow: false, id: -1 });

        // Filter
        setFilters((prevState) => ({ ...prevState, page_number: page, keyword: '' }));
    };

    const renewContract = async (payload) => {
        const paramsContract = {
            soHopDong: payload.contractID,
            idNhanVien: modalRenew.contract.employee.id,
            ngayHieuLuc: dayJS(payload.beginDate).toISOString(),
            ngayKetThuc: dayJS(payload.endDate).toISOString(),
            idLoaiHopDong: payload.contractType.value,
            mucLuong: parseFloat(payload.wage.replace(/[^\d]/g, '')),
        };

        /* Reset */
        setModalRenew({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: [], employee: { id: -1, code: '', name: '' } } });

        /* Request */
        let contractID = -1;
        await contractApi
            .post(paramsContract)
            .then((response) => {
                if (response && response.id) { contractID = response.id; }
                reload('add'); notify('success', props.t('Added.'));
            })
            .catch((error) => { notify('danger', error); });

        /* Request Allowance */
        if (Object.keys(dataRenew).length > 0 && contractID !== -1) {
            const paramsAllowance = Object.keys(dataRenew).map((key) => {
                let price = dataRenew[key].soTien;
                if (typeof price === 'string') { price = 0; }

                return { ...dataRenew[key], idHopDong: contractID, soTien: price };
            });

            allowanceApi
                .put(contractID, paramsAllowance)
                .catch((error) => { notify('danger', error); });
        }

        /* Reset */
        dataRenew = {};
    };

    const deleteContract = async (id) => {
        if (!id || id === -1) { return false; }

        if (id === 'all') {
            const requests = [];
            data.forEach((contract) => {
                if (contract.isChecked) { requests.push(contractApi.delete(contract.id)); }
            });

            await Promise
                .all(requests)
                .then(() => { reload('delete'); notify('success', props.t('Deleted.')); })
                .catch((error) => { notify('danger', props.t(error)); });
        } else {
            await contractApi
                .delete(id)
                .then(() => { reload('delete'); notify('success', props.t('Deleted.')); })
                .catch((error) => { notify('danger', props.t(error)); });
        }
    };

    const fetchContract = async () => {
        setLoading(true);
        const params = { page_size: filters.page_size, page_number: filters.page_number, state: 2, q: filters.keyword };

        await contractApi
            .getAll(params)
            .then((response) => {
                if (response.success && response.data && response.data.length > 0) {
                    const dataFormat = response.data.map((item) => {
                        // 0: not begin, 1: during, 2: end
                        let status = 2; const
remain = dayJS(item.ngayKetThuc).unix() - dayJS().unix();
                        if (remain > 0) {
                            if (dayJS().unix() - dayJS(item.ngayHieuLuc).unix() < 0) { status = 0; } else { status = 1; }
                        }

                        return {
                            id: item.id,
                            contractNumber: item.soHopDong,
                            contractType: item.LoaiHopDong,
                            beginDate: item.ngayHieuLuc,
                            endDate: item.ngayKetThuc,
                            wage: item.mucLuong,
                            employee: {
                                id: item.idNhanVien,
                                code: item.nhanVien.maNV,
                                name: item.nhanVien.tenNV,
                            },
                            status,
                            isChecked: false,
                        };
                    });

                    setPagination({
                        page: response.meta.page_number,
                        limit: response.meta.page_size,
                        totalRows: response.meta.total,
                    });

                    setData(dataFormat);
                }

                setLoading(false);
            })
            .catch((error) => { setLoading(false); notify('danger', error); });
    };

    const fetchContractType = async () => {
        await contractApi
            .getType()
            .then((response) => {
                if (response && response.success && response.data.length > 0) {
                    const dataFormat = response.data.map((item) => ({ value: item.id, label: item.tenLoaiHopDong }));

                    setContractType(dataFormat);
                }
            })
            .catch((error) => { notify('danger', error); });
    };

    const init = async () => {
        /* Toolbox */
        const nextToolBox = toolBox;
        nextToolBox.search = {
            ...nextToolBox.search,
            isShow: true,
            handle: handleFilter,
        };

        nextToolBox.delete = {
            isShow: false,
            handle: () => { setModalDelete({ isShow: true, id: 'all' }); },
        };

        setToolBox(nextToolBox);
    };

    useEffect(() => {
        fetchContractType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        init();
        fetchContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
      <>
        <div className="page-content">
          <Container fluid>
            {loading ? <LoadingIndicator /> :
            <>
              <Toolbox t={props.t} option={toolBox} />
              <Col sm={6} md={4} xl={3}>
                <Modal size="md" isOpen={modalRenew && modalRenew.contract.id !== -1}>
                  <ModalHeader toggle={() => setModalRenew({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: [], employee: { id: -1, code: '', name: '' } } })}>
                    <span className="font-weight-bold">{props.t('Renew contract')}</span>
                  </ModalHeader>
                  <ModalBody>
                    <Form onSubmit={handleSubmit(renewContract)}>
                      <Row>
                        <Col md={12}>
                              <Row className="mb-3">
                                  <Col>
                                      <span style={{ fontSize: '15px', fontWeight: '600' }}>{props.t('Information')}</span>
                                    </Col>
                                </Row>
                              <Row>
                                  <Col md={4}>
                                      <FormGroup>
                                            <Label for="contractID">{props.t('Contract ID')}</Label>
                                            <Input
                                                name="contractID"
                                                className={errors.contractID ? 'is-invalid' : ''}
                                                placeholder={props.t('Enter contract id')}
                                                innerRef={
                                                                        register({
                                                                            required: props.t('Contract ID not entered'),
                                                                            validate: (input) => isRegisteredContract(input),
                                                                        })
                                                                    }
                                              />
                                            <ErrorMessage name="contractID" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                          </FormGroup>
                                    </Col>
                                  <Col md={8}>
                                      <FormGroup>
                                            <Label for="employee">{props.t('Employee')}</Label>
                                            <Input
                                                name="employee"
                                                defaultValue={`${modalRenew.contract.employee.code} - ${modalRenew.contract.employee.name}`}
                                                disabled
                                              />
                                          </FormGroup>
                                    </Col>
                                </Row>
                              <Row style={{ marginBottom: '16px' }}>
                                  <Col>
                                      <Label for="contractType">{props.t('Contract type')}</Label>
                                      <Controller
                                            as={Select}
                                            name="contractType"
                                            control={control}
                                            styles={{
                                                                    control: (base, state) => (
                                                                        errors.contractType
                                                                            ?
                                                                            {
                                                                                ...base,
                                                                                boxShadow: state.isFocused ? null : null,
                                                                                borderColor: '#F46A6A',
                                                                                '&:hover': {
                                                                                    borderColor: '#F46A6A',
                                                                                },
                                                                            }
                                                                            :
                                                                            {
                                                                                ...base,
                                                                                boxShadow: state.isFocused ? null : null,
                                                                                borderColor: '#CED4DA',
                                                                                '&:hover': {
                                                                                    borderColor: '#2684FF',
                                                                                },
                                                                            }
                                                                    ),
                                                                }}
                                            isClearable
                                            options={contractType}
                                            placeholder={props.t('Choose contract type')}
                                            defaultValue=""
                                            rules={{
                                                                    required: props.t('Contract type not entered'),
                                                                }}
                                          />
                                    </Col>
                                </Row>
                              <Row>
                                  <Col md={6}>
                                      <Label for="beginDate">{props.t('Begin date')}</Label>
                                      <Controller
                                            name="beginDate"
                                            control={control}
                                            valueName="selected"
                                            defaultValue={new Date()}
                                            rules={{ required: props.t('Begin date not entered') }}
                                            render={({ onChange, onBlur, value, name }) =>
                                                <DatePicker
                                                    name={name}
                                                    className={errors.beginDate ? 'form-control is-invalid' : 'form-control'}
                                                    dateFormat="dd/MM/yyyy"
                                                    autocomplete="off"
                                                    selected={value}
                                                    onChange={(time) => onChange(time)}
                                                  />
                                                                }
                                          />
                                      <ErrorMessage name="beginDate" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                    </Col>
                                  <Col md={6}>
                                      <Label for="endDate">{props.t('End date')}</Label>
                                      <Controller
                                            name="endDate"
                                            control={control}
                                            valueName="selected"
                                            defaultValue={new Date()}
                                            rules={{
                                                                    required: props.t('End date not entered'),
                                                                    validate: (payload) => {
                                                                        if (dayJS(watch('beginDate')).unix() > dayJS(payload).unix()) return props.t('End date is invalid');

                                                                        return true;
                                                                    },
                                                                }}
                                            render={({ onChange, onBlur, value, name }) =>
                                                <DatePicker
                                                    name={name}
                                                    className={errors.endDate ? 'form-control is-invalid' : 'form-control'}
                                                    dateFormat="dd/MM/yyyy"
                                                    autocomplete="off"
                                                    selected={value}
                                                    onChange={(time) => onChange(time)}
                                                  />
                                                                }
                                          />
                                      <ErrorMessage name="endDate" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                                    </Col>
                                </Row>

                              <Row>
                                  <div style={{ margin: '15px auto', height: '1px', width: '90%', backgroundColor: '#CCC' }}>&nbsp;</div>
                                </Row>

                              <Row style={{ marginBottom: '12px' }}>
                                  <Col>
                                      <span style={{ fontSize: '15px', fontWeight: '600' }}>{props.t('Wage')}</span>
                                    </Col>
                                </Row>
                              <Row className="mb-3">
                                  <Col>
                                      <NumericInput tag={Input} name="wage" defaultValue={modalRenew.contract.wage} innerRef={register({ required: props.t('Wage not entered') })} />
                                    </Col>
                                </Row>
                              <Row>
                                  <Col>
                                      <span style={{ fontSize: '15px', fontWeight: '600' }}>{props.t('Allowance')}</span>
                                    </Col>
                                </Row>
                              <Row>
                                  <Col>
                                      <MultipleInput
                                            t={props.t}
                                            handle={handleMultipleInput}
                                            body={[
                                                                    { name: 'tenPhuCap', description: props.t('Allowance'), type: 'string' },
                                                                    { name: 'soTien', description: props.t('Amount of money'), type: 'number' },
                                                                    { name: 'dongTNCN', description: props.t('TNCN'), type: 'checkbox' },
                                                                    { name: 'dongBHXH', description: props.t('BHXH'), type: 'checkbox' },
                                                                ]}
                                            defaultData={modalRenew.contract.allowance}
                                          />
                                    </Col>
                                </Row>
                            </Col>
                      </Row>

                      <Button type="submit" color="success">{props.t('Renew')}</Button>
                      <Button type="button" className="ml-2" color="secondary" onClick={() => setModalRenew({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, employee: { id: -1, code: '', name: '' } } })}>{props.t('Cancel')}</Button>
                    </Form>
                  </ModalBody>
                </Modal>
                <Modal size="sm" isOpen={modalDelete.isShow} style={{ top: '100px', maxWidth: '350px' }}>
                  <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
                    <div style={{ margin: '0 auto', textAlign: 'center' }}>
                      <span style={{ color: '#f15e5e', fontSize: '80px' }}>
                        <i className="fa fa-times-circle" />
                      </span>
                    </div>
                    <h5 style={{ display: 'block', maxWidth: '100%', margin: '0px 0px .7em', color: 'rgb(89, 89, 89)', fontSize: '1.875em', fontWeight: '600', textAlign: 'center', textTransform: 'none', overflowWrap: 'break-word' }}>
                      {props.t('Confirm')}
                    </h5>
                    <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
                      {props.t('Do you really want to delete this record(s)?\nThis process cannot be undone.')}
                    </p>
                  </ModalHeader>
                  <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
                    <Button type="button" color="danger" size="md" onClick={(event) => { deleteContract(modalDelete.id); setModalDelete({ isShow: false, id: -1 }); }}>
                      {props.t('Accept')}
                    </Button>
                    <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => setModalDelete({ isShow: false, id: -1 })}>
                      {props.t('Cancel')}
                    </Button>
                  </ModalBody>
                </Modal>
              </Col>
              <div className="table-responsive wrapper">
                <Table className="table table-wrapper table-hover table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '20px' }}>
                        <div className="custom-control custom-checkbox">
                              <Input type="checkbox" className="custom-control-input" id="checkbox_all" onChange={(event) => handleCheckBox(event)} />
                              <Label className="custom-control-label" htmlFor="checkbox_all">&nbsp;</Label>
                            </div>
                      </th>
                      <th className="text-left" style={{ width: '20px' }}>{props.t('Contract ID')}</th>
                      <th className="text-left" style={{ width: '170px' }}>{props.t('Contract type')}</th>
                      <th className="text-left">{props.t('Employee name')}</th>
                      <th className="text-right">{props.t('Wage')}</th>
                      <th className="text-center" style={{ width: '120px' }}>{props.t('Begin date')}</th>
                      <th className="text-center" style={{ width: '120px' }}>{props.t('End date')}</th>
                      <th className="text-left" style={{ width: '120px' }}>{props.t('Status')}</th>
                      <th className="text-center" style={{ width: '50px' }}>{props.t('Action')}</th>
                    </tr>
                  </thead>
                  <TableBody t={props.t} data={data} handleCheckBox={handleCheckBox} handleRenew={handleRenew} handleDelete={handleDelete} />
                </Table>
              </div>
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
                    }
          </Container>
        </div>
      </>
    );
};

export default withNamespaces()(Warning);
