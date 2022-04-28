import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import LanguageDropdown from 'components/Common/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from 'components/Common/TopbarDropdown/NotificationDropdown';
import ProfileMenu from 'components/Common/TopbarDropdown/ProfileMenu';
import { TOKEN } from 'utils/contants';

import logo from 'assets/images/logo.png';

const Header = () => {
  const [profile, setProfile] = useState(null);

  const getProfile = () => {
    try {
      const cookie = localStorage.getItem(TOKEN);
      const _profile = JSON.parse(cookie);

      setProfile(_profile);
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box" style={{ paddingTop: '15px' }}>
              <Link to="/" className="logo logo-light">
                <div className="d-flex justify-content-center logo-lg">
                  <span className="avatar-title rounded-circle" style={{ backgroundColor: 'rgb(231, 231, 231)', height: '65px', width: '65px' }}>
                    <img src={logo} alt="" className="rounded-circle" height="70" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div className="d-flex">
            {/* {(profile !== null && (profile.roleName === 'ADMIN' || profile.roleName === 'NS')) ? <NotificationDropdown profile={profile} /> : null} */}
            {/* <LanguageDropdown /> */}
            <ProfileMenu profile={profile} />
          </div>
        </div>
      </header>
    </>
  );
};

export default withNamespaces()(Header);
