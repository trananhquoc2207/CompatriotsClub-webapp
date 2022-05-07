import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import { userRoutes, authRoutes } from './routes/allRoutes';
import Authmiddleware from './routes/middleware/Authmiddleware';
import ClientPage from 'pages/client/page/ClientPage';
// eslint-disable-next-line
import Layout from './components/Layout/';
import NonAuthLayout from './components/NonAuthLayout';

import './assets/scss/theme.scss';
import 'toastr/build/toastr.min.css';
import 'react-html5-camera-photo/build/css/index.css';

const App = () => {
  const NonAuthmiddleware = ({
    exact = false,
    path,
    layout: ComponentLayout,
    component: Component,
  }) => (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <ComponentLayout>
          <Component {...props} />
        </ComponentLayout>
        )}
    />
  );

  return (
    <>
      <Router>
        {/* <Switch>
        <ClientPage></ClientPage>
        </Switch> */}
        <Switch>
          {authRoutes.map((route, idx) => (
            <NonAuthmiddleware
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              path={route.path}
              exact={route.exact}
              title={route.title}
              layout={NonAuthLayout}
              component={route.component}
            />
          ))}
          {userRoutes.map((route, idx) => (
            <Authmiddleware
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              path={route.path}
              exact={route.exact}
              title={route.title}
              layout={Layout}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
    </>
  );
};

export default App;
