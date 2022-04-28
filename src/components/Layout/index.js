import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { PROJECT_NAME } from 'utils/contants';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.body.setAttribute('data-sidebar', 'dark');
        if (this.props.title !== undefined)
            document.title = `${PROJECT_NAME} | ` + this.props.t(this.props.title);
        else
            document.title = PROJECT_NAME;
    }

    render() {
        return (
            <React.Fragment>
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar
                        theme={this.props.leftSideBarTheme}
                        type={this.props.leftSideBarType}
                        isMobile={this.state.isMobile} />
                    <div className="main-content">
                        {this.props.children}
                    </div>
                    {/* <Footer /> */}
                </div>
            </React.Fragment>
        );
    }

}


export default withNamespaces()(Layout);
