import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

function CustomPagination(props) {
    const { pagination, onPageChange, align } = props;
    const { page, limit, totalRows } = pagination;
    const totalSizes = Math.ceil(totalRows / limit);

    const handlePageChange = (newPage) => {
        if (onPageChange)
            onPageChange(newPage);
    }

    const renderPagination = (currentPage, totalSizes) => {
        let current = currentPage,
            last = totalSizes,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            flag;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right))
                range.push(i);
        }

        for (let i of range) {
            if (flag) {
                if (i - flag === 2)
                    rangeWithDots.push(flag + 1);
                else if (i - flag !== 1)
                    rangeWithDots.push('...');
            }

            rangeWithDots.push(i);
            flag = i;
        }

        return rangeWithDots;
    }

    return (
        <React.Fragment>
            <Pagination className={classNames('mb-2', 'pagination', 'pagination-rounded', { 'justify-content-end': align === 'right' })}>
                {renderPagination(page, totalSizes).map((item, idx) => {
                    if (item === '...') {
                        return (
                            <PaginationItem key="page_more" disabled>
                                <PaginationLink>
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                    else {
                        return (
                            <PaginationItem
                                key={'page_' + idx}
                                active={item === page}
                            >
                                <PaginationLink
                                    onClick={() => handlePageChange(item)}
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                })
                }
            </Pagination>
        </React.Fragment>
    );
}

CustomPagination.propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageChange: PropTypes.func,
    align: PropTypes.string
}

CustomPagination.defaultProps = {
    onPageChange: null,
    align: 'right'
}

export default CustomPagination;