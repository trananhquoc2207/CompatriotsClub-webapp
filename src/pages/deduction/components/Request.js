import React from 'react';
import dayJS from 'dayjs';
import styled from 'styled-components';

import { Row, Col } from 'reactstrap';
import { formatCurrency } from 'utils/helpers';

const Wrapper = styled.div`
    & .header {
        text-align: center;
        margin-bottom: 1.2rem;
        &__date {
            padding: 0 1.5rem;
            margin-top: 0.6rem;
            font-size: 14px;
            text-align: end;
        }
    }
    & .body {
        &__title {
            text-align: center;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 0.6rem;
        }
        &__header {
            font-size: 15px;
            padding: 0 4rem;
            margin-bottom: 0.6rem;
        }
        &__content {
            font-size: 15px;
            margin-bottom: 3rem;
            & .line {
                text-indent: 3rem;
                margin-bottom: 4px;
            }
        }
        &__footer {
            & .block {
                text-align: center;
                &__header {
                    font-weight: bold;
                    font-size: 14px;
                }
                &__description {
                    font-weight: 500;
                    font-size: 13px;
                    font-style: italic;
                }
                &__sign {
                    & .image {
                        max-weight: 100px;
                        max-height: 100px;
                    }
                    & .description {
                        margin-top: 14px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
`;

const Request = ({ data }) => {
    return (
        <Wrapper>
            <div className="header">
                <h4>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                <h5>Độc lập - Tự do - Hạnh phúc</h5>
                <div className="header__date">
                    ngày {dayJS(data?.time ?? new Date()).format('DD')}, tháng {dayJS(data?.time ?? new Date()).format('MM')}, năm {dayJS(data?.time ?? new Date()).format('YYYY')}
                </div>
            </div>
            <div className="body">
                <div className="body__title">ĐƠN XIN TẠM ỨNG LƯƠNG</div>
                <div className="body__header">
                    <Row>
                        <Col xs="4" style={{ textAlign: 'end' }}>Kính gửi:</Col>
                        <Col style={{ padding: '0' }}>
                            - Ban Giám đốc Công ty<br />
                            - Phòng Tài chính - Kế toán
                        </Col>
                    </Row>
                </div>
                <div className="body__content">
                    <div className="line">Tôi tên là: <span className="ml-1 font-weight-bold">{data?.employee?.name ?? '-'}</span></div>
                    <div className="line">Vì lí do: <span className="ml-1">{data?.reason ?? '-'}</span></div>
                    <div className="line">Số tiền: <span className="ml-1">{formatCurrency(data?.amount ?? 0, 'đ')}</span></div>
                    <div className="line">Kính mong <span className="font-weight-bold">Ban Giám đốc</span> sẽ chấp thuận.</div>
                    <div className="line">Xin chân trọng cảm ơn.</div>
                </div>
                <div className="body__footer">
                    <Row className="justify-content-between">
                        <Col xs="4">
                            <div className="block">
                                <div className="block__header">Ban giám đốc</div>
                            </div>
                        </Col>
                        <Col xs="4">
                            <div className="block">
                                <div className="block__header">Người viết đơn</div>
                                <div className="block__description">(Ghi rõ họ và tên)</div>
                                <div className="block__sign">
                                    {data?.sign ? <img className="image" src={`data:image/png;base64, ${data.sign}`} /> : null}
                                    <div className="description">{data?.employee?.name ?? ''}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Wrapper>
    )
};

export default Request;