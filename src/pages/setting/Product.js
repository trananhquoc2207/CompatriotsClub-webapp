import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import {
  Spinner,
  Container,
  Table,
  Row,
  Col,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
  Badge,
} from 'reactstrap';

// Component
import toastr from 'toastr';
import Dropzone from 'react-dropzone';
import NumberFormat from 'react-number-format';
import Toolbox from 'components/Toolbox';
import Pagination from 'components/Pagination';
import CustomToolTip from 'components/CustomToolTip';

// CSS
import 'toastr/build/toastr.min.css';

// i18n
import { withNamespaces } from 'react-i18next';

// API
import axiosClient from 'api/axiosClient';
import productApi from 'api/productApi';
import { TOKEN, API_URL } from 'utils/contants';

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
  const numeric = (number) => {
    number += '';

    const x = number.split('.');
    let y = x[0];
    const z = x.length > 1 ? `.${x[1]}` : '';
    const rgx = /(\d+)(\d{3})/;

    while (rgx.test(y)) {
      // eslint-disable-next-line no-useless-concat
      y = y.replace(rgx, '$1' + ',' + '$2');
    }

    return y + z;
  };

  const formatCurrency = (number, currency) => `${number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} ${currency}`;

  const { data, handleCheckBox, handleEdit, handleDelete } = props;

  return (
    <tbody>
      { (!data || data.length < 1)
        ? <tr><td colSpan={6} className="text-center">{props.t('No information')}</td></tr>
        : data.map((item, idx) => {
          const { id, code, name, numberStandard, price, isChecked } = item;

          return (
            <tr className={classNames({ 'bg-green': isChecked })} key={`product_${idx}`}>
              <td>
                <div className="custom-control custom-checkbox">
                  <Input type="checkbox" className="custom-control-input" id={`checkbox_${id}`} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
                  <Label className="custom-control-label" htmlFor={`checkbox_${id}`}>&nbsp;</Label>
                </div>
              </td>
              <td className="text-left">
                {code}
              </td>
              <td className="text-left">
                {name}
              </td>
              <td className="text-right">
                {numeric(numberStandard)}
              </td>
              <td className="text-right">
                {formatCurrency(price, 'đ')}
              </td>
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

const Product = (props) => {
  // Loading
  const [loading, setLoading] = useState(false);

  // Form
  const { register, errors, control, handleSubmit } = useForm({ mode: 'all', shouldFocusError: false });

  // Modal
  const [modalImport, setModalImport] = useState({ isShow: false, file: null });
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState({
    isShow: false,
    product: {
      id: -1,
      code: '',
      name: '',
      numberStandard: 0,
      price: 0,
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

  const handleFilter = (payload) => {
    setFilters((prevState) => ({ ...prevState, keyword: payload.keyword }));
  };

  const handleAcceptedFile = (files) => {
    setModalImport((prevState) => ({ ...prevState, file: files[0] }));
  };

  const handleEdit = (event) => {
    let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
    if (isNaN(parseInt(id)) || data[id] === undefined) { return false; }

    setModalEdit({ ...modalEdit, isShow: true, product: data[id] });
  };

  const handleDelete = (event) => {
    if (event === undefined) { setModalDelete({ isShow: true, id: 'all' }); } else {
      let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
      if (isNaN(parseInt(id))) { return false; }

      setModalDelete({ isShow: true, id });
    }
  };

  // Validate
  const isRegisteredProduct = async (payload) => {
    if ((payload !== modalEdit.product.code && modalEdit.isShow) || modalAdd) {
      const response = await productApi.getAll({ maSP: payload });
      if (response && response.data.length > 0) { return props.t('Product ID is registered'); }
    }

    return true;
  };

  // Function
  const init = () => {
    const nextToolBox = toolBox;
    nextToolBox.search = {
      isShow: true,
      value: '',
      handle: handleFilter,
    };

    nextToolBox.add = {
      isShow: true,
      handle: () => { setModalAdd(true); },
    };

    nextToolBox.import = {
      isShow: true,
      handle: () => { setModalImport((prevState) => ({ ...prevState, isShow: true })); },
    };

    nextToolBox.delete = {
      isShow: false,
      handle: handleDelete,
    };

    setToolBox(nextToolBox);
  };

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
    setModalAdd(false);
    setModalEdit({ isShow: false, product: { id: -1, code: '', name: '', numberStandard: 0, price: 0 } });
    setModalDelete({ isShow: false, id: -1 });

    // Toolbox
    if (toolBox.search.isShow) {
      const nextToolBox = toolBox;
      toolBox.search.value = null;

      setToolBox(nextToolBox);
    }

    // Filter
    setFilters((prevState) => ({ ...prevState, page_number: page, keyword: '' }));
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const uploadFile = async () => {
    if (modalImport.file !== null) {
      const data = new FormData();
        const cookie = JSON.parse(localStorage.getItem(TOKEN));

      data.append('files', modalImport.file);

      /* Modal */
      setModalImport({ isShow: false, file: null });

      await axiosClient
        .post(`${API_URL}/v1/SanPham/import`, data, {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        })
        .then((response) => {
          if (response && response.success) {
            notify('success', 'Imported.');
            return;
          }

          notify('danger', response.error_message);
        })
        .catch((error) => { notify('danger', error); });
    }
  };

  const addProduct = async (payload) => {
    /* Request */
    const params = {
      maSanPham: payload.code,
      tenSanPham: payload.name,
      soLuongTieuChuan: parseFloat(payload.numberStandard.replace(/[^\d]/g, '')),
      gia: parseFloat(payload.price.replace(/[^\d]/g, '')),
    };

    await productApi
      .post(params)
      .then(() => { notify('success', props.t('Added.')); reload('add'); })
      .catch((error) => notify('danger', error));
  };

  const editProduct = async (payload) => {
    const formatNumber = (number) =>
      /[^\d]/g.test(number) ? parseFloat(number.replace(/[^\d]/g, '')) : parseFloat(number);

    if (payload.name !== modalEdit.product.name || formatNumber(payload.numberStandard) !== modalEdit.product.numberStandard || formatNumber(payload.price) !== modalEdit.product.price) {
      /* Request */
      const params = {
        id: modalEdit.product.id,
        maSanPham: modalEdit.product.code,
        tenSanPham: payload.name,
        soLuongTieuChuan: formatNumber(payload.numberStandard),
        gia: formatNumber(payload.price),
      };

      await productApi
        .put(params.id, params)
        .then(() => { notify('success', props.t('Updated.')); reload('edit'); })
        .catch((error) => notify('danger', error));
    }
  };

  const deleteProduct = async (id) => {
    if (id === 'all') {
      const requests = [];
      data.forEach((item) => {
        if (item.isChecked) {
          requests.push(productApi
            .delete(item.id)
            .catch(() => { notify('danger', props.t('Can\'t delete product #') + item.code); }));
        }
      });

      await Promise
        .all(requests)
        .then(() => { notify('success', props.t('Deleted.')); reload('delete'); })
        .catch((error) => { notify('danger', error); });
    } else if (data[id] !== undefined) {
      await productApi
        .delete(data[id].id)
        .then(() => { notify('success', props.t('Deleted.')); reload(); })
        .catch((error) => notify('danger', error));
    } else { notify('danger', props.t('Product ID not found')); }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page_number: filters.page_number, page_size: filters.page_size, tenSP: filters.keyword };

      const response = await productApi.getAll(params);
      const dataFetch = response.data.map((item) => ({
          id: item.id,
          code: item.maSanPham,
          name: item.tenSanPham,
          numberStandard: item.soLuongTieuChuan,
          price: item.gia,
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
                    <Modal size="md" isOpen={modalImport.isShow}>
                      <ModalHeader toggle={() => setModalImport({ isShow: false, file: null })}>
                        <span className="font-weight-bold">{props.t('Import file')}</span>
                      </ModalHeader>
                      <ModalBody>
                        <Row className="mb-3">
                          <Col>
                            {props.t('Please make sure this file has been properly formatted to')}
                            {' '}
                            <Badge id="formatFile" href="#" color="info" style={{ fontSize: '12px' }} onClick={() => { window.open(`${API_URL}/templates/filemau-import-sanpham.xlsx`); }} pill>{props.t('the sample file')}</Badge>
                            {' '}
                            {props.t('before importing')}
                            <CustomToolTip id="formatFile" message={props.t('Download')} />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col>
                            <Dropzone onDrop={(files) => { handleAcceptedFile(files); }}>
                                {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone">
                                    <div className="dz-message needsclick mt-2" {...getRootProps()}>
                                      <input {...getInputProps()} />
                                      <div className="mb-3 text-center">
                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                      </div>
                                      <h4 className="text-center">{props.t('Drop files here or click to upload.')}</h4>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                          </Col>
                        </Row>

                        {
                            modalImport.file === null ? null :
                              (
                                <Row className="mb-3">
                                  <Col>
                                    <Card className="mt-1 mb-0 p-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                                      <Row>
                                        <Col md={1}>
                                          <i className="bx bx-sm bx-file-blank" />
                                        </Col>
                                        <Col style={{ padding: '.2rem' }}>
                                          <span className="text-mute">{modalImport.file.name}</span>
                                          {' '}
                                          -
                                          <strong>{formatBytes(modalImport.file.size)}</strong>
                                        </Col>
                                      </Row>
                                    </Card>
                                  </Col>
                                </Row>
                              )
                          }

                        <Button type="button" color="success" onClick={() => { uploadFile(); }}>{props.t('Import')}</Button>
                        <Button type="button" className="ml-2" color="secondary" onClick={() => setModalImport({ isShow: false, file: null })}>{props.t('Cancel')}</Button>
                      </ModalBody>
                    </Modal>
                    <Modal size="sm" isOpen={modalAdd}>
                      <ModalHeader toggle={() => setModalAdd(false)}>
                        <span className="font-weight-bold">{props.t('Add new product')}</span>
                      </ModalHeader>
                      <ModalBody>
                        <Form onSubmit={handleSubmit(addProduct)}>
                          <Row>
                            <Col>
                                <FormGroup>
                                  <Label for="code" style={{ fontSize: '15px', fontWeight: '400' }}>{props.t('Product ID')}</Label>
                                  <Input
                                    name="code"
                                    className={errors.code ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter product id')}
                                    innerRef={
                                      register({
                                        required: props.t('Product ID not entered'),
                                        validate: (input) => isRegisteredProduct(input),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="code" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row>
                            <Col>
                                <FormGroup>
                                  <Label for="name" style={{ fontSize: '15px', fontWeight: '400' }}>{props.t('Product name')}</Label>
                                  <Input
                                    name="name"
                                    className={errors.name ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter product name')}
                                    innerRef={
                                      register({
                                        required: props.t('Product name not entered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col>
                                <Label for="numberStandard">{props.t('Number of standards')}</Label>
                                <Controller
                                  as={NumberFormat}
                                  name="numberStandard"
                                  control={control}
                                  className={errors.numberStandard ? 'form-control is-invalid' : 'form-control'}
                                  thousandSeparator
                                  defaultValue=""
                                  placeholder={props.t('Enter number of standard')}
                                  rules={{
                                    required: props.t('Number of standards not entered'),
                                  }}
                                />
                                <ErrorMessage name="numberStandard" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                              </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col>
                                <Label for="price">{props.t('Price')}</Label>
                                <Controller
                                  as={NumberFormat}
                                  name="price"
                                  control={control}
                                  className={errors.price ? 'form-control is-invalid' : 'form-control'}
                                  thousandSeparator
                                  defaultValue=""
                                  placeholder={props.t('Enter price')}
                                  rules={{
                                    required: props.t('Price not entered'),
                                  }}
                                />
                                <ErrorMessage name="price" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                              </Col>
                          </Row>

                          <Button type="submit" color="success">{props.t('Add')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalAdd(false); }}>{props.t('Cancel')}</Button>
                        </Form>
                      </ModalBody>
                    </Modal>
                    <Modal size="sm" isOpen={modalEdit.isShow}>
                      <ModalHeader toggle={() => setModalEdit({ isShow: false, product: { id: -1, code: '', name: '', numberStandard: 0, price: 0 } })}>
                        <span className="font-weight-bold">{`${props.t('Edit product')} #${modalEdit.product.code !== '' ? modalEdit.product.code : 'ID'}`}</span>
                      </ModalHeader>
                      <ModalBody>
                        <Form onSubmit={handleSubmit(editProduct)}>
                          <Row>
                            <Col>
                                <FormGroup>
                                  <Label for="name">{props.t('Product name')}</Label>
                                  <Input
                                    name="name"
                                    className={errors.name ? 'is-invalid' : ''}
                                    placeholder={props.t('Enter product name')}
                                    defaultValue={modalEdit.product.name}
                                    innerRef={
                                      register({
                                        required: props.t('Product name not entered'),
                                      })
                                    }
                                  />
                                  <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                                </FormGroup>
                              </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col>
                                <Label for="numberStandard">{props.t('Number of standards')}</Label>
                                <Controller
                                  as={NumberFormat}
                                  name="numberStandard"
                                  control={control}
                                  className={errors.numberStandard ? 'form-control is-invalid' : 'form-control'}
                                  thousandSeparator
                                  defaultValue={modalEdit.product.numberStandard}
                                  placeholder={props.t('Enter number of standard')}
                                  rules={{
                                    required: props.t('Number of standards not entered'),
                                  }}
                                />
                                <ErrorMessage name="numberStandard" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                              </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col>
                                <Label for="price">{props.t('Price')}</Label>
                                <Controller
                                  as={NumberFormat}
                                  name="price"
                                  control={control}
                                  className={errors.price ? 'form-control is-invalid' : 'form-control'}
                                  thousandSeparator
                                  defaultValue={modalEdit.product.price}
                                  placeholder={props.t('Enter price')}
                                  rules={{
                                    required: props.t('Price not entered'),
                                  }}
                                />
                                <ErrorMessage name="price" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                              </Col>
                          </Row>

                          <Button type="submit" color="success">{props.t('Update')}</Button>
                          <Button type="button" className="ml-2" color="secondary" onClick={() => setModalEdit({ isShow: false, product: { id: -1, code: '', name: '', numberStandard: 0, price: 0 } })}>{props.t('Cancel')}</Button>
                        </Form>
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
                        <Button type="button" color="danger" size="md" onClick={() => { deleteProduct(modalDelete.id); }}>
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
                        <th className="text-left">{props.t('Product ID')}</th>
                        <th className="text-left">{props.t('Product name')}</th>
                        <th className="text-right">{props.t('Number of standards')}</th>
                        <th className="text-right">{props.t('Price')}</th>
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
    </>
  );
};

export default withNamespaces()(Product);
