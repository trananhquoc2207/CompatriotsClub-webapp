import React from 'react';
import styled from 'styled-components';

import { Media } from 'reactstrap';
import Loader from 'components/Loader';

const Wrapper = styled.div`
    position: relative;
    & .content {
        margin-top: 0 !important;
    }
    & .title {
        color: #74788d;
        font-size: 14px;
        margin-bottom: 0.6rem;
    }
    & .icon {
        height: 3rem;
        width: 3rem;
        align-self: center; 
        &:before {
            content: '';
            position: absolute;
            width: 8px;
            height: 54px;
            right: 32px;
            top: 12px;
            background-color: hsla(0, 0%, 100%, .1);
            -webkit-transform: rotate(32deg);
            transform: rotate(32deg);
            transition: all .4s;
        }
        &:after {
            left: -12px;
            width: 12px;
            transition: all .2s;
        }
        &__core {
            width: 100%;
            height: 100%;
            background-color: #556ee6;
            color: #ffffff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`;

const CustomMedia = ({ loading, title, icon, data, onDetail }) => (
    <Wrapper>
        <Loader inverted active={loading} />
        <div className="wrapper p-3">
            <Media>
                <Media body>
                    <p onClick={onDetail} className="title">{title}</p>
                    <h4 className="mb-0">{data}</h4>
                </Media>
                <div className="icon">
                    <span className="icon__core">
                        <i className={`bx bx-${icon} font-size-24`}></i>
                    </span>
                </div>
            </Media>
        </div>
    </Wrapper>
);

export default CustomMedia;