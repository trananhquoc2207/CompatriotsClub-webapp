import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import dayJS from 'dayjs';
import vi from 'date-fns/locale/vi';
import {
  Container,
  Table,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap';

// Component
import toastr from 'toastr';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker, { registerLocale } from 'react-datepicker';
import NumberFormat from 'react-number-format';
import Toolbox from '../../components/Toolbox';
import Pagination from '../../components/Pagination';
import MultipleInput from '../../components/MultipleInput';
import CustomToolTip from '../../components/CustomToolTip';
import LoadingIndicator from '../../components/LoadingIndicator';

// CSS
import 'toastr/build/toastr.min.css';

// i18n
import { withNamespaces } from 'react-i18next';

// API
import contractApi from '../../api/contractApi';
import allowanceApi from '../../api/allowanceApi';
import employeeApi from '../../api/employeeApi';
import dayjs from 'dayjs';

// Config
registerLocale('vi', vi);

const TableBody = (props) => {
  const formatCurrency = (number, currency) => `${number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} ${currency}`;

  const { data, handleCheckBox, handleEdit, handleDelete } = props;
  const statusType = ['Not yet', 'In during term of contract', 'Expired contract'];

  return (
    <tbody>
      {(!data || data.length < 1)
        ? <tr><td colSpan={9} className="text-center">{props.t('No information')}</td></tr>
        : data.map((item, idx) => {
          const { id, contractID, contractType, beginDate, endDate, wage, employee, status, isChecked } = item;

          return (
            <tr className={classNames({ 'bg-green': isChecked })} key={`contract_${id}`}>
              <td style={{ width: '20px' }}>
                <div className="custom-control custom-checkbox">
                  <Input type="checkbox" className="custom-control-input" id={`checkbox_${id}`} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                  <Label className="custom-control-label" htmlFor={`checkbox_${id}`}>&nbsp;</Label>
                </div>
              </td>
              <td className="text-left">{contractID}</td>
              <td className="text-left">{contractType?.tenLoaiHopDong}</td>
              <td className="text-left">{employee.name}</td>
              <td className="text-right">{formatCurrency(wage, 'đ')}</td>
              <td className="text-center">{dayJS(beginDate).format('DD/MM/YYYY')}</td>
              <td className="text-center">{dayJS(endDate).format('DD/MM/YYYY')}</td>
              <td className="text-left">{props.t(statusType[status])}</td>
              <td className="text-center">
                <span id={`edit_${idx}`} className="mr-2" onClick={(event) => handleEdit(event)}><i className="bx bx-xs bx-pencil" /></span>
                <CustomToolTip id={`edit_${idx}`} message={props.t('Edit')} />

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

const List = (props) => {
  // Active tab
  const [activeTab, setActiveTab] = useState(0);

  // Loading
  const [loading, setLoading] = useState(false);

  // Form
  const { register, watch, errors, control, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });

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
    keyword: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalRows: 1,
  });

  // Modal
  const [modalAdd, setModalAdd] = useState(false);

  const [modalEdit, setModalEdit] = useState({
    isShow: false,
    contract: {
      id: -1,
      contractID: '',
      contractType: -1,
      startDate: '',
      endDate: '',
      wage: 0,
      allowance: {},
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

  const [navList, setNavList] = useState([{ name: 'All', type: 'state', id: 0, value: 0 }]);

  const [contractType, setContractType] = useState([]);

  let dataAdd = {}; let dataEdit = {};

  // Handle
  const handleChangePanel = (idx) => {
    setActiveTab(idx); reload();
  };

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
      nextToolBox.add.isShow = false;
      nextToolBox.delete.isShow = true;
    } else {
      nextToolBox.search.isShow = true;
      nextToolBox.delete.isShow = false;
      if (activeTab !== 3) { nextToolBox.add.isShow = true; }
    }

    setData(dataFilter); setToolBox(nextToolBox);
  };

  const handleMultipleInput = (payload) => {
    if (modalAdd) { dataAdd = payload; } else if (modalEdit.isShow) {
      dataEdit = payload;
    }
  };

  const handleAdd = () => {
    setModalAdd(true);
  };

  const handleEdit = async (event) => {
    let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
    if (isNaN(parseInt(id)) || data[id] === undefined) { return false; }

    let allowance = [];
    const response = await allowanceApi.get(data[id].id);
    if (response && response && response.data.length > 0) {
      allowance = response.data.map((item) => {
        const array = {};
        Object.keys(item).forEach((key) => {
          array[key] = item[key];
        });

        return array;
      });
    }

    setModalEdit({ isShow: true, contract: { ...data[id], allowance } });
  };

  const handleDelete = (event) => {
    if (event === undefined) { setModalDelete({ isShow: true, id: 'all' }); } else {
      let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
      if (isNaN(parseInt(id))) { return false; }

      setModalDelete({ isShow: true, id });
    }
  };

  const handleFilter = (filter) => {
    setFilters({ ...filters, keyword: filter.keyword });
  };

  // Load option
  const loadOptionEmployee = async (payload) => {
    if (payload && payload !== '') {
      const params = { maNV: payload };
      const { data } = await employeeApi.get(params);
      if (data.success && data.length > 0) {
        return data.slice(0, 5).map((item) => ({ value: item.id, label: `${item.maNV} - ${item.tenNV}` }));
      }
    }

    return false;
  };

  // Validate
  const isExistContractID = async (id) => {
    if ((id !== modalEdit.contract.contractID && modalEdit.isShow) || modalAdd) {
      try {
        const params = { soHD: id };
        const response = await contractApi.getAll(params);
        if (response && response.success && response.data.length > 0) { return props.t('Contract ID is registered'); }
      } catch (error) {
        notify('danger', error); return props.t('Something wrong');
      }
    }

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

  const reload = (type) => {
    let page = Math.ceil(pagination.totalRows / pagination.limit);
    if (data.length >= pagination.limit) {
      if (type === 'add') page += 1;
      if (type === 'edit') page -= 1;
      else if (type === 'delete') page -= 1;
    }

    // Modal
    setModalAdd(false);
    setModalEdit({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, employee: { id: -1, code: '', name: '' } } });
    setModalDelete({ isShow: false, id: -1 });

    // Filter
    setFilters((prevState) => ({ ...prevState, page_number: page, keyword: '' }));
  };

  const addContract = async (payload) => {
    /* Param */
    const paramsContract = {
      soHopDong: payload.contractID,
      idNhanVien: payload.employee.value,
      ngayHieuLuc: dayjs(payload.beginDate).format('YYYY-MM-DD'),
      ngayKetThuc: dayjs(payload.endDate).format('YYYY-MM-DD'),
      idLoaiHopDong: payload.contractType.value,
      mucLuong: parseFloat(payload.wage.replace(/[^\d]/g, '')),
    };

    /* Reset */
    setModalAdd(false);

    /* Request Create Contract */
    let contractID = -1;
    await contractApi
      .post(paramsContract)
      .then((response) => {
        if (response && response.id) { contractID = response.id; }
        reload('delete'); notify('success', props.t('Added.'));
      })
      .catch((error) => { notify('danger', error); });

    /* Request Create Allowance */
    if (Object.keys(dataEdit).length > 0 && contractID !== -1) {
      const paramsAllowance = Object.keys(dataAdd).map((key) => {
        let price = dataAdd[key].soTien;
        if (typeof price === 'string') { price = 0; }

        return { ...dataAdd[key], idHopDong: contractID, soTien: price };
      });

      allowanceApi
        .post(paramsAllowance)
        .catch((error) => { notify('danger', error); });
    }

    /* Reset */
    dataAdd = {};
  };

  const editContract = async (payload) => {
    /* Params */
    const paramsContract = {
      id: modalEdit.contract.id,
      soHopDong: modalEdit.contract.contractID,
      idNhanVien: payload.employee.value,
      ngayHieuLuc: dayJS(payload.beginDate).format('YYYY-MM-DD'),
      ngayKetThuc: dayJS(payload.endDate).format('YYYY-MM-DD'),
      idLoaiHopDong: payload.contractType.value,
      mucLuong: /[^\d]/g.test(payload.wage) ? parseFloat(payload.wage.replace(/[^\d]/g, '')) : parseFloat(payload.wage),
    };

    /* Reset */
    setModalEdit({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: {}, employee: { id: -1, code: '', name: '' } } });

    /* Request */
    await contractApi
      .put(paramsContract.id, paramsContract)
      .then(() => { reload('edit'); notify('success', props.t('Updated.')); })
      .catch((error) => { notify('danger', error); });

    /* Request Edit Allowance */
    if (Object.keys(dataEdit).length > 0) {
      const paramsAllowance = Object.keys(dataEdit).map((key) => {
        let price = dataEdit[key].soTien;
        if (typeof price === 'string') { price = 0; }

        return { ...dataEdit[key], idHopDong: paramsContract.id, soTien: price };
      });

      allowanceApi
        .put(paramsContract.id, paramsAllowance)
        .catch((error) => { notify('danger', error); });
    }

    /* Reset */
    dataEdit = {};
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
        .delete(data[id].id)
        .then(() => { reload('delete'); notify('success', props.t('Deleted.')); })
        .catch((error) => { notify('danger', props.t(error)); });
    }
  };

  const fetchContract = async () => {
    setLoading(true);
    const params = { page_size: filters.page_size, page_number: filters.page_number, q: filters.keyword };
    if (navList[activeTab].type === 'state') {
      if (navList[activeTab].name !== 'All') { params.state = navList[activeTab].id; }
    } else if (navList[activeTab].type === 'type') {
      params.loaiHopDong = navList[activeTab].id;
    }

    try {
      const response = await contractApi.getAll(params);
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
            contractID: item.soHopDong,
            contractType: item.loaiHopDong,
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

        setData(dataFormat); setLoading(false);
      }
    } catch (error) {
      notify('danger', error); setLoading(false);
    }
  };

  const fetchContractType = () => contractApi
    .getType()
    .then((response) => {
      if (response.success) return response.data.map((item) => ({ label: item.tenLoaiHopDong, value: item.id }));
    })
    .catch((error) => notify('danger', error));

  const fetchTotalContractType = (contractType) => {
    if (contractType.length > 0) {
      const requests = [];
      contractType.forEach((contract) => {
        const params = {};
        if (contract.type === 'state') {
          if (contract.name !== 'All') { params.state = contract.id; }
        } else if (contract.type === 'type') {
          params.loaiHopDong = contract.id;
        }

        requests.push(contractApi.getAll(params));
      });

      return Promise
        .all(requests)
        .then((results) => {
          const total = {};
          results.forEach((result, idx) => {
            if (result.success) { total[idx] = result.meta.total; }
          });

          return total;
        })
        .catch((error) => ({}));
    }
  };

  const init = async () => {
    /* Toolbox */
    const nextToolBox = toolBox;
    nextToolBox.search = {
      ...nextToolBox.search,
      isShow: true,
      handle: handleFilter,
    };

    nextToolBox.add = {
      isShow: true,
      handle: handleAdd,
    };

    nextToolBox.delete = {
      isShow: false,
      handle: () => { setModalDelete({ isShow: true, id: 'all' }); },
    };

    setToolBox(nextToolBox);
  };

  useEffect(() => {
    const doInit = async () => {
      /* Fetch contract type */
      const nextContractType = await fetchContractType();
      /* Build nav list */
      if (nextContractType.length > 0) {
        const dataFormat = [{ name: 'All', type: 'state', id: 0, value: 0 }];
        nextContractType.forEach((item) => { dataFormat.push({ name: item.label, type: 'type', id: item.value, value: 0 }); });
        dataFormat.push({ name: 'Expired', type: 'state', id: dataFormat.length, value: 0 });

        const total = await fetchTotalContractType(dataFormat); const keys = Object.keys(total);
        for (let i = 0; i < keys.length; i++) {
          if (dataFormat[keys[i]] && dataFormat[keys[i]] !== undefined) { dataFormat[keys[i]].value = total[keys[i]]; }
        }

        setContractType(nextContractType); setNavList(dataFormat);
      }
    };

    doInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
    fetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <div className="nav-panel">
        <Card className="mb-0" style={{ boxShadow: 'none' }}>
          <CardBody className="p-0">
            <Nav tabs className="nav-tabs-custom m-0 px-3">
              {
                navList.map((item, idx) => (
                  <NavItem key={`nav_${idx}`}>
                    <NavLink style={{ cursor: 'pointer' }} className={classNames({ active: idx === activeTab })} onClick={(event) => handleChangePanel(idx)}>
                      <span className="d-none d-sm-block" style={{ fontWeight: '600' }}>{props.t(item.name) + (item.value !== null ? ` (${item.value})` : null)}</span>
                    </NavLink>
                  </NavItem>
                ))
              }
            </Nav>
          </CardBody>
        </Card>
      </div>
      <div className="panel-content">
        <Container fluid>
          {loading ? <LoadingIndicator /> :
          <>
            <Toolbox t={props.t} option={toolBox} />
            <Col sm={6} md={4} xl={3}>
              <Modal size="md" isOpen={modalAdd}>
                <ModalHeader toggle={() => setModalAdd(false)}>
                  <span className="font-weight-bold">{props.t('Add new contract')}</span>
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit(addContract)}>
                    <Row>
                      <Col>
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
                                      required: props.t('Contract id not entered'),
                                      validate: (input) => isExistContractID(input),
                                    })
                                  }
                                />
                              <ErrorMessage name="contractID" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                            </FormGroup>
                          </Col>
                          <Col md={8}>
                            <FormGroup>
                              <Label for="employee">{props.t('Employee')}</Label>
                              <Controller
                                  as={AsyncSelect}
                                  name="employee"
                                  control={control}
                                  styles={{
                                    control: (base, state) => (
                                      errors.employee
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
                                  cacheOptions
                                  loadOptions={loadOptionEmployee}
                                  noOptionsMessage={() => props.t('Employee not found')}
                                  loadingMessage={() => props.t('Searching...')}
                                  placeholder={props.t('Enter employee ID')}
                                  defaultValue=""
                                  rules={{
                                    required: props.t('Employee not entered'),
                                  }}
                                />
                              <ErrorMessage
                                  name="employee"
                                  errors={errors}
                                  render={({ message }) =>
                                  (<div style={{ width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                    {message}
                                   </div>)
                                  }
                                />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
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
                              <ErrorMessage
                                  name="contractType"
                                  errors={errors}
                                  render={({ message }) =>
                                  (<div style={{ width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                    {message}
                                   </div>)
                                  }
                                />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col md={6}>
                            <Label for="beginDate">{props.t('Begin date')}</Label>
                            <Controller
                              name="beginDate"
                              control={control}
                              valueName="selected"
                              defaultValue={new Date()}
                              rules={{ required: props.t('Begin date not entered') }}
                              render={({ onChange, onBlur, value, name }) =>
                                (<DatePicker
                                  name={name}
                                  className={errors.beginDate ? 'form-control is-invalid' : 'form-control'}
                                  locale="vi"
                                  dateFormat="dd/MM/yyyy"
                                  autocomplete="off"
                                  selected={value}
                                  onChange={(time) => onChange(time)}
                                />)
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
                                (<DatePicker
                                  name={name}
                                  className={errors.endDate ? 'form-control is-invalid' : 'form-control'}
                                  locale="vi"
                                  dateFormat="dd/MM/yyyy"
                                  autocomplete="off"
                                  selected={value}
                                  onChange={(time) => onChange(time)}
                                />)
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
                            <Controller
                              as={NumberFormat}
                              name="wage"
                              control={control}
                              className={errors.wage ? 'form-control is-invalid' : 'form-control'}
                              thousandSeparator
                              defaultValue=""
                              placeholder={props.t('Enter wage')}
                              rules={{
                                  required: props.t('Wage not entered'),
                                }}
                            />
                            <ErrorMessage name="wage" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
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
                            />
                          </Col>
                        </Row>

                        <div className="d-flex">
                          <Button type="submit" color="success">{props.t('Add')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalAdd(false); }}>{props.t('Cancel')}</Button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </ModalBody>
              </Modal>
              <Modal size="md" isOpen={modalEdit.isShow && modalEdit.contract.id !== -1}>
                <ModalHeader toggle={() => { setModalEdit({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: {}, employee: { id: -1, code: '', name: '' } } }); }}>
                  <span className="font-weight-bold">{`${props.t('Edit contract')} #${modalEdit.contract.contractID !== '' ? modalEdit.contract.contractID : 'ID'}`}</span>
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit(editContract)}>
                    <Row>
                      <Col>
                        <Row className="mb-3">
                          <Col>
                            <span style={{ fontSize: '15px', fontWeight: '600' }}>{props.t('Information')}</span>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="contractID">{props.t('Contract ID')}</Label>
                              <Input name="contractID" value={modalEdit.contract.contractID} disabled />
                            </FormGroup>
                          </Col>
                          <Col md={8}>
                            <FormGroup>
                              <Label for="employee">{props.t('Employee')}</Label>
                              <Controller
                                  as={AsyncSelect}
                                  name="employee"
                                  control={control}
                                  styles={{
                                    control: (base, state) => (
                                      errors.employee
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
                                  cacheOptions
                                  loadOptions={loadOptionEmployee}
                                  noOptionsMessage={() => props.t('Employee not found')}
                                  loadingMessage={() => props.t('Searching...')}
                                  placeholder={props.t('Enter employee ID')}
                                  defaultValue={{
                                    label: `${modalEdit.contract.employee.code} - ${modalEdit.contract.employee.name}`,
                                    value: modalEdit.contract.employee.id,
                                  }}
                                  rules={{
                                    required: props.t('Employee not entered'),
                                  }}
                                />
                              <ErrorMessage
                                  name="employee"
                                  errors={errors}
                                  render={({ message }) =>
                                  (<div style={{ width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                    {message}
                                   </div>)
                                  }
                                />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
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
                                  defaultValue={{
                                    label: modalEdit.contract.contractType.tenLoaiHopDong,
                                    value: modalEdit.contract.contractType.id,
                                  }}
                                />
                              <ErrorMessage
                                  name="contractType"
                                  errors={errors}
                                  render={({ message }) =>
                                  (<div style={{ width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                                    {message}
                                   </div>)
                                  }
                                />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col md={6}>
                            <Label for="beginDate">{props.t('Begin date')}</Label>
                            <Controller
                              name="beginDate"
                              control={control}
                              valueName="selected"
                              defaultValue={new Date(modalEdit.contract.beginDate)}
                              rules={{ required: props.t('Begin date not entered') }}
                              render={({ onChange, onBlur, value, name }) =>
                                (<DatePicker
                                  name={name}
                                  className={errors.beginDate ? 'form-control is-invalid' : 'form-control'}
                                  locale="vi"
                                  dateFormat="dd/MM/yyyy"
                                  autocomplete="off"
                                  selected={value}
                                  onChange={(time) => onChange(time)}
                                />)
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
                              defaultValue={new Date(modalEdit.contract.endDate)}
                              rules={{
                                  required: props.t('End date not entered'),
                                  validate: (payload) => {
                                    if (dayJS(watch('beginDate')).unix() > dayJS(payload).unix()) return props.t('End date is invalid');

                                    return true;
                                  },
                                }}
                              render={({ onChange, onBlur, value, name }) =>
                                (<DatePicker
                                  name={name}
                                  className={errors.endDate ? 'form-control is-invalid' : 'form-control'}
                                  locale="vi"
                                  dateFormat="dd/MM/yyyy"
                                  autocomplete="off"
                                  selected={value}
                                  onChange={(time) => onChange(time)}
                                />)
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
                            <Controller
                              as={NumberFormat}
                              name="wage"
                              control={control}
                              className={errors.wage ? 'form-control is-invalid' : 'form-control'}
                              thousandSeparator
                              defaultValue={modalEdit.contract.wage}
                              placeholder="Enter wage"
                              rules={{
                                  required: props.t('Wage not entered'),
                                }}
                            />
                            <ErrorMessage name="wage" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
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
                              defaultData={modalEdit.contract.allowance}
                            />
                          </Col>
                        </Row>

                        <div className="d-flex">
                          <Button type="submit" color="success">{props.t('Update')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalEdit({ isShow: false, contract: { id: -1, contractID: '', contractType: -1, startDate: '', endDate: '', wage: 0, allowance: {}, employee: { id: -1, code: '', name: '' } } }); }}>{props.t('Cancel')}</Button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </ModalBody>
              </Modal>
              <Modal size="sm" isOpen={modalDelete.isShow} style={{ top: '100px', maxWidth: '350px' }}>
                <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
                  <div style={{ margin: '15px auto', textAlign: 'center' }}>
                    <i className="bx bxs-x-circle" style={{ color: '#f15e5e', fontSize: '80px' }} />
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
                <TableBody t={props.t} data={data} handleCheckBox={handleCheckBox} handleEdit={handleEdit} handleDelete={handleDelete} />
              </Table>
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
          }
        </Container>
      </div>
    </>
  );
};

export default withNamespaces()(List);
