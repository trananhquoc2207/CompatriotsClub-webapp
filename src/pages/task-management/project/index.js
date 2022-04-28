import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Button } from 'reactstrap';
import Loader from 'components/LoadingIndicator';
import ProjectTable from './components/ProjectTable';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import DeleteModal from './components/DeleteModal';
import { notify } from 'utils/helpers';
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import { useHistory } from 'react-router-dom';
import projectApi from 'api/projectApi';
import dayjs from 'dayjs';
import { TOKEN } from 'utils/contants';

const Wrapper = styled.div`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #FFF;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 1px 1px 3px -1px #ccc;
`;
const ToolbarWrapper = styled.div`
    display: flex;
    padding: 0 0 8px 0;

    .right {
        margin-left: auto;
    }

    > *:not(.right) {
        width: 180px;
        margin-right: 6px;
    }
`;

const columns = [
    {
        name: 'order',
        label: '#',
        align: 'center',
    },
    {
        name: 'name',
        align: 'left',
        label: 'Tên dự án',
        render: (r) => <div style={{ color: '#0052CC' }}>{r?.name}</div> ?? '',
    },
    {
        name: 'beginDate',
        align: 'left',
        label: 'Ngày bắt đầu',
        render: (r) => dayjs(r?.beginDate).format('DD/MM/YYYY') ?? '',
    },
    {
        name: 'endDate',
        align: 'left',
        label: 'Ngày kết thúc',
        render: (r) => dayjs(r?.endDate).format('DD/MM/YYYY') ?? '',
    },
    {
        name: 'status',
        align: 'left',
        label: 'Trạng thái',
        render: (r) => <span className="badge badge-primary">Đang thực hiện</span> ?? '',
    },
    {
        name: 'creator',
        align: 'left',
        label: 'Phụ trách',
        render: (r) => r.members[0]?.UserInfo?.tenNhanVien ?? '',
    },
];

const ProjectsPage = () => {
    const history = useHistory();
    const {
        page,
        search,
        position,
        department
    } = useQueryString();
    const pushQueryString = usePushQueryString();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpload, setModalUpload] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(undefined);
    const [modalDelete, setModalDelete] = useState(undefined);
    const [projects, setProjects] = useState([]);

    const getProjects = useCallback(async (p) => {
        try {
            const { success, data } = await projectApi.get(p);
            if (success)
                setProjects(data.map((_, index) => ({ ..._, order: index + 1 })));
        } catch (error) {
            notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
        }
    }, [projectApi]);

    const handleClickRow = (data) => {
        history.push('/management/project/view?id=' + data.id)
    }
    const handleRefresh = async () => {
        setLoading(true);
        if (profile !== null) {
            let payload = { user_id: profile.roleName !== 'ADMIN' ? profile.idNhanVien : '' };
            await getProjects(payload);
        }

        setLoading(false);
    }
    useEffect(() => {
        handleRefresh();
    }, [page, search, position, department, profile]);
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
                    {/*  <SearchInput onSearch={handleSearch} /> */}

                    {
                        profile !== null ?
                            <div className="right" style={{ display: profile.roleName !== 'ADMIN' ? 'none' : 'block' }}>
                                <Button color="success" onClick={() => setModalCreate(true)}><i className="bx bx-plus"></i></Button>
                            </div>
                            : null
                    }

                </ToolbarWrapper>
                {loading && <Loader />}
                {profile !== null ? !loading && (
                    <Wrapper>
                        <ProjectTable
                            title="Nhân viên"
                            columns={columns}
                            data={projects}
                            handleClickRow={handleClickRow}
                            rowActions={profile.roleName === 'ADMIN' ? [
                                {
                                    name: 'edit',
                                    label: 'Sửa',
                                    icon: 'pencil',
                                    action: (d) => setModalUpdate(d),
                                },
                                {
                                    name: 'delete',
                                    label: 'Xóa',
                                    icon: 'trash-alt',
                                    action: (d) => setModalDelete(d),
                                }
                            ]
                                :
                                null
                            }
                        />
                    </Wrapper>
                ) : null
                }
            </div>
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

        </>
    )
};

export default ProjectsPage;