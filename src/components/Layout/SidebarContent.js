/* eslint-disable */
import React, { useEffect, useMemo } from 'react';
import MetisMenu from 'metismenujs';
import { Link, withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';


import { useAuth } from 'hooks';
import { componentTree } from 'utils/component-tree';
import { TOKEN } from 'utils/contants';

const SidebarContent = (props) => {
  const { getUserInfo, getPermission } = useAuth();
  const userInfo = getUserInfo();
  const permisisonList = getPermission();

  const componentList = useMemo(() =>
    permisisonList.map((p) => componentTree.find((c) => c.code === p))
    , [permisisonList]);


  useEffect(() => {
    var pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu('#side-menu');
      let matchingMenuItem = null;
      const ul = document.getElementById('side-menu');
      const items = ul.getElementsByTagName('a');

      /* Exception */
      if (pathName.indexOf('/settings') > -1) {
        for (let i = 0; i < items.length; ++i) {
          if (items[i].pathname.indexOf('/settings') > -1) {
            matchingMenuItem = items[i];
            break;
          }
        }
      }
      else {

        for (let i = 0; i < items.length; ++i) {
          if (pathName === items[i].pathname) {
            matchingMenuItem = items[i];
            break;
          }
        }
      }

      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    }

    initMenu();
  }, [props.location.pathname]);

  function activateParentDropdown(item) {
    item.classList.add('active');
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add('mm-active');
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add('mm-show');
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add('mm-active'); // li
          parent3.childNodes[0].classList.add('mm-active'); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add('mm-active');
          }
        }
      }

      return false;
    }

    return false;
  };

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {componentList
            .sort((a, b) => a.index - b.index)
            .map((c) =>
              c?.component
                ? (
                  <li key={c.index} >
                    {typeof c.component === 'function' ? c.component(userInfo?.idNhanVien) : c.component}
                  </li>
                ) : null
            )
          }
        </ul>
      </div>
    </React.Fragment>
  );
}

export default withRouter(withNamespaces()(SidebarContent));


