import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Dropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap';

// API
import timeOffApi from '../../../api/timeOffApi';
import deductionApi from '../../../api/deductionApi';

//i18n
import { withNamespaces } from 'react-i18next';

const NotificationDropdown = props => {
    const { profile } = props;

    // State
    const [show, setShow] = useState(false);

    const [requestTimeOff, setRequestTimeOff] = useState(null);

    const [requestDeduction, setRequestDeduction] = useState(null);

    // Function
    const fetchRequestTimeOff = async () => {
        try {
            const response = await timeOffApi.getRequests();
            if (response && response.success && response.data.numbsWaiting)
                setRequestTimeOff(response.data.numbsWaiting);
        } catch (error) {

        }
    }

    const fetchRequestDeduction = async () => {
        try {
            const response = await deductionApi.getRequests();
            if (response && response.success && response.data.numbsWaiting)
                setRequestDeduction(response.data.numbsWaiting);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchRequestTimeOff();
        fetchRequestDeduction();

        setInterval(() => {
            fetchRequestTimeOff();
            fetchRequestDeduction();
        }, 30000);
    }, []);


    return (
        <>
            <Dropdown
                isOpen={show}
                toggle={() => setShow(!show)}
                className="dropdown d-inline-block"
                tag="li"
            >
                <DropdownToggle
                    className="btn header-item noti-icon waves-effect"
                    tag="button" id="page-header-notifications-dropdown">
                    <i className="font-size-16 bx bx-bell"></i>
                    {
                        (() => {
                            let count = null;
                            if (requestDeduction !== null)
                                count = requestDeduction;

                            if (requestTimeOff !== null) {
                                if (count !== null)
                                    count += requestTimeOff;
                                else
                                    count = requestTimeOff;
                            }

                            if (count !== null) {
                                return (
                                    <span className="badge badge-danger badge-pill">{count}</span>
                                )
                            }
                        })()
                    }
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
                    <div className="p-3 align-items-center">
                        <h6 className="m-0">{props.t('Notifications')}</h6>
                    </div>
                    {
                        requestTimeOff !== null || requestDeduction !== null
                            ?
                            <div className="p-2">
                                {
                                    requestTimeOff !== null
                                        ?
                                        <Link to="/management/time-off" className="text-reset notification-item">
                                            <div className="media mb-2">
                                                <div className="avatar-xs mr-3">
                                                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                                                        <i className="bx bx-clipboard"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">{props.t('Time off requests')}</h6>
                                                    <div className="font-size-12 text-muted">
                                                        <p className="mb-1">{props.t('There are # requests pending approval').replace('#', requestTimeOff)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        : null
                                }
                                {
                                    requestDeduction !== null
                                        ?
                                        <Link to="/management/deduction" className="text-reset notification-item">
                                            <div className="media">
                                                <div className="avatar-xs mr-3">
                                                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                                                        <i className="bx bx-timer"></i>
                                                    </span>
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="mt-0 mb-1">{props.t('Deduction requests')}</h6>
                                                    <div className="font-size-12 text-muted">
                                                        <p className="mb-1">{props.t('There are # requests pending approval').replace('#', requestDeduction)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        : null
                                }
                            </div>
                            :
                            null
                    }
                </DropdownMenu>
            </Dropdown>
        </>
    );
}

export default withNamespaces()(NotificationDropdown);