import request from "./request";

export const sendCreateMember = async (data) =>
    request({
        url: "/v1/Member",
        method: "POST",
        data,
        isAuth: false,
    });
