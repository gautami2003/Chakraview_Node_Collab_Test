import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

// const router = useRouter();
const removeCookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

function getHeaders(isPublic) {
    const headers = { 'Content-Type': 'application/json' };

    if (!isPublic) {
        headers["Authorization"] = `Basic ${getToken()}`;
    }
    return headers
};

export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || "";
    }
    return "";
};

// export const getParentLoginToken = () => {
//     if (typeof window !== "undefined") {
//         return localStorage.getItem("parent-login-token") || "";
//     }
//     return "";
// };

export const checkRoles = () => {
    const token = getToken();
    if (token) {
        const tokenDecoded = jwtDecode(token)
        const roles = tokenDecoded.roles.map((data) => data.slug) || []
        return roles;
    }
    return [];
};

export const getData = async (path, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.get(`${BaseUrl}/${path}`, {
            headers
        });
        console.log(response, "responseresponseresponseresponseresponse");

        return response.data;
    } catch (error) {
        if (error && error.response && error.response.status === 403 || error.response.status === 401) {
            localStorage.removeItem("token");
            document.cookie = removeCookie;
            // router.push("/login");
            window.location.href = "/login";
        };
        throw error;
    };
};

export const postData = async (path, data, isPublic = false) => {
    try {
        const headers = getHeaders(isPublic);
        const response = await axios.post(`${BaseUrl}/${path}`, data, {
            headers
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const putData = async (path, data) => {
    try {
        const response = await axios.put(`${BaseUrl}/${path}`, data, {
            headers: {
                'Authorization': `Basic ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const patchData = async (path, data) => {
    try {
        const response = await axios.patch(`${BaseUrl}/${path}`, data, {
            headers: {
                'Authorization': `Basic ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteRequest = async (path, data) => {
    try {
        const response = await axios.delete(`${BaseUrl}/${path}`, {
            data: data,
            headers: {
                'Authorization': `Basic ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
};