import React from 'react';
import { Spinner } from 'reactstrap';

export default () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: window.innerHeight / 3 }}>
            <Spinner color={'primary'} />
        </div>
    )
}