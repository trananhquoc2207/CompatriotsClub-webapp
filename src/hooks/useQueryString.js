import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

export default () => {
    const location = useLocation();
    const query = useMemo(() =>
        queryString.parse(location.search), [location.search]
    );

    return query;
}