import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { Row, Col, Container, Card, CardBody, CardTitle, CardHeader } from "reactstrap";
//Import Breadcrumb

import ReactApexChart from 'react-apexcharts';
import Breadcrumb from 'components/Common/Breadcrumb';
import dayjs from 'dayjs';
import TaskDetail from './TaskDetail';
import { useMemo } from 'react';
import { useEffect } from 'react';
import CustomToolTip from 'components/CustomToolTip';
import usePushQueryString from 'hooks/usePushQueryString';
import { notify } from 'utils/helpers';
import taskApi from 'api/taskApi';
import Loader from 'components/Loader';


const StyledCard = styled(Card)`
    border-radius: 3px;
    margin-bottom: 15px;
    max-height: 370px;
    overflow: auto;
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

const EmployeeTaskTable = (props) => {
    const {
        page,
        search,
        id
    } = usePushQueryString();
    const { statisticTable, idNhanVien, projectID, onRefresh } = props;
    const [showStaticTable, setShowStaticTable] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTodoTask, setShowTodoTask] = useState(true);
    const [showProgressTask, setShowProgressTask] = useState(true);
    const [showDoneTask, setShowDoneTask] = useState(true);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const series = [{ name: "Task đã hoàn thành", type: "column", data: [23, 11, 22, 27, 13, 22] }, { name: "Tất cả task", type: "line", data: [23, 11, 34, 27, 17, 22] }];
    const options = { chart: { height: 280, type: "line", stacked: !1, toolbar: { show: !1 } }, stroke: { width: [0, 2, 5], curve: "smooth" }, plotOptions: { bar: { columnWidth: "20%", endingShape: "rounded" } }, colors: ["#556ee6", "#34c38f"], fill: { gradient: { inverseColors: !1, shade: "light", type: "vertical", opacityFrom: .85, opacityTo: .55, stops: [0, 100, 100, 100] } }, labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], markers: { size: 0 }, yaxis: { min: 0 } };
    const FilterByStatus = (arr, status) => {
        return arr.filter(item => item.status?.id === status);
    }
    const GetShortName = (data) => {
        let matches = data.split(' ').map(i => i[0]);
        let filterMatches = matches.map((item, index) => {
            if (index === 0 || index === matches.length - 1) {
                return item
            }
        })
        return filterMatches.join('');
    }
    const getTasks = useCallback(async (p) => {
        try {
            const { success, data } = await taskApi.get(p);
            if (success)
                setData(data.map((_, index) => ({ ..._, order: index + 1 })));
        } catch (error) {
            notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
        }
    }, [taskApi]);
    const handleRefresh = async () => {
        setLoading(true);
        let payload = { project_id: projectID, user_id: idNhanVien };
        await getTasks(payload);
        setLoading(false);
    }

    const BodyContent = (props) => {
        const { data } = props;
        return (
            <tbody>
                {loading && <Loader />}
                {!loading && (data || []).map((item, idx) => (
                    <tr key={idx} onClick={() => { setShowTaskDetail(!showTaskDetail); setShowStaticTable(false); setSelectedRow(item) }}>
                        <td style={{ width: "60px" }}>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck6" />
                                <label className="custom-control-label" htmlFor="customCheck6"></label>
                            </div>
                        </td>
                        <td style={{ width: "700px" }}>
                            <h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{item?.title ?? ''}</Link></h5>
                            <div>Được tạo ngày {dayjs(item?.beginDate).format('DD/MM/YYYY')}</div>
                        </td>
                        <td style={{ width: "50px" }}>
                            <div className="team">
                                <div className="team-member d-inline-block">
                                    <div className="avatar-xs">
                                        <span id={`name_${idx}`} className="avatar-title rounded-circle bg-soft-primary text-primary">
                                            {GetShortName(item?.member[0]?.memberInfo?.tenNhanVien ?? '')}
                                            <CustomToolTip id={`name_${idx}`} message={item?.member[0]?.memberInfo?.tenNhanVien ?? ''} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td >
                            <div className="text-center">
                                <span
                                    className={
                                        classnames('badge', 'badge-pill', { 'badge-soft-secondary': item?.status?.id === 19 }, { 'badge-soft-success': item?.status?.id === 21 }, { 'badge-soft-warning': item?.status?.id === 20 }, 'font-size-11')
                                    }
                                >
                                    {
                                        item?.status?.id === 19 ? 'Đang chờ'
                                            : item?.status?.id === 20 ? "Đang thực hiện"
                                                : "Đã hoàn thành"
                                    }

                                </span>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        )
    };
    useEffect(() => {
        setShowStaticTable(statisticTable);
        setShowTaskDetail(false);
    }, [statisticTable])

    useEffect(() => {
        handleRefresh();
    }, [page, search]);

    return (
        <React.Fragment>
            <div className="">
                <Container fluid>
                    <Row>
                        <Col lg={(showTaskDetail || showStaticTable) ? '8' : '12'}>
                            <StyledCard>
                                <CardTitle className="ml-3 mt-3" onClick={() => setShowTodoTask(!showTodoTask)}>
                                    <span className={classnames('title', { 'title_active': showTodoTask })}>Công Việc Mới</span>
                                </CardTitle>
                                <CardBody className={classnames({ 'disabled': !showTodoTask })}>
                                    <div className="table-responsive">
                                        <table className="table table-nowrap table-centered mb-0">
                                            <BodyContent data={FilterByStatus(data, 19)} />
                                        </table>
                                    </div>
                                </CardBody>
                            </StyledCard>
                            <StyledCard>
                                <CardTitle className="ml-3 mt-3" onClick={() => setShowProgressTask(!showProgressTask)}>
                                    <span className={classnames('title', { 'title_active': showProgressTask })}>Đang Thực Hiện</span>
                                </CardTitle>
                                <CardBody className={classnames({ 'disabled': !showProgressTask })}>
                                    <div className="table-responsive">
                                        <table className="table table-nowrap table-centered mb-0">
                                            <BodyContent data={FilterByStatus(data, 20)} />
                                        </table>
                                    </div>
                                </CardBody>
                            </StyledCard>

                            <StyledCard>
                                <CardTitle className="ml-3 mt-3" onClick={() => setShowDoneTask(!showDoneTask)}>
                                    <span className={classnames('title', { 'title_active': showDoneTask })}>Đã Hoàn Thành</span>
                                </CardTitle>
                                <CardBody className={classnames({ 'disabled': !showDoneTask })}>
                                    <div className="table-responsive">
                                        <table className="table table-nowrap table-centered mb-0">
                                            <BodyContent data={FilterByStatus(data, 21)} />
                                        </table>
                                    </div>
                                </CardBody>
                            </StyledCard>
                        </Col>
                        <Col lg={4} style={{ display: showTaskDetail ? 'block' : 'none' }}>
                            {selectedRow !== null ?
                                <TaskDetail data={selectedRow} onRefresh={onRefresh} del={false} />
                                : <div className='text-center font-weight-bold'>{('Không có thông tin')}</div>
                            }
                        </Col >
                        <Col lg={showStaticTable ? '4' : '0'} style={{ display: showStaticTable ? 'block' : 'none' }}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Công việc </CardTitle>
                                    <ReactApexChart options={options} series={series} type="line" height={280} />
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Công việc gần đây</CardTitle>

                                    <div className="table-responsive">
                                        <table className="table table-nowrap table-centered mb-0">
                                            <tbody>
                                                {
                                                    FilterByStatus(data, 19).map((item, idx) => (
                                                        <tr>
                                                            <td>
                                                                <h5 className="text-truncate font-size-14 m-0"><Link to="#" className="text-dark">{item?.title ?? ''}</Link></h5>
                                                            </td>
                                                            <td>
                                                                <div className="team">
                                                                    <Link to="#" className="team-member d-inline-block">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {GetShortName(item?.member[0]?.memberInfo?.tenNhanVien ?? '')}
                                                                            </span>
                                                                        </div>
                                                                    </Link>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
}

export default EmployeeTaskTable;