import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import {
	Card, CardBody,
	Nav, NavItem, NavLink,
} from 'reactstrap';
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import { TOKEN } from 'utils/contants';
import UserTable from './components/UserTable';
import AdminTable from './components/AdminTable';

const TimeOff = (props) => {
	const { panel } = useQueryString();
	const pushQueryString = usePushQueryString();

	const [profile, setProfile] = useState(null);

	const handlePanelChange = (idx) => pushQueryString({ panel: idx });

	useEffect(() => {
		try {
			const data = JSON.parse(localStorage.getItem(TOKEN));
			if (!data?.roleName && !data?.chucVu?.maChucVu) {
			}
			setProfile(data || {});
		} catch (_err) { }
	}, []);

	return (
		<>
			{profile?.displayName?.includes('admin') && (
				<>
					<div className="nav-panel">
						{/* <Card className="mb-0" style={{ boxShadow: 'none' }}>
									<CardBody className="p-0">
										<Nav tabs className="nav-tabs-custom m-0 px-3">
											<NavItem>
												<NavLink style={{ cursor: 'pointer' }} className={classNames({ 'active': panel !== undefined ? parseInt(panel) === 1 : true })} onClick={() => handlePanelChange(1)}>
													<span className="d-none d-sm-block" style={{ fontWeight: '600' }}>Yêu cầu của nhân viên</span>
												</NavLink>
											</NavItem>
											{(profile?.idNhanVien ?? '') !== 0 && (
												<NavItem>
													<NavLink style={{ cursor: 'pointer' }} className={classNames({ 'active': panel !== undefined ? parseInt(panel) === 2 : false })} onClick={() => handlePanelChange(2)}>
														<span className="d-none d-sm-block" style={{ fontWeight: '600' }}>Yêu cầu của bạn</span>
													</NavLink>
												</NavItem>
											)}
										</Nav>
									</CardBody>
								</Card> */}
					</div>
					<div className="panel-content">
						{/* {(!panel || parseInt(panel) === 1) && <AdminTable />}
						{panel && parseInt(panel) === 2 && <UserTable />} */}
						<AdminTable />
					</div>
				</>
			)}
			{!profile?.displayName?.includes('admin') && (
				<div className="page-content">
					<UserTable />
				</div>
			)}
		</>
	);
};

export default TimeOff;
