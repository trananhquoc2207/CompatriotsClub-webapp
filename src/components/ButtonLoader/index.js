import React, { useState } from 'react';
import { Button, Spinner } from 'reactstrap';

const ButtonLoader = props => {
    const { handle, value, ...otherProps } = props;
    
    const [loading, setLoading] = useState(false);

    const handleClick = event => {
        setLoading(true); handle(event);
    }

    return (
        <React.Fragment>
            <Button disabled={loading} onClick={event => { handleClick(event) }} {...otherProps}>
                {loading ? <Spinner size="sm" color="white" />: value}
            </Button> 
        </React.Fragment>
    )
}

export default ButtonLoader;
