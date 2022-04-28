import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import dayJS from 'dayjs';
import { TOKEN } from 'utils/contants';

const Authmiddleware = ({
    exact = false,
    path,
    title: Title,
    layout: Layout,
    component: Component,
}) => (
    <Route
        exact={exact}
        path={path}
        render={props => {
            const token = JSON.parse(localStorage.getItem(TOKEN));
            if (token === null)
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
            else {
                // if (dayJS(token.expires).unix() - dayJS().unix() < 1) {
                //     localStorage.removeItem(TOKEN);
                //     return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
                // }

                return (
                    <Layout title={Title}>
                        <Component {...props} />
                    </Layout>
                );
            }
        }}
    />
);

export default withRouter(Authmiddleware);

