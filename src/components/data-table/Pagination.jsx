import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import {
  ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

const Wrapper = styled.div`
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  & .pagination {
    & .item {
      font-size: 0.8rem;
      padding: 8px 12px;
      background-color: #FFF;
      border: 1px solid #ddd;
      box-shadow: 1px 1px 3px -1px #ccc;
      &:hover {
        background-color: #f8f9fa;
      }
      &:not(:last-child) {
        border-right: 0;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &-active {
        background-color: rgba(0, 0, 0, 0.05);
      }
      &-last {
        border-right: 1px solid #ddd !important;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    & .total {
      display: flex;
      margin-left: auto;
      & .btn {
        background-color: inherit !important;
        color: black !important;
        border: 1px solid #ddd !important;
        box-shadow: 1px 1px 3px -1px #ccc !important;
      }
    }
  }
  & .dropdown-menu {
    min-width: 0 !important;
    & .dropdown-item {
      font-size: 0.9rem;
    }
  }
`;

const totalOptions = [
  { value: 10, label: 'Hiển thị: 10' },
  { value: 20, label: 'Hiển thị: 20' },
  { value: 30, label: 'Hiển thị: 30' },
  { value: 50, label: 'Hiển thị: 50' },
  { value: 100, label: 'Hiển thị: 100' },
]

const Pagination = (props) => {
  const {
    totalRows,
    onChange: onChangeProps,
  } = props;

  const [range, setRange] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageLast, setPageLast] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const calulate = (currentPage, totalSizes) => {
    var current = currentPage,
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

    setPageLast(rangeWithDots[rangeWithDots.length - 1])
    return rangeWithDots;
  }
  const onChange = index => {
    if (index !== pageIndex && pageLast >= index >= 1) {
      setPageIndex(index);
      if (typeof onChangeProps === 'function') {
        onChangeProps(index, pageSize);
      }
    }
  }
  const onTotal = index => {
    if (index !== pageSize) {
      setPageSize(index);
      if (typeof onChangeProps === 'function') {
        onChangeProps(pageIndex, index);
      }
    }
  }

  useEffect(() => {
    const pageCount = totalRows ? Math.ceil(totalRows / pageSize) : 0;
    setRange(calulate(pageIndex, pageCount));
  }, [pageIndex, pageSize, totalRows]);

  return (
    <Wrapper>
      <div className="pagination">
        <div className="item" onClick={() => { onChange(1) }}><i className="bx bx-arrow-to-left"></i></div>
        <div className="item" onClick={() => { onChange(pageIndex - 1) }}><i className="bx bx-left-arrow-alt"></i></div>
        {((range || []).map((l, i) => (
          <div key={`pagination_${i}`} className={classnames('item', { 'item-active': l === pageIndex })} onClick={() => { onChange(l) }}>{l}</div>
        )))}
        <div className="item" onClick={() => { onChange(pageIndex + 1) }}><i className="bx bx-right-arrow-alt"></i></div>
        <div className="item item-last" onClick={() => { onChange(pageLast) }}><i className="bx bx-arrow-to-right"></i></div>
        <div className="total">
          <div className="p-2 mr-2 font-size-14">
            <span className="font-weight-bold">Tổng:&nbsp;&nbsp;{totalRows}</span>
          </div>
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {(totalOptions || []).find((o) => (o?.value ?? 0) === pageSize)?.label ?? ''}
            </DropdownToggle>
            <DropdownMenu>
              {(totalOptions || []).map(({ label, value }, i) => (
                <DropdownItem key={`option_${i}`} onClick={() => { onTotal(value) }}>{label}</DropdownItem>
              ))}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      </div>
    </Wrapper>
  );
};

Pagination.defaultTypes = {
  totalRows: 0,
  onChange: () => { },
};

Pagination.propTypes = {
  totalRows: PropTypes.number,
  onChange: PropTypes.func,
};

export default Pagination;