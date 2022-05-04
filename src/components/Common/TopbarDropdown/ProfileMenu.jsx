import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { TOKEN } from 'utils/contants';

import userAvatar from '../../../assets/images/users/avatar.png';

const ProfileMenu = (props) => {

    const [menu, setMenu] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            const profile = JSON.parse(localStorage.getItem(TOKEN));
            setUsername(profile.displayName);
        }
    }, []);

    return (
        <React.Fragment>
            <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
                <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                    <img className="rounded-circle header-profile-user" src={userAvatar} alt="Header Avatar" />
                    <span className="d-none d-xl-inline-block ml-2 mr-1">{username}</span>
                    <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => props.history.push('/setting/change-password')}>
                        {props.t('Change Password')}
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <Link to="/logout" className="dropdown-item">
                        <span>{props.t('Logout')}</span>
                    </Link>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
}


export default withRouter(withNamespaces()(ProfileMenu));

