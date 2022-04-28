import React, { useState } from 'react';
// import {
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem
// } from 'reactstrap';

//i18n
import i18n from '../../../i18n';
import { withNamespaces } from 'react-i18next';

// flag
import usFlag from '../../../assets/images/flags/us.jpg';
import vnFlag from '../../../assets/images/flags/vn.jpg'; 

const PresentLanguage = (props) => {
  return (
    <div className="btn header-item waves-effect" style={{ paddingTop: '25px' }} onClick={ props.handleClick }>
      <img className="mr-1" src={ props.flag } alt="hr" height="16" />
      <span className="align-middle">{ props.language }</span>
    </div>
  )
}
 
const LanguageDropdown = (props) => {

  const languageList = {
    'us': {
      name: 'English',
      image: usFlag,
    },
    'vn': {
      name: 'Việt Nam',
      image: vnFlag
    }
  }

  const currentLanguage = i18n.language;
  const [ flag, setFlag ] = useState(languageList[currentLanguage === 'us' ? 'vn' : 'us']['image']);
  const [ language, setLanguage ] = useState(languageList[currentLanguage === 'us' ? 'vn' : 'us']['name']);

  function changeLanguageAction() {
    if (language === 'English') {
      i18n.changeLanguage('us');
      setFlag(languageList['vn']['image']);
      setLanguage(languageList['vn']['name']);
    }
    else {
      i18n.changeLanguage('vn');
      setFlag(languageList['us']['image']);
      setLanguage(languageList['us']['name']);
    }
  }

  return (
    <React.Fragment>
      <PresentLanguage flag={ flag } language={ language } handleClick={ changeLanguageAction } />
    </React.Fragment>
  );
}

export default withNamespaces()(LanguageDropdown);