import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Button } from 'reactstrap';
import Loader from 'components/LoadingIndicator';
import ProjectTable from './components/TaskTable';
import CreateModal from './components/CreateModal';
import DeleteModal from './components/DeleteModal';
import { notify } from 'utils/helpers';
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import taskApi from 'api/taskApi';
import TaskTable from './components/TaskTable';
import { TOKEN } from 'utils/contants';
import EmployeeTaskTable from './components/EmployeeTaskTable';

const ToolbarWrapper = styled.div`
    display: flex;
    padding: 0 15px 8px 0;
    .right {
        margin-left: auto;
    }

    > *:not(.right) {
        width: 180px;
        margin-right: 25px;
    }
`;

const TaskPage = () => {
	const history = useHistory();
	const {
		page,
		search,
		id
	} = useQueryString();
	const pushQueryString = usePushQueryString();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modalCreate, setModalCreate] = useState(false);
	const [statisticTable, setStatisticTable] = useState(false);
	const [modalUpload, setModalUpload] = useState(false);
	const [modalUpdate, setModalUpdate] = useState(undefined);
	const [modalDelete, setModalDelete] = useState(undefined);
	const [tasks, setTasks] = useState([]);
	const [employeeTasks, setEmployeeTasks] = useState([]);

	const getTasks = useCallback(async (p) => {
		try {
			const { success, data } = await taskApi.get(p);
			if (success)
				setTasks(data.map((_, index) => ({ ..._, order: index + 1 })));
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	}, [taskApi]);

	const handleClickRow = (data) => {
		history.push('/management/project/view?id=' + data.id)
	}
	const handleRefresh = async () => {
		setLoading(true);
		let payload = { project_id: id };
		await getTasks(payload);
		setLoading(false);
	}

	useEffect(() => {
		handleRefresh();
	}, [page, search]);
	useEffect(() => {
		try {
			setLoading(true);
			const data = JSON.parse(localStorage.getItem(TOKEN));
			if (!data.roleName) {
				console.log('err');
			}
			setProfile(data);
			setLoading(false);
		} catch (_err) {
		}
	}, []);

	return (
		<>
			<div className="page-content">
				<ToolbarWrapper>
					{
						profile !== null ?
							<div className="right" style={{ display: profile.roleName !== 'ADMIN' ? 'none' : 'block' }}>
								<Button color="success" className="mr-2" onClick={() => setModalCreate(true)}><i className="bx bx-plus"></i></Button>
								<Button color="info" onClick={() => setStatisticTable(!statisticTable)}><i className="bx bx-line-chart"></i></Button>
							</div>
							: null
					}
				</ToolbarWrapper>
				{loading && <Loader />}
				{
					(profile !== null && !loading) ?
						((profile?.roleName ?? '') === 'ADMIN') && (
							<TaskTable data={tasks} statisticTable={statisticTable} onRefresh={handleRefresh} profile={profile} />
						)
						: null
				}

				{(profile !== null && !loading) ?
					(profile?.roleName ?? '') !== 'ADMIN' && (
						<div >
							{
								(profile?.idNhanVien !== null) &&
								(<EmployeeTaskTable idNhanVien={profile?.idNhanVien} projectID={id} onRefresh={handleRefresh} />)
							}

						</div>
					)
					: null
				}

			</div>
			<CreateModal
				open={modalCreate}
				onRefresh={handleRefresh}
				onClose={() => setModalCreate(false)}
				projectID={id}
			/>

			{/*        <DeleteModal
                data={modalDelete}
                onRefresh={handleRefresh}
                onClose={() => setModalDelete(undefined)}
            /> */}

		</>
	)
};

export default TaskPage;