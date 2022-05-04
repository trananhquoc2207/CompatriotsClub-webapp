import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    width: 100%;

    & input {
        height: 100%;
        padding: 2px 8px;
        background-color: hsl(0, 0, 100);
        border-color: #CED4DA;
        border-radius: 4px;
        border-style: solid;
        border-width: 1px;
    
        &:focus, 
        &:hover {
            outline: none;
            border-color: #2684FF !important;
        }
    }

    & i {
        font-size: 16px;
        position: absolute;
        top: 11.5px;
        left: auto;
        right: 15px;
    }
`;

const SearchInput = ({ onSearch }) => {
    const [value, setValue] = useState('');

    const onClick = () => onSearch(value);
    const onKeyDown = (e) => e.key === 'Enter' && onSearch(value);

    return (
        <Wrapper>
            <i className="bx bx-search" onClick={() => onClick()}></i>
            <input
                type="text"
                placeholder="Nhập từ khóa"
                onChange={({ target: { value } }) => setValue(value)}
                onKeyDown={(e) => onKeyDown(e)}
            />
        </Wrapper>
    )
};

export default SearchInput;