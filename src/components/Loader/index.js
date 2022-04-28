import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import { Spinner } from 'reactstrap';

const Wrapper = styled.div` 
    & .dimmer {
        display: none;
        position: absolute;
        top: 0 !important;
        left: 0 !important;
        width: 100%;
        height: 100%;
        text-align: center;
        vertical-align: middle;
        padding: 1em;
        background-color: rgba(0,0,0,.85);
        opacity: 0;
        line-height: 1;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-transition: background-color .5s linear;
        transition: background-color .5s linear;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        will-change: opacity;
        z-index: 1000;

        & .content {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            color: #fff;
        }
    }
    & .active {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        opacity: 1;
    }
    & .transition { 
        visibility: visible !important;
    }
    & .inverted {
        background-color: rgba(255,255,255,.85);
    }
    & .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0;
        color: rgba(255, 255, 255, .9);
        text-align: center;
        z-index: 1000;
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);

        &:before, &:after {
            width: 2.28571429rem;
            height: 2.28571429rem;
            margin: 0 0 0 -1.14285714rem;
        }
        &:before {
            position: absolute;
            content: '';
            top: 0;
            left: 50%;
            width: 100%;
            height: 100%;
            border-radius: 500rem;
            border: .2em solid rgba(0, 0, 0, .1);
            border-color: rgba(255, 255, 255, .15);
        }
        &:after {
            position: absolute;
            content: '';
            top: 0;
            left: 50%;
            width: 100%;
            height: 100%;
            -webkit-animation: loader .6s linear;
            animation: loader .6s linear;
            animation-iteration-count: 1;
            -webkit-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
            border-radius: 500rem;
            border-color: #fff transparent transparent;
            border-style: solid;
            border-width: .2em;
            -webkit-box-shadow: 0 0 0 1px transparent;
            box-shadow: 0 0 0 1px transparent;
        }
    }
`;

const Loader = ({ inverted, active }) => (
    <Wrapper>
        <div className={classnames('dimmer', 'transition', { 'inverted': inverted, 'active': active })}>
            <div className="content">
                <Spinner color="dark" />
            </div>
        </div>
    </Wrapper>
);

Loader.propTypes = {
    inverted: PropTypes.bool,
    active: PropTypes.bool,
};

Loader.defaultTypes = {
    inverted: false,
    active: false,
};

export default Loader;