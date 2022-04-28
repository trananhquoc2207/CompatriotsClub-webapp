import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DataTable from 'components/data-table';
import SearchBar from 'components/SearchBar';
import CreateModal from 'pages/setting/time-off-type/components/CreateModal';
import UpdateModal from 'pages/setting/time-off-type/components/UpdateModal';
import DeleteModal from 'pages/setting/time-off-type/components/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeOffType } from '../actions/timeOffType';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const columns = [
	{
		name: 'index',
		label: '#',
		align: 'center',
		style: {
			width: '20px',
		},
	},
	{
		name: 'tenLoaiPhep',
		align: 'left',
		label: 'Lý do xin nghỉ phép',
	},
	{
		name: 'soNgayNghi',
		align: 'left',
		label: 'Số ngày được nghỉ',
	},
];

const TimeOffTypePage = () => {
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [filter, setFilter] = useState({});

	const [modalCreate, setModalCreate] = useState(false);
	const [modalUpdate, setModalUpdate] = useState(undefined);
	const [modalDelete, setModalDelete] = useState(undefined);

	const dispatch = useDispatch();
	const {
		timeOffTypeData,
		getTimeOffTypeLoading,
	} = useSelector((state) => state.timeOffType);
	const { data: timeOffTypeList, totalSizes } = timeOffTypeData || {};
	const handleRefresh = () => {
		const payload = {
			page_number: pageIndex,
			page_size: pageSize,
		}
		dispatch(getTimeOffType(payload));
	};
	useEffect(() => {
		handleRefresh();
	}, [pageIndex, pageSize]);

	return (
		<div className="page-content">
			<DataTable
				loading={getTimeOffTypeLoading}
				title="Lý do xin nghỉ phép"
				columns={columns}
				data={
					(timeOffTypeList || [])
						.map((o, i) => ({ ...o, index: (i + 1) }))
				}
				totalRows={totalSizes}
				onPageChange={(index, size) => {
					if (index !== pageIndex) {
						setPageIndex(index);
					}
					if (size !== pageSize) {
						setPageSize(size);
					}
				}}
				tableActions={[
					{
						name: 'detail',
						label: 'Thêm',
						color: 'success',
						icon: 'plus',
						action: () => setModalCreate(true),
					}
				]}
				rowActions={[
					{
						name: 'edit',
						label: 'Sửa',
						icon: 'pencil',
						color: 'warning',
						action: (d) => setModalUpdate(d),
					},
					{
						name: 'delete',
						label: 'Xóa',
						color: 'danger',
						icon: 'trash-alt',
						action: (d) => setModalDelete(d),
					}
				]}
			/>
			<CreateModal
				open={modalCreate}
				onRefresh={handleRefresh}
				onClose={() => setModalCreate(false)}
			/>
			<UpdateModal
				data={modalUpdate}
				onRefresh={handleRefresh}
				onClose={() => setModalUpdate(undefined)}
			/>
			<DeleteModal
				data={modalDelete}
				onRefresh={handleRefresh}
				onClose={() => setModalDelete(undefined)}
			/>
		</div>
	);
}

export default TimeOffTypePage;