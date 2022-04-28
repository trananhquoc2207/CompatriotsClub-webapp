import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import { Row, Col } from 'reactstrap';
import Loader from 'components/Loader';
import Tooltip from 'components/CustomToolTip';
import Action from './Action';
import Pagination from './Pagination';

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
      height: 700px;
      display: block;
      background-color: #FFF;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 1px 1px 3px -1px #ccc;
      overflow-x: auto;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;   
      & .table-wrapper {
        font-size: 0.9rem;
        & thead {
          & tr {
            position: sticky;
            z-index: 3;
            top: 0px;
          }
        }
        & th {
          cursor: auto;
          background: #F9FAFB;
          text-align: inherit;
          padding: 0.9375em 0.8125em;
        }
        & td {
          padding: 0.4em 0.6em;
        }
        & .selected {
          background-color: #fff9d0;
        }
        & .active {
          background-color: #f8f9fa;
        }
      } 
      & .table__footer {
        border-top: 2px solid #ddd;
        position: sticky;
        left: 0;
        bottom: 0;
        z-index: 2;
        background-color: #F9FAFB;
      }
    }
  }
`;

const TableActionsWrapper = styled.div`
  width: 800px;
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

const ScheduleTable = (props) => {
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
    onClickCell,
    onClickRow,
  } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [selectedCell, setSelectedCell] = useState(undefined);

  const handleSelectedCell = (shift, employee) => {
    if (typeof onClickCell === 'function') {
      onClickCell(shift, employee);
    }
  };
  const onPageChange = (index, size) => {
    setPageIndex(index);
    setPageSize(size);
    if (typeof onPageChangeProps === 'function') {
      onPageChangeProps(index, size);
    }
  };

  const filteredData = useMemo(() => data.length > pageSize
      ? data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      : data, [data, pageIndex, pageSize]);

  const headNode = useMemo(() => (
    <thead>
      <tr>
        {(columns || []).map(({ align, label, style }, index) => (
          <th key={`col_${index}`} className={`text-${align || 'center'}`} style={{ ...style, backgroundColor: '#F9FAFB' }}>{label}</th>
        ))}
        {rowActions && (<th key={`col_${columns.length}`} className="text-center" />)}
      </tr>
    </thead>
  ), [columns]);
  const bodyNode = useMemo(() => (
    <tbody>
      {(filteredData || []).map((row, index) => (
        <tr style={{ height: '50px', alignItems: 'center' }} key={`row_${index}`} onClick={() => setSelectedRow(index)}>
          {(columns || []).map(({ align, name, render, style }, index) => (
            <td
              style={style}
              key={`${name}_${index}`}
              className={`text-${align || 'center'} `}
              onClick={() => { if (index > 2 && row[name]) { setSelectedCell(row[name][index - 3] || undefined); handleSelectedCell(row?.[name][index - 3], row?.employee); } }}
              className={classnames({ selected: (row[name] && selectedCell) ? row[name][index - 3]?.idLichLamViec === selectedCell?.idLichLamViec : false })}
            >
              {render ? render(row) : (row[name] || '')}
            </td>
          ))}
          {rowActions && (
            <td
              key={`row_${columns.length}`}
            >
              {(rowActions || []).map(({ name, label, icon, action }, _) => (
                <React.Fragment key={`action_${index}_${_}`}>
                  <span id={`${name}_${index}`} className="mr-2" onClick={() => action(row)}><i className={`bx bx-xs bx-${icon}`} /></span>
                  <Tooltip id={`${name}_${index}`} message={label} />
                </React.Fragment>
              ))}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  ), [columns, filteredData, selectedRow, selectedCell]);
  const paginationNode = useMemo(() => (
    <Pagination totalRows={totalRows} onChange={(index, size) => { onPageChange(index, size); }} />
  ), [totalRows, onPageChange]);

  return (
    <Wrapper>
      <Loader inverted active={loading} />
      <div className="table">
        {title && title !== '' && (
          <div className="table__header">
            <Row>
              <Col className="align-self-center">
                <div className="title">{title}</div>
                {description && description !== '' && (<div className="description">{description}</div>)}
              </Col>
              <Col>
                <TableActionsWrapper>
                  {(tableActions || []).filter((o) => !o?.hidden).map((o) => (
                    <Action
                      key={`table_${o?.name ?? ''}`}
                      name={o?.name ?? ''}
                      label={o?.label ?? ''}
                      icon={o?.icon ?? ''}
                      color={o?.color ?? ''}
                      text={o?.text ?? ''}
                      style={o?.style ?? {}}
                      action={o?.action ?? undefined}
                    />
                  ))}
                </TableActionsWrapper>
              </Col>
            </Row>
          </div>
        )}
        <div className="table__body">
          <table className="table table-wrapper table-hover table-nowrap mb-0 table-bordered">
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

export default ScheduleTable;
