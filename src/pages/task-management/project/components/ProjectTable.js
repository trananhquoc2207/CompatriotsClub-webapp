import React, { useMemo } from 'react';

import Tooltip from 'components/CustomToolTip';

const ProjectTable = ({ columns, data, rowActions, handleClickRow }) => {

    const headNode = useMemo(() => (
        <thead>
            <tr>
                {(columns || []).map(({ align, label }, index) => (
                    <th key={`col_${index}`} className={`text-${align || 'center'}`}>{label}</th>
                ))}
                {rowActions && (<th key={`col_${columns.length}`} className="text-center"></th>)}
            </tr>
        </thead>
    ), [columns]);

    const bodyNode = useMemo(() => (
        <tbody>
            {(data || []).map((row, index) => (
                <tr key={'row_' + index} >
                    {(columns || []).map(({ align, name, render }, index) => (
                        <td key={`${name}_${index}`} className={`text-${align || 'center'}`}>
                            {name === 'name' ?
                                <div onClick={() => { handleClickRow(row) }} style={{ cursor: 'pointer' }}>
                                    <h5 className="text-truncate font-size-14" style={{ color: '#0052CC' }}>{row?.name}</h5>
                                    <p className="text-muted mb-0">{row?.description}</p>
                                </div>
                                : render ? render(row) : (row[name] || '')
                            }
                        </td>
                    ))}
                    {rowActions && (
                        <td key={`row_${columns.length}`} >
                            {(rowActions || []).map(({ name, label, icon, action }, _) => (
                                <React.Fragment key={`action_${index}_${_}`}>
                                    <span id={`${name}_${index}`} className="mr-2" onClick={() => action(row)}><i className={`bx bx-xs bx-${icon}`}></i></span>
                                    <Tooltip id={`${name}_${index}`} message={label} />
                                </React.Fragment>
                            ))}
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    ), [data]);

    return (
        <>{/* project-list-table table-nowrap table-centered table-borderless */}
            <table className="table table-wrapper table-centered table-hover table-nowrap mb-3">
                {headNode}
                {bodyNode}
            </table>
            {/* <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
            /> */}
        </>
    )
};

export default ProjectTable;