import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Loader from 'components/Loader';
import CustomToolTip from 'components/CustomToolTip';
import FaceIDModal from 'pages/employee/components/FaceIDModal';
import AvatarUploadModal from 'pages/employee/components/details/AvatarUploadModal';

import { useSelector } from 'react-redux';
import { useAuth } from 'hooks/';
import { IMAGE_STATUS, WORK_STATUS } from 'pages/employee/utils/contants';

import avatar from 'assets/images/users/avatar_default.png';

const Wrapper = styled.div`
  position: relative;
  & .back {
    position: absolute;
    cursor: pointer;
    color: blue;
    font-size: 20px;
    z-index: 1000;
  }
  & .header {
    padding: 10px;
    text-align: center;
    &__avatar {
      margin-bottom: 5px;
      & .container {
        position: relative;
        &:hover {
          & .container__image {
            opacity: ${(props) => props.isAdmin ? '1' : '0.3'};
          }
          & .container__content {
            opacity: ${(props) => props.isAdmin ? '0' : '1'};
            cursor: ${(props) => props.isAdmin ? 'auto' : 'pointer'};
          }
        }
        &__image {
          display: block;
          object-fit: cover;
          border-radius:50%;
          width: 150px;
          height: 150px;
          margin: 0 auto;
          opacity: 1;
          transition: .5s ease;
          backface-visibility: hidden;
          border-radius: 50%;
        }
        &__content {
          position: absolute;
          top: 50%;
          left: 50%;
          opacity: 0;
          transition: .5s ease;
          transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          text-align: center;
          & i {
            font-size: 40px;
          }
        }
      }
    }
    &__name {
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 5px;
    }
    &__position {
      border-radius: 10rem;
      & span {
        display: inline-block;
        background: #ECF2FF;
        min-width: 8em;
        padding: 0.5em 0.75em;
        font-size: 14px;
        font-weight: 500;
        color: #3674FD;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        padding-right: 0.6em;
        padding-left: 0.6em;
        border-radius: 10rem;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
    }
  }
  & .content {
    margin: 0 !important;
    padding: 10px 18px !important;
    display: flex;
    flex-direction: column;
    & .item {
      padding-bottom: 10px;
      &__label {
        display: inline-block;
        margin-bottom: 3px;
        font-size: 14px;
        color: #939EA9;
      }
      &__content {
        display: block;
        font-size: 14px;
        color: #000000;
      }
    }
    & .item:last-child {
      padding: 0;
    }
  }
  & .badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &__secondary {
      color: #74788d;
      border: 1px solid #74788d;
      &:hover {
        cursor: pointer;
        color: white;
        background-color: #74788d;
      }
    }
    &__danger {
      color: #dc3545;
      border: 1px solid #dc3545;
    }
    &__warning {
      color: #ffc107;
      border: 1px solid #ffc107;
    }
    &__primary {
      color: #007bff;
      border: 1px solid #007bff;
    }
    &__success {
      color: #28a745;
      border: 1px solid #28a745;
    }
  }
`;
const StatusWrapper = styled.div`
  & span {
    display: inline-block;
    padding: 0.25em 0.4em;
    color: ${(props) => props.color};
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
    border: 1px solid ${(props) => props.color};
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    & .hover {
      &:hover {
        cursor: pointer;
        color: white;
        background-color: ${(props) => props.color};
      }
    }
  }
`;

const InformationGeneral = ({ onRefresh }) => {
  const [modalFaceID, setModalFaceID] = useState(undefined);
  const [avatarUploadModal, setAvatarUploadModal] = useState(false);

  const history = useHistory();
  const { isAdmin } = useAuth();
  const {
    employeeDetails,
    getEmployeeDetailsLoading,
  } = useSelector((state) => state.employee);

  return (
    <Wrapper isAdmin={isAdmin()}>
      <Loader inverted active={getEmployeeDetailsLoading} />
      <div className="wrapper">
        {(history.location?.state?.from ?? '') === '/employee' && (
          <div className="back" onClick={() => history.push('/employee')}>
            <i className="bx bx-arrow-back" />
          </div>
        )}
        <div className="header">
          <div className="header__avatar">
            <div className="container">
              <img className="container__image" src={employeeDetails?.avatar ?? avatar} />
              <div className="container__content" onClick={() => setAvatarUploadModal(true)}>
                <i className="bx bxs-camera" />
              </div>
            </div>
          </div>
          <div className="header__name">
            {employeeDetails?.tenNV ?? '-'}
          </div>
          <div className="header__position">
            <span>{employeeDetails?.ChucVu?.tenChucVu ?? '-'}</span>
          </div>
        </div>
        <div className="content">
          <div className="item">
            {(() => {
              const index = employeeDetails?.workStatus ?? 2;
              const { label } = WORK_STATUS[index];
              const { color } = WORK_STATUS[index];
              return (
                <>
                  <span className="item__label">Trạng thái</span>
                  <span className="item__content">
                    <StatusWrapper color={color}>
                      <span>{label}</span>
                    </StatusWrapper>
                  </span>
                </>
              );
            })()}
          </div>
          <div className="item">
            {(() => {
              const index = employeeDetails?.faceIdStatusEnum ?? 0;
              const { label } = IMAGE_STATUS[index];
              const { color } = IMAGE_STATUS[index];
              return (
                <>
                  <span className="item__label">Face ID</span>
                  <span className="item__content">
                    <StatusWrapper color={color}>
                      <span
                        id={`image-status_${employeeDetails?.id ?? 0}`}
                        className={(index === 0 || index === 1) && 'hover'}
                        onClick={() => (index === 0 || index === 1) && Boolean(employeeDetails?.id ?? false) && setModalFaceID(employeeDetails)}
                      >
                        {label}
                      </span>
                      {(index === 0 || index === 1) && Boolean(employeeDetails?.id ?? false) && (
                        <CustomToolTip id={`image-status_${employeeDetails?.id ?? 0}`} message="Lấy khuôn mặt" />
                      )}
                    </StatusWrapper>
                  </span>
                </>
              );
            })()}
          </div>
          <div className="item">
            <span className="item__label">Số điện thoại</span>
            <span className="item__content">{(employeeDetails?.soDienThoai ?? '') !== '' ? employeeDetails.soDienThoai.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3') : '-'}</span>
          </div>
          <div className="item">
            <span className="item__label">Email</span>
            <span className="item__content">{employeeDetails?.email ?? '-'}</span>
          </div>
          <div className="item">
            <span className="item__label">Đơn vị</span>
            <span className="item__content">{employeeDetails?.DonVi?.tenDonVi ?? '-'}</span>
          </div>
          <div className="item">
            <span className="item__label">Chi nhánh</span>
            <span className="item__content">{employeeDetails?.ChiNhanh?.tenChiNhanh ?? '-'}</span>
          </div>
        </div>
      </div>

      <FaceIDModal
        data={modalFaceID}
        onClose={() => setModalFaceID(undefined)}
      />
      <AvatarUploadModal
        open={avatarUploadModal}
        onRefresh={onRefresh}
        onClose={() => setAvatarUploadModal(false)}
      />
    </Wrapper>
  );
};

export default InformationGeneral;
