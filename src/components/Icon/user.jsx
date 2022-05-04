import React from 'react';
import { Row, Col } from 'reactstrap';
const User = (props) => {

    return (
        <React.Fragment>
            <div className=" ">
                <span className="avatar-title rounded-circle" style={{ backgroundColor: '#2a3042', width: props.width, height: props.height }}>
                    <img src='https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png' alt="" className="rounded-circle" width={props.width} height={props.height} />
                </span>

            </div>
        </React.Fragment>
    )
}

export default User;