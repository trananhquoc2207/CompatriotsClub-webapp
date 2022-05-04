const TOKEN_KEY = 'CompatriotsClub';
export const getToken = (key = TOKEN_KEY) => {
    return localStorage.getItem(key);
};

export const setToken = (key = TOKEN_KEY, value) => {
    return localStorage.setItem(key, value);
};

export const removeToken = (key = TOKEN_KEY) => {
    return localStorage.removeItem(key);
};
