import React from 'react';

import {
    Pagination
}  from 'antd';

// CSS
import 'antd/dist/antd.css';

// Hook
import useQueryString from '../../../hooks/useQueryString';
import usePushQueryString from '../../../hooks/usePushQueryString';

const PaginationCustom = props => {
    const { page } = useQueryString();
    const { totalRows } = props;

    // Hook
    const pushQueryString = usePushQueryString();

    // Handle
    const onChange = page => pushQueryString({ page: page ? page : 1 });

    // Function
    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
          return <i className="font-size-18 bx bx-left-arrow-alt" style={{ paddingTop: '0.4rem' }}></i>;
        }

        if (type === 'next') {
            return <i className="font-size-18 bx bx-right-arrow-alt" style={{ paddingTop: '0.4rem' }}></i>;
        }

        return originalElement;
    }

    return (
        <Pagination current={page ? parseInt(page) : 1} total={totalRows} itemRender={itemRender} onChange={page => onChange(page)} />
    )
}

export default PaginationCustom;