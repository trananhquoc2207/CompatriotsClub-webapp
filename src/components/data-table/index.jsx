/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Row, Col, Button } from 'reactstrap';
import Loader from 'components/Loader';
import Tooltip from 'components/CustomToolTip';
import { Action, ActionDropdown } from 'components/data-table/Action';
import Pagination from 'components/data-table/Pagination';

const Wrapper = styled.div`
  position: relative;
  & .content {
    margin-top: 20px !important;
  }
  & .table {
    &__header {
      margin-bottom: 10px;
      & .title {
        font-size: 20px;
        font-weight: 700;
      }
      & .description {
        font-style: italic;
      }
    }
    &__body {
      width: 100%;
      display: block;
      background-color: #FFF;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 1px 1px 3px -1px #ccc;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;   
      & .table-wrapper {
        font-size: 0.9rem;
        & th {
          cursor: auto;
          background: #F9FAFB;
          text-align: inherit;
          padding: 0.9375em 0.8125em;
        }
        & td {
          padding: 0.4em 0.6em;
        }
        & .active {
          background-color: #f8f9fa;
        }
      } 
      & .table__footer {
        border-top: 2px solid #ddd;
      }
    }
  }
`;
const StyledButton = styled(Button)`
  padding: 0.2em 0.45em;
  & i {
    font-size: 18px;
    font-weight: 700;
    vertical-align: middle;
    padding-bottom: 2px;
  }
`;

const TableActionsWrapper = styled.div`
  margin-right: 0px;
  display: flex;
  justify-content: flex-end !important;
  & button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const Table = (props) => {
  const {
    loading = false,
    title,
    description,
    columns,
    data,
    totalRows,
    onPageChange: onPageChangeProps,
    rowActions,
    tableActions,
    onClickRow,
  } = props;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSelectedRow = (d, i) => {
    if (typeof onClickRow === 'function') {
      setSelectedRow(i);
      onClickRow(d);
    }
  };
  const onPageChange = (index, size) => {
    setPageIndex(index);
    setPageSize(size);
    if (typeof onPageChangeProps === 'function') {
      onPageChangeProps(index, size);
    }
  };

  const filteredData = useMemo(() => {
    const cloneData = _.cloneDeep(data);
    return cloneData.length > pageSize
      ? cloneData.slice(pageIndex * pageSize, (pageIndex * pageSize) + pageSize)
      : cloneData;
  }, [data, pageIndex, pageSize]);
  const headNode = useMemo(() => (
    <thead>
      <tr>
        {(columns || []).map(({ align, label, style }, index) => (
          <th key={`col_${index}`} className={`text-${align || 'center'}`} style={style || {}}>
            {typeof label === 'function' ? label() : label}
          </th>
        ))}
        {rowActions && (<th key={`col_${columns.length}`} className="text-center" />)}
      </tr>
    </thead>
  ), [columns]);
  const bodyNode = useMemo(() => (
    <tbody>
      {(filteredData || []).map((row, index) => (
        <tr key={`row_${index}`} onClick={() => handleSelectedRow(row, index)} className={selectedRow === index ? 'active' : ''}>
          {(columns || []).map(({ align, name, render }, jndex) => (
            <td key={`${name}_${jndex}`} className={`text-${align || 'center'} align-middle`}>
              {render ? render(row) : (row[name] || '')}
            </td>
          ))}
          {rowActions && (
            <td key={`row_${columns.length}`} className="align-middle">
              {(rowActions || []).filter((a) => !a?.hidden).map(({ name, label, icon, color, action }, __) => (
                <React.Fragment key={`action_${index}_${__}`}>
                  <span id={`${name}_${index}`} className="mr-3" onClick={() => action(row)}>
                    <StyledButton
                      outline
                      color={color}
                    >
                      <i className={`bx bx-xs bx-${icon}`} />
                    </StyledButton>
                  </span>
                  <Tooltip id={`${name}_${index}`} message={label} />
                </React.Fragment>
              ))}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  ), [columns, filteredData, selectedRow]);
  const paginationNode = useMemo(() => (
    <Pagination totalRows={totalRows} onChange={(index, size) => { onPageChange(index, size); }} />
  ), [totalRows, onPageChange]);

  return (
    <Wrapper>
      <Loader inverted active={loading} />
      <div className="table">
        {title && title !== '' && (
          <div className="table__header">
            <FlexWrapper>
              <div>
                <div className="title">{title}</div>
                {description && description !== '' && (<div className="description">{description}</div>)}
              </div>
              {(tableActions || []).filter((o) => !o?.hidden).length > 0 && (
                <div style={{ marginLeft: 'auto' }}>
                  <TableActionsWrapper>
                    {
                      (tableActions || []).filter((o) => !o?.hidden).map((o) =>
                        o?.dropdown
                        ? (
                          <ActionDropdown
                            key={`table_${o?.name ?? ''}`}
                            label={o?.label ?? ''}
                            icon={o?.icon ?? ''}
                            dropdownActions={o?.dropdownActions ?? []}
                          />
                        )
                        : (
                          <Action
                            key={`table_${o?.name ?? ''}`}
                            name={o?.name ?? ''}
                            label={o?.label ?? ''}
                            icon={o?.icon ?? ''}
                            color={o?.color ?? ''}
                            note={o?.text ?? ''}
                            action={o?.action ?? undefined}
                            style={o?.style ?? {}}
                          />
                        ))
                    }
                  </TableActionsWrapper>
                </div>
              )}
            </FlexWrapper>
          </div>
        )}
        <div className="table__body">
          <table className="table table-wrapper table-hover table-nowrap mb-0">
            {headNode}
            {bodyNode}
          </table>
          <div className="table__footer">
            {paginationNode}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Table;
