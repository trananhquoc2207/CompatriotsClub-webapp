import React, { useState } from 'react';
import styled from 'styled-components';
import JSZip from 'jszip';
import dayJS from 'dayjs';
import axios from 'axios';

import { Spinner, Button, Modal, ModalHeader, ModalBody, Progress } from 'reactstrap';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
    #container-circles {
        display: none;
    }
    .btn {
        padding: 0.4rem 1.2rem;
        font-size: 0.9rem;
    }
`;
const StyledIcon = styled.div`
    display: flex;
    justify-content: center;
    & i {
        color: #34c38f;
        font-size: 8em;
    }
`;
const StyledLabel = styled.div`
    margin-top: 0.3rem;
    text-align: center;
    color: rgb(89, 89, 89);
    font-size: 1.5em;
    font-weight: 600;
`;

const ButtonLoader = ({ loading, content, onClick, ...otherProps }) => (
  <Button disabled={loading} onClick={event => { onClick(event) }} {...otherProps}>
    {loading ? (
      <div>
        <Spinner size="sm" color="white" /> {content}
      </div>
    ) : content}
  </Button>
);

const IMAGES = 20;
const CHUNK_FILE = 20;


const FaceIDModal = ({ data, onClose }) => {
  const [images, setImages] = useState([]);
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const request = (data) => new Promise((resolve, reject) => {
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        //console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        if (percent < 100) {
          setUploadPercentage(percent);
        }
      }
    }
    axios.post('https://api-face-id.systemkul.com/api/File', data, options)
      .then((res) => {
        setUploadPercentage(100, () => {
          setTimeout(() => {
            setUploadPercentage(0)
          }, 1000);
        })
      })
      .catch((err) => reject(err))
  });

  const upload = () => {
    try {
      setCapturing(true);
      const step = CHUNK_FILE;
      const length = images.length;
      for (let chunk = 0; chunk < Math.round(length / step); chunk++) {
        const presentStep = chunk * step;
        const nextStep = presentStep === 0 ? step : presentStep * 2;
        const zip = new JSZip();
        for (let i = presentStep; i < nextStep && i < length; i++) {
          const image = images[i]?.split(',')[1] ?? undefined;
          if (image) {
            zip.file(`Image${i + 1}.png`, image, { base64: true });
          }
        }
        zip
          .generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } })
          .then((content) => {
            const filename = `${window.location.hostname}_${data?.maNV ?? dayJS().unix()}_${chunk + 1}.zip`;
            const file = new FormData();
            file.append('file', content, filename);
            request(file).catch((err) => { console.log(err) })
          });
      }
    } catch (err) {
    } finally {
      setDone(true);
      setCapturing(false);
    }
  }

  const handleTakePhoto = (d) => {
    if (!canceled && images.length <= IMAGES - 1) {
      setCapturing(true);
      setImages((state) => [...state, d]);
      setPercent((state) => state + 100 / IMAGES);
      setTimeout(function () {
        document.getElementById('inner-circle').click();
      }, 1500);
    } else {
      setPercent(0);
      setCapturing(false);
      if (images.length >= IMAGES) {
        try {
          upload();
        } catch (err) { }
      } else {
        setImages([]);
      }
    }
  };

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <ModalHeader>
        Lấy khuôn mặt
      </ModalHeader>
      <ModalBody>
        {done && (
          <>
            {
              uploadPercentage < 100 ?
                <div>
                  <div className="text-center">Đang gửi dữ liệu...</div>
                  <Progress animated color="info" value={uploadPercentage} style={{ minHeight: '20px' }} />
                </div>
                :
                uploadPercentage === 100 && (
                  <div>
                    <StyledIcon>
                      <i className="bx bx-check-circle"></i>
                    </StyledIcon>
                    <StyledLabel>
                      Bạn đã lấy khuôn mặt thành công
                    </StyledLabel>
                  </div>
                )
            }
          </>
        )}
        {!done && (
          <Camera
            isMaxResolution
            isSilentMode
            isDisplayStartCameraError
            idealFacingMode={FACING_MODES.USER}
            idealResolution={{ width: 550, height: 480 }}
            imageType={IMAGE_TYPES.PNG}
            imageCompression={0.97}
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
          />
        )}
        <div className="d-flex justify-content-center mt-3">
          {!done && (
            <>
              <ButtonLoader
                loading={capturing}
                color="primary"
                content={capturing ? `${Math.round(percent * 100) / 100}%` : 'Bắt đầu'}
                onClick={() => {
                  setDone(false);
                  setCanceled(false);
                  document.getElementById('inner-circle').click();
                }}
              />
              {capturing && (<Button color="danger" className="ml-2" onClick={() => setCanceled(true)}>Huỷ</Button>)}
            </>
          )}
          {(done || !capturing) && (
            <Button
              className="ml-2"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  setImages([]);
                  setDone(false);
                  setCanceled(false);
                }, 500);
              }}
            >
              Đóng
            </Button>
          )}
        </div>
      </ModalBody>
    </StyledModal>
  )
};

export default FaceIDModal;