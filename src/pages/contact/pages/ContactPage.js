import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import CreateModal from '../components/CreateModal';
import UpdateModal from '../components/UpdateModal';
import DeleteModal from '../components/DeleteModal';
import { getContacts } from '../actions/contact';
import ContactFilter from '../components/ContactFilter';

const columns = [
  {
    name: 'index',
    label: '#',
    align: 'center',
    style: {
      width: '20px',
    },
  },
  {
    name: 'name',
    align: 'left',
    label: 'Tên ban liên lạc',
  },
  {
    name: 'description',
    align: 'left',
    label: 'Miêu tả',
  },
  {
    name: 'note',
    align: 'left',
    label: 'Ghi chú',
  },

];

const ContactPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const { contacts, getContactsLoading } = useSelector((s) =>{
    console.log(s);
    return s.contact
  } );
  const { data: contactList, totalSizes } = contacts;

  const handleRefresh = () => {
    const payload = {
      PageIndex: pageIndex,
      PageSize: pageSize,  
    //  ...filter,
    };
    console.log(payload);
    dispatch(getContacts(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [filter, pageIndex, pageSize]);

  return (
    <>
      <div className="page-content">
        <ContactFilter onChange={(f) => setFilter(f)} />
        <DataTable
          // loading={getContactsLoading}
          title="Ban liên lạc"
          columns={columns}
          data={
            (contactList || [])
              .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
          }
          totalRows={totalSizes}
          onPageChange={(index, size) => {
            if (index !== pageIndex) {
              setPageIndex(index);
            }
            if (size !== pageSize) {
              setPageSize(size);
            }
          }}
          rowActions={[
            {
              name: 'edit',
              label: 'Sửa',
              color: 'warning',
              icon: 'pencil',
              action: (d) => setModalUpdate(d),
            },
            {
              name: 'delete',
              label: 'Xóa',
              color: 'danger',
              icon: 'trash-alt',
              action: (d) => setModalDelete(d),
            },
          ]}
          tableActions={[
            {
              name: 'detail',
              label: 'Thêm',
              color: 'success',
              icon: 'plus',
              action: () => setModalCreate(true),
            },
          ]}
        />
      </div>
      <CreateModal
        open={modalCreate}
        onRefresh={handleRefresh}
        onClose={() => setModalCreate(false)}
      />
      <UpdateModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(undefined)}
      />
      <DeleteModal
        data={modalDelete}
        onRefresh={handleRefresh}
        onClose={() => setModalDelete(undefined)}
      />
    </>
  );
};

export default ContactPage;
