import React, { useState, useEffect } from 'react';
import {
	Spinner,
	Container,
	Row,
	Col,
	Button,
	Form, FormGroup, FormFeedback, Input
} from 'reactstrap';

// Component
import toastr from 'toastr';
//i18n
import { withNamespaces } from 'react-i18next';
// API
import Loader from 'components/Loader';
import { getTemperature } from '../actions/temperature';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import ratedTemperatureApi from 'api/ratedTemperature';
import { notify } from 'utils/helpers';


const SettingInsurance = (props) => {
	const {
		errors,
		watch,
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
	} = useForm();
	const onSubmit = async (d) => {
		try {
			await ratedTemperatureApi.put(parseFloat(d.ratedTemperature).toFixed(1));
			notify('success', 'Đã cập nhật.');
			handleRefresh();
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	};

	const dispatch = useDispatch();
	const { ratedTemperature, getRatedTemperatureLoading } = useSelector((s) => s.ratedTemperature);
	const { data } = ratedTemperature;
	const handleRefresh = () => {
		dispatch(getTemperature());
	};
	useEffect(() => {
		handleRefresh();
	}, []);
	useEffect(() => {
		register('ratedTemperature', { required: 'Chưa nhập nhiệt độ định mức' });
	}, [register, setValue]);
	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid>
					{
						<>
							<Loader inverted active={getRatedTemperatureLoading} />
							<Row>
								<Col xs={6}>
									<Form onSubmit={handleSubmit((d) => onSubmit(d))}>
										<div style={{ backgroundColor: '#FFF', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '1px 1px 3px -1px #ccc', padding: '10px', marginBottom: '10px' }}>

											<div className="d-flex mb-3">
												<Col xs={8} style={{ padding: '0.47rem 0.75rem' }}>
													{props.t('Nhiệt độ định mức') + ' (°C)'}
												</Col>
												<Input
													className='text-right mr-3'
													placeholder="37.5"
													defaultValue={data.giaTri}
													onBlur={({ target: { value } }) => {
														setValue('ratedTemperature', value);
														trigger('ratedTemperature');
													}}
												/>
												{(errors?.ratedTemperature ?? false) && <FormFeedback>{errors?.ratedTemperature?.message ?? ''}</FormFeedback>}
											</div>
										</div>
										<Button type="submit" color="success">{props.t('Cập nhật')}</Button>
									</Form>
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