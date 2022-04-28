import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export default () => {
    const location = useLocation();
    const history = useHistory();
    function handlePushQueryString(data) {
        const rawQuery = { ...queryString.parse(location.search), ...data };

        const parseQuery = {};
        Object.keys(rawQuery).forEach(key => {
            if (rawQuery[key] !== '')
                parseQuery[key] = rawQuery[key];
        })

        history.push({ search: `?${queryString.stringify(parseQuery)}` }, history.location?.state ?? undefined);
    }

    return handlePushQueryString;
};