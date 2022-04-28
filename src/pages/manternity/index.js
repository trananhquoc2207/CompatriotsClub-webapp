import React, { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import styled from 'styled-components';
import dayJS from 'dayjs';

import { Table, Button } from 'reactstrap';
import LoadingIndicator from 'components/LoadingIndicator';
import CustomToolTip from 'components/CustomToolTip';
import Pagination from 'components/Pagination';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import manternityApi from 'api/manternityApi';
import DeleteModal from './components/DeleteModal';
import CreateEditModal from './components/CreateEditModal';

const ToolbarWrapper = styled.div`
    display: flex;
    padding: 0 0 8px 0;

    .right {
        margin-left: auto;
    }

    > *:not(.right) {
        width: 180px;
        margin-right: 6px;
    }

    & i {
        font-size: 10px;
    }
`;

const Manternity = ({ t: trans }) => {
    const { page } = useQueryString();
    const pushQueryString = usePushQueryString();

    const [openCreate, setOpenCreate] = useState(false);
    const [updateDetails, setUpdateDetails] = useState(undefined);
    const [deleteRecord, setDeleteRecord] = useState(undefined);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalRows: 1,
    });

    const handlePageChange = (page) => pushQueryString({ page });

    const fetch = async () => {
        const params = { page_size: pagination.limit, page_number: 1 };
        if (page !== undefined) {
            params.page_number = page;
        }
        try {
            setLoading(true);
            const { success, meta, data } = await manternityApi.get(params);
            if (success && data) {
                setData((data || []).map((o, i) => ({ ...o, index: (i + 1) + (meta.page_size * (meta.page_number - 1)) })));
                setPagination({
                    page: meta.page_number,
                    limit: meta.page_size,
                    totalRows: meta.total,
                });
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, [page]);

    return (
      <div className="page-content">
        {loading
                ?
                  <LoadingIndicator />
                :
                  <>
                    <ToolbarWrapper>
                      <div className="right">
                        <Button color="success" onClick={() => setOpenCreate(true)}><i className="bx bx-plus" /></Button>
                      </div>
                    </ToolbarWrapper>
                    <div className="table-responsive wrapper">
                      <Table className="table table-wrapper table-hover table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th className="text-left" style={{ width: '20px' }}>#</th>
                            <th className="text-left">{trans('Employee code')}</th>
                            <th className="text-left">{trans('Employee name')}</th>
                            <th className="text-left">{trans('Position')}</th>
                            <th className="text-center">{trans('Time')}</th>
                            <th className="text-center">{trans('Amount of day')}</th>
                            <th className="text-center" style={{ width: '50px' }}>{trans('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data &&
                                    data.length > 0 &&
                                    data
                                        .map((item, index) => {
                                            const start = dayJS(item?.ngayBatDauThaiSan ?? new Date());
                                            const end = start.add(item?.soNgayNghiThaiSan ?? 0, 'days');
                                            const status = start.subtract(dayJS(new Date()));
                                            return (
                                              <tr key={`tr_${index}`}>
                                                <td className="text-left">{item.index}</td>
                                                <td className="text-left">{item.nhanVien?.maNV ?? '-'}</td>
                                                <td className="text-left">{item.nhanVien?.tenNV ?? '-'}</td>
                                                <td className="text-left">{item.nhanVien?.chucVu ?? '-'}</td>
                                                <td className="text-center">
                                                  {`${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`}
                                                </td>
                                                <td className="text-center">{`${status.format('DD')} / ${item?.soNgayNghiThaiSan ?? '0'} ${trans('day(s)')}`}</td>
                                                <td className="text-center">
                                                  <span id={`edit_${index}`} className="mr-2" onClick={() => setUpdateDetails(item)}><i className="bx bx-xs bx-pencil" /></span>
                                                  <CustomToolTip id={`edit_${index}`} message={trans('Edit')} />

                                                  <span id={`remove_${index}`} onClick={() => setDeleteRecord(item)}><i className="bx bx-xs bx-trash-alt" /></span>
                                                  <CustomToolTip id={`remove_${index}`} message={trans('Delete')} />
                                                </td>
                                              </tr>
                                            );
                                        })}
                        </tbody>
                      </Table>
                    </div>
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />

                    <CreateEditModal
                      open={openCreate}
                      data={updateDetails}
                      onClose={() => {
                            setOpenCreate(false);
                            setUpdateDetails(undefined);
                        }}
                      onRefresh={fetch}
                    />
                    <DeleteModal
                      data={deleteRecord}
                      onClose={() => setDeleteRecord(undefined)}
                      onRefresh={fetch}
                    />
                  </>
            }
      </div>
    );
};

export default withNamespaces()(Manternity);
