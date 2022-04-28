import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { Row, Col, Form, FormGroup, Input, FormText, Container, Card, CardBody, CardTitle, CardHeader, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Button } from "reactstrap";
import dayJS from 'dayjs';

import ReactApexChart from 'react-apexcharts';
import Breadcrumb from 'components/Common/Breadcrumb';
import dayjs from 'dayjs';
import { Content } from 'antd/lib/layout/layout';
import taskApi from 'api/taskApi';
import { notify } from 'utils/helpers';
import DeleteModal from './DeleteModal';
import { useForm } from 'react-hook-form';


const StyledCard = styled(Card)`
    border-radius: 3px;
    margin-bottom: 15px;
    margin-left: -25px;
    .card-body {
        padding: 1rem;
    }
    .title {
        font-size: .9rem;
        font-weight: 700;
        transition: all .4s;
        &::after {
            content: '\\ed35';
            font-family: 'boxicons' !important;
            display: block;
            margin-right: 20px;
            float: right;
            transition: transform .2s;
        }

        &_active {
            &::after {
                transform: rotate(90deg);
            }
        }
    }

    .error {
        color: #f46a6a;
    }

    .disabled {
        display: none;
    }

    .invalid-feedback {
        display: block;
    }
`;
const statusSelect = [
	{ value: 19, label: 'Đang chờ' },
	{ value: 20, label: 'Đang thực hiện' },
	{ value: 21, label: 'Đã hoàn thành' },
];
const now = new Date();
const TaskDetail = (props) => {
	const {
		errors,
		watch,
		trigger,
		register,
		setValue,
		handleSubmit,
	} = useForm();
	const { onRefresh, del } = props;
	const { data } = props;
	const [modalDelete, setModalDelete] = useState(undefined);
	const status = data?.status?.id;
	const GetShortName = (data) => {
		let matches = data.match(/[A-Z]/g);
		let filterMatches = matches.map((item, index) => {
			if (index === 0 || index === matches.length - 1) {
				return item
			}
		})
		return filterMatches.join('');
	}
	const handleSelect = async (status) => {
		try {
			await taskApi.changeStatus(data.id, {
				taskID: data.id,
				statusID: status,
				time: dayJS(now).format('YYYY-MM-DD'),
			});
			notify('success', 'Đã cập nhật.');
			onRefresh();
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}

	}
	const onSubmit = (d) => {
		console.log(d);
	}
	useEffect(() => {
		register('comment');
	}, [register]);
	return (
		<React.Fragment>
			<div className="">
				<Container fluid>
					{/* Render Breadcrumbs */}
					<Row>
						<Col lg={12}>
							<StyledCard>
								<CardTitle className="ml-4 mt-3" >
									<Row>
										<Col xs={10}>{data?.title ?? ''}</Col>
										<Col xs={2}>
											<Button color="danger" style={{ padding: '5px 8px', right: '5px', display: del ? 'block' : 'none' }} onClick={() => setModalDelete(data)}><i className="bx bx-trash"></i></Button>
										</Col>
									</Row>


									<div className='mt-2'>
										{
											status === 19 ?
												<div className='d-flex'>
													<Button color='primary' className='mr-2' onClick={() => handleSelect(20)}>Đang thực hiện</Button>
													<Button color='success' onClick={() => handleSelect(21)}>Đã hoàn thành</Button>
												</div >
												: status === 20 ?
													<div className='d-flex'>
														<Button color='secondary' className='mr-2' onClick={() => handleSelect(19)}>Chờ thực hiện</Button>
														<Button color='success' onClick={() => handleSelect(21)}>Đã hoàn thành</Button>
													</div>
													:
													<div className='d-flex'>
														<Button color='secondary' className='mr-2' onClick={() => handleSelect(19)}>Chờ thực hiện</Button>
														<Button color='primary' onClick={() => handleSelect(20)}>Đang thực hiện</Button>
													</div>
										}

									</div>
								</CardTitle>
								<CardBody >
									<div className="table-responsive">
										<table className="table table-nowrap table-centered mb-0">
											<tbody>
												<tr>
													<td className='d-flex'>
														<div style={{ width: '150px' }}>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-muted">Được tạo ngày </Link></h5>
														</div>
														<div>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{dayjs(data?.beginDate).format('DD/MM/YYYY')}</Link></h5>
														</div>
													</td>
												</tr>
												<tr>
													<td className='d-flex'>
														<div style={{ width: '150px' }}>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-muted">Hạn kết thúc</Link></h5>
														</div>
														<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{dayjs(data?.endDate).format('DD/MM/YYYY')}</Link></h5>
														<div>
														</div>
													</td>
												</tr>
												<tr>
													<td className='d-flex'>
														<div style={{ width: '150px' }}>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-muted">Nội dung</Link></h5>
														</div>
														<div>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{data?.content}</Link></h5>
														</div>
													</td>
												</tr>
												<tr>
													<td className='d-flex'>
														<div style={{ width: '150px' }}>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-muted">Người phụ trách</Link></h5>
														</div>
														<div>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{data?.member[0]?.memberInfo?.tenNhanVien}</Link></h5>
														</div>
													</td>
												</tr>
												<tr>
													<td >
														<div style={{ width: '150px' }}>
															<h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-muted">Comment:</Link></h5>
														</div>
														<div className='mt-2'>
															<Form onSubmit={handleSubmit((d) => onSubmit(d))}>
																<FormGroup>
																	<Input
																		type="textarea"
																		className={classnames('form-control', { 'is-invalid': !!errors.comment })}
																		defaultValue={watch('comment') || ''}
																		onBlur={({ target: { value } }) => {
																			setValue('comment', value);
																			trigger('comment');
																		}}
																	>
																	</Input>
																</FormGroup>
																<div className="d-flex justify-content-end">
																	<Button type='submit' color='info'>Gửi</Button>
																</div>

															</Form>

														</div>
													</td>
												</tr>
											</tbody>

										</table>
									</div>
								</CardBody>
							</StyledCard>

						</Col>
					</Row>
					<DeleteModal
						data={modalDelete}
						onRefresh={onRefresh}
						onClose={() => setModalDelete(undefined)}
					/>
				</Container>
			</div>
		</React.Fragment>
	);
}

export default TaskDetail;