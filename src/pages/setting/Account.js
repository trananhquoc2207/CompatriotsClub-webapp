import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
} from 'reactstrap';

// Component
import toastr from 'toastr';
import Toolbox from 'components/Toolbox';
import Pagination from 'components/Pagination';
import CustomToolTip from 'components/CustomToolTip';
import LoadingIndicator from 'components/LoadingIndicator';
import AsyncSelect from 'react-select/async';

// CSS
import 'toastr/build/toastr.min.css';

// i18n
import { withNamespaces } from 'react-i18next';

// API
import accountApi from 'api/accountApi';
import employeeApi from 'api/employeeApi';

const TableBody = (props) => {
  const { data, handleCheckBox, handleChangePassword, handleDelete } = props;

  return (
    <tbody>
      { (!data || data.length < 1)
        ? <tr><td colSpan={8} className="text-center">{props.t('No information')}</td></tr>
        : props.data.map((item, idx) => {
          const { id, userName, accountType, displayName, email, employee, isChecked } = item;

          return (
            <tr className={classNames({ 'bg-green': isChecked })} key={`account_${idx}`}>
              <td>
                <div className="custom-control custom-checkbox">
                  <Input type="checkbox" className="custom-control-input" id={`checkbox_${id}`} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                  <Label className="custom-control-label" htmlFor={`checkbox_${id}`}>&nbsp;</Label>
                </div>
              </td>
              <td className="text-left">
                {userName}
              </td>
              <td className="text-left">
                {displayName}
              </td>
              <td className="text-center">
                {accountType}
              </td>
              <td className="text-center">
                {email}
              </td>
              {/* <td className="text-center">
                { phoneNumber }
              </td> */}
              <td className="text-center">
                {(employee !== null ? employee.tenNV : '-')}
              </td>
              <td className="text-center">
                <span id={`edit_${idx}`} className="mr-2" onClick={(event) => handleChangePassword(event)}><i className="bx bx-xs bx-key" /></span>
                <CustomToolTip id={`edit_${idx}`} message={props.t('Change password')} />

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

const Account = (props) => {
  // Loading
  const [loading, setLoading] = useState(false);

  // Form
  const { register, watch, errors, control, handleSubmit } = useForm({ shouldFocusError: false });

  // Modal
  const [modalAdd, setModalAdd] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState({
    isShow: false,
    id: -1,
    userName: '',
  });
  const [modalEdit, setModalEdit] = useState({
    isShow: false,
    isSearched: false,
    information: {
      id: -1,
      code: '',
      name: '',
      position: '',
      department: '',
    },
    account: {
      id: -1,
      userName: '',
      displayName: '',
      accountType: '',
      email: '',
      phoneNumber: '',
      employee: null,
    },
  });
  const [modalDelete, setModalDelete] = useState({
    isShow: false,
    id: null,
  });

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
    limit: 10,
    totalRows: 1,
  });

  // Data
  const [data, setData] = useState([]);

  // Handle
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const handleCheckBox = (event) => {
    let dataFilter = []; const nextToolBox = toolBox; let flag = false; let
{ id } = event.target;
    if (id === 'checkbox_all') {
      if (event.target.checked) { flag = true; }

      dataFilter = data.map((item) => ({ ...item, isChecked: flag }));
    } else {
      if (event.target.checked) { flag = true; }

      id = id.substr(id.indexOf('_') + 1);
      dataFilter = data.map((item) => {
        if (item.id === parseInt(id)) { return { ...item, isChecked: flag }; }

        return item;
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

    if (flag) {
      nextToolBox.search = { ...nextToolBox.search, isShow: false };
      nextToolBox.add = { ...nextToolBox.add, isShow: false };
      nextToolBox.delete = { ...nextToolBox.delete, isShow: true };
    } else {
      nextToolBox.search = { ...nextToolBox.search, isShow: true };
      nextToolBox.add = { ...nextToolBox.add, isShow: true };
      nextToolBox.delete = { ...nextToolBox.delete, isShow: false };
    }

    setData(dataFilter); setToolBox(nextToolBox);
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters, page_number: newPage,
    });
  };

  const handleSearch = (payload) => {
    if (payload.keyword !== '') { setFilters((prevState) => ({ ...prevState, keyword: payload.keyword })); }
  };

  const handleChangePassword = (event) => {
    let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
    if (isNaN(parseInt(id))) { return false; }

    setModalChangePassword({ isShow: true, id: data[id].id, userName: data[id].userName });
  };

  const handleEdit = (event) => {
    let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
    if (isNaN(parseInt(id)) || data[id] === undefined) { return false; }

    setModalEdit({ ...modalEdit, isShow: true, account: data[id] });
  };

  const handleDelete = (event) => {
    if (event === undefined) { setModalDelete({ isShow: true, id: 'all' }); } else {
      let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
      if (isNaN(parseInt(id))) { return false; }

      setModalDelete({ isShow: true, id });
    }
  };

  // Load option
  const loadOptionEmployee = async (payload) => {
    if (payload && payload !== '') {
      const params = { maNV: payload };
      const { success, data } = await employeeApi.get(params);
      if (success && data.length > 0) {
        return data.slice(0, 5).map((item) => ({ value: item.id, label: `${item.maNV} - ${item.tenNV}` }));
      }
    }

    return false;
  };

  // Validate
  const isRegisteredAccount = async (payload) => {
    if ((payload !== modalEdit.account.userName && modalEdit.isShow) || modalAdd) {
      const response = await accountApi.isValidUsername(payload);
      if (!response) { return false; }
    }

    return true;
  };

  const isRegisteredEmail = async (payload) => {
    if ((payload !== modalEdit.account.email && modalEdit.isShow) || modalAdd) {
      const response = await accountApi.isValidEmail(payload);
      if (!response.success) { return false; }
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

  const addAccount = async (payload) => {
    /* Modal */
    setModalAdd(false);

    if (payload && payload.employee !== null) {
      const params = {
        username: payload.username,
        password: payload.password,
        displayName: payload.displayName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        nhanVienId: payload.employee.value,
      };

      await accountApi
        .post(params)
        .then(() => {
          let page = Math.ceil(pagination.totalRows / pagination.limit);
          if (data.length === pagination.limit) page += 1;

          setFilters((prevState) => ({ ...prevState, page_number: page }));
          notify('success', props.t('Added.'));
        })
        .catch((error) => notify('danger', error));
    } else { notify('danger', props.t('Something went wrong, please contact our support team.')); }
  };

  const changePassword = async (payload) => {
    /* Modal */
    setModalChangePassword({ isShow: false, id: -1, userName: '' });

    if (payload && payload.id !== -1) {
      const params = {
        id: parseInt(payload.id),
        password: payload.password,
      };

      await accountApi
        .put(params.id, params)
        .then((repsonse) => { notify('success', props.t('Updated.')); })
        .catch((error) => notify('danger', error));
    }
  };

  const deleteAccount = async (id) => {
    if (id === 'all') {
      const requests = [];
      data.forEach((item) => {
        if (item.isChecked) {
          requests.push(accountApi
            .delete(item.id)
            .catch((error) => { notify('danger', props.t('Can\'t delete account #') + item.code); }));
        }
      });

      await Promise
        .all(requests)
        .then(() => {
          let page = filters.page_number;
          if (data.length < 2 && page > 1) page -= 1;

          setFilters((prevState) => ({ ...prevState, page_number: page }));
          notify('success', props.t('Deleted.'));
        })
        .catch((error) => { notify('danger', error); });
    } else if (data[id] !== undefined) {
      await accountApi
        .delete(data[id].id)
        .then(() => {
          let page = filters.page_number;
          if (data.length < 2 && page > 1) page -= 1;

          setFilters((prevState) => ({ ...prevState, page_number: page }));
          notify('success', props.t('Deleted.'));
        })
        .catch((error) => notify('danger', error));
    } else { notify('danger', props.t('Account ID not found')); }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page_number: filters.page_number, page_size: filters.page_size };
      if (filters.keyword !== '') { params.Keyword = filters.keyword; }

      const response = await accountApi.getAll(params);
      const dataFetch = response.data.map((item) => ({
          id: item.id,
          userName: item.userName,
          displayName: item.displayName,
          accountType: 'ADMIN',
          email: item.email,
          phoneNumber: item.phoneNumber,
          employee: item.nhanVien,
          isChecked: false,
        }));

      setPagination({
        page: response.meta.page_number,
        limit: response.meta.page_size,
        totalRows: response.meta.total,
      });

      setData(dataFetch); setLoading(false);
    } catch (error) {
      setLoading(false); notify('danger', error);
    }
  };

  const init = () => {
    const nextToolBox = toolBox;
    nextToolBox.search = {
      isShow: true,
      value: '',
      handle: handleSearch,
    };

    nextToolBox.add = {
      isShow: true,
      handle: () => { setModalAdd(true); },
    };

    nextToolBox.delete = {
      isShow: false,
      handle: handleDelete,
    };

    setToolBox(nextToolBox);
  };

  useEffect(() => {
    init();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {loading ? <LoadingIndicator /> :
          <>
            <Row>
              <Col>
                <Row>
                  <Col sm={6} md={4} xl={3}>
                    <Modal size="md" isOpen={modalAdd}>
                      <ModalHeader toggle={() => setModalAdd(false)}>
                        <span className="font-weight-bold">{props.t('Add new account')}</span>
                      </ModalHeader>
                      <ModalBody>
                        <form onSubmit={handleSubmit(addAccount)}>
                          <Row>
                            <Col md={6}>
                                <FormGroup>
                                  <Label for="username">{props.t('Account')}</Label>
                                  <Input
                                    name="username"
                                    className={errors.username ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter account')}
                                    innerRef={
                                      register({
                                        required: props.t('Account not entered'),
                                        validate: (input) => isRegisteredAccount(input) || props.t('Account is registered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="username" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                            <Col md={6}>
                                <FormGroup>
                                  <Label for="displayName">{props.t('Display name')}</Label>
                                  <Input
                                    name="displayName"
                                    className={errors.displayName ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter display name')}
                                    innerRef={
                                      register({
                                        required: props.t('Display name not entered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="displayName" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row>
                            <Col>
                                <FormGroup>
                                  <Label for="password">{props.t('Password')}</Label>
                                  <Input
                                    type="password"
                                    name="password"
                                    className={errors.password ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter password')}
                                    innerRef={
                                      register({
                                        required: props.t('Password not entered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="password" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row>
                            <Col>
                                <FormGroup>
                                  <Label for="confirmPassword">{props.t('Confirm password')}</Label>
                                  <Input
                                    type="password"
                                    name="confirmPassword"
                                    className={errors.confirmPassword ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter confirm password')}
                                    innerRef={
                                      register({
                                        required: props.t('Confirm password not entered'),
                                        validate: (input) => input === watch('password') || props.t('Confirm password not match'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="confirmPassword" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row>
                            <Col>
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
                            <Col md={6}>
                                <FormGroup>
                                  <Label for="email">{props.t('Email')}</Label>
                                  <Input
                                    name="email"
                                    className={errors.email ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter email')}
                                    innerRef={
                                      register({
                                        required: props.t('Email not entered'),
                                        pattern: {
                                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                          message: props.t('Email is invalid'),
                                        },
                                        validate: (input) => isRegisteredEmail(input) || props.t('Email is registered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="email" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                            <Col md={6}>
                                <FormGroup>
                                  <Label for="phoneNumber">{props.t('Phone number')}</Label>
                                  <Input
                                    name="phoneNumber"
                                    className={errors.phoneNumber ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter phone number')}
                                    innerRef={
                                      register({
                                        required: props.t('Phone number not entered'),
                                        pattern: {
                                          value: /^0[0-9]\d{8}$/,
                                          message: props.t('Phone number is invalid'),
                                        },
                                      })
                                    }
                                  />
                                  <ErrorMessage name="phoneNumber" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>

                          <Button type="submit" color="success">{props.t('Add')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => setModalAdd(false)}>{props.t('Cancel')}</Button>
                        </form>
                      </ModalBody>
                    </Modal>
                    <Modal size="sm" isOpen={modalChangePassword.isShow}>
                      <ModalHeader toggle={() => setModalChangePassword({ isShow: false, id: -1, userName: '' })}>
                        <span className="font-weight-bold">{`${props.t('Change password')} #${modalChangePassword.userName !== '' ? modalChangePassword.userName : 'ID'}`}</span>
                      </ModalHeader>
                      <ModalBody>
                        <form onClick={handleSubmit(changePassword)}>
                          <Row>
                            <Col md={12}>
                                <FormGroup>
                                  <Label for="changePassword">{props.t('Password')}</Label>
                                  <Input
                                    type="password"
                                    name="password"
                                    className={errors.password ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter password')}
                                    innerRef={
                                      register({
                                        required: props.t('Password not entered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="password" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                            <Col md={12}>
                                <FormGroup>
                                  <Label for="confirmPassword">{props.t('Confirm password')}</Label>
                                  <Input
                                    type="password"
                                    name="confirmPassword"
                                    className={errors.confirmPassword ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter confirm password')}
                                    innerRef={
                                      register({
                                        validate: (input) => input === watch('password') || props.t('Confirm password not match'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="confirmPassword" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>

                          <Input className="d-none" name="id" value={modalChangePassword.id} innerRef={register({ required: true })} readOnly />
                          <Button type="submit" color="success">{props.t('Update')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => setModalChangePassword({ isShow: false, id: -1, userName: '' })}>{props.t('Cancel')}</Button>
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
                        <Button type="button" color="danger" size="md" onClick={() => { deleteAccount(modalDelete.id); setModalDelete({ isShow: false, id: null }); }}>
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
                        <th style={{ width: '20px' }}>
                          <div className="custom-control custom-checkbox">
                            <Input type="checkbox" className="custom-control-input" id="checkbox_all" onChange={(event) => handleCheckBox(event)} />
                            <Label className="custom-control-label" htmlFor="checkbox_all">&nbsp;</Label>
                          </div>
                        </th>
                        <th className="text-left">{props.t('Account')}</th>
                        <th className="text-left">{props.t('Display name')}</th>
                        <th className="text-center">{props.t('Account type')}</th>
                        <th className="text-center">{props.t('Email')}</th>
                        {/* <th className="text-center">{ props.t('Phone number') }</th> */}
                        <th className="text-center">{capitalizeFirstLetter(props.t('Employee'))}</th>
                        <th className="text-center" style={{ width: '50px' }}>{props.t('Action')}</th>
                      </tr>
                    </thead>
                    <TableBody t={props.t} data={data} handleCheckBox={handleCheckBox} handleChangePassword={handleChangePassword} handleDelete={handleDelete} />
                  </Table>
                </div>
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </Col>
            </Row>
          </>
          }
        </Container>
      </div>
    </>
  );
};

export default withNamespaces()(Account);
