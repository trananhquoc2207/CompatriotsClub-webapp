import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import dayJS from 'dayjs';

import {
    Card, CardBody,
    Nav, NavItem, NavLink
} from 'reactstrap';
import SalaryTable from './components/SalaryTable';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import { TOKEN } from 'utils/contants';

const Salary = () => {
    const { panel } = useQueryString();
    const pushQueryString = usePushQueryString();

    const [profile, setProfile] = useState({});

    const handlePanelChange = idx => pushQueryString({ panel: idx, page: 1, time: dayJS().format('MM/YYYY') });

    useEffect(() => {
        try {
            const token = JSON.parse(localStorage.getItem(TOKEN));
            setProfile(token || {});
        } catch (error) { }
    }, []);

    return (
        <React.Fragment>
            {(profile?.roleName ?? '') === 'ADMIN' && (
                <>
                    <div className="nav-panel">
                        <Card className="mb-0" style={{ boxShadow: 'none' }}>
                            <CardBody className="p-0">
                                <Nav tabs className="nav-tabs-custom m-0 px-3">
                                    <NavItem>
                                        <NavLink style={{ cursor: 'pointer' }} className={classNames({ 'active': panel !== undefined ? parseInt(panel) === 1 : true })} onClick={() => handlePanelChange(1)}>
                                            <span className="d-none d-sm-block" style={{ fontWeight: '600' }}>Nhân viên</span>
                                        </NavLink>
                                    </NavItem>
                                    {(profile?.idNhanVien ?? '') !== 0 && (
                                        <NavItem>
                                            <NavLink style={{ cursor: 'pointer' }} className={classNames({ 'active': panel !== undefined ? parseInt(panel) === 2 : false })} onClick={() => handlePanelChange(2)}>
                                                <span className="d-none d-sm-block" style={{ fontWeight: '600' }}>Cá nhân</span>
                                            </NavLink>
                                        </NavItem>
                                    )}
                                </Nav>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="panel-content">
                        {(!panel || parseInt(panel) === 1) && <SalaryTable isAdmin />}
                        {panel && parseInt(panel) === 2 && <SalaryTable isEmployee />}
                    </div>
                </>
            )}
            {(profile?.roleName ?? '') !== 'ADMIN' && (
                <div className="page-content">
                    <SalaryTable isEmployee />
                </div>
            )}
        </React.Fragment>
    )
}

export default Salary;