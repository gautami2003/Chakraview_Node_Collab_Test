import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = (isPublic) => {
    const headers = { 'Content-Type': 'application/json' };

    if (!isPublic) {
        headers["Authorization"] = `Basic ${getParentLoginToken()}`;
    }
    return headers
};

const handleAuthError = (error) => {
    console.log(error.response);
    if (error && error.response && (error.response.status === 403 || error.response.status === 401)) {
        localStorage.removeItem("token");
        document.cookie = "parent-login-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/student-login";
    }
};


export const getParentLoginToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("parent-login-token") || "";
    }
    return "";
};

export const getData = async (path, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.get(`${BaseUrl}/${path}`, {
            headers
        });

        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    };
};

export const postData = async (path, data = {}, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.post(`${BaseUrl}/${path}`, data, {
            headers
        });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};

export const putData = async (path, data = {}, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.put(`${BaseUrl}/${path}`, data, {
            headers
        });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};

export const patchData = async (path, data = {}, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.patch(`${BaseUrl}/${path}`, data, {
            headers
        });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};

export const deleteRequest = async (path, data = {}, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.delete(`${BaseUrl}/${path}`, {
            data: data,
            headers
        });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};