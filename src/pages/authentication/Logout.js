import React, { useEffect } from 'react';
import { TOKEN } from 'utils/contants';

const Logout = (props) => {
    useEffect(() => {
        localStorage.removeItem(TOKEN);
        window.location.replace(window.location.origin + '/login');
    }, []);

    return (
        <></>
    );

}

export default Logout;
