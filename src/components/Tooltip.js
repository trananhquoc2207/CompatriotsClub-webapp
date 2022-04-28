import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const CustomToolTip = (props) => {
    const { id, message } = props;
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <Tooltip isOpen={open} target={id} toggle={toggle}>{message}</Tooltip>
    )
}

export default CustomToolTip;