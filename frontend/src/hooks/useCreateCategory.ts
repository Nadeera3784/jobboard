import { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
    status: boolean;
    message: string;
    data: any[];
}

export interface CreateCategory {
    name: string;
}

export const useCreateCategory = () => {
    const [response, setResponse] = useState({
        status: true,
        loading: false,
        errored: false,
        data: {},
        status_code: null as number | null, // Type annotation for status_code
        message: ''
    });

    const process = async (params: CreateCategory, finallyCallback?: (response: any) => void) => {
        setResponse(prevResponse => ({
            ...prevResponse,
            loading: true
        }));
        const ENDPOINT = `http://127.0.0.1:3000/api/v1/categories`;

        try {
            const apiResponse = await axios.post<ApiResponse>(ENDPOINT, params);
            setResponse({
                errored: false,
                status: apiResponse.data.status,
                message: apiResponse.data.message,
                data: apiResponse.data.data,
                status_code: apiResponse.status,
                loading: false
            });
        } catch (error: any) {
            setResponse({
                errored: true,
                message: error.response?.data.errors || error.response?.data.message || error.message,
                data: [],
                status: false,
                status_code: error.response?.status || null,
                loading: false
            });
        } finally {
            if (typeof finallyCallback === 'function') {
                finallyCallback(response);
            }
        }
    };

    return {
        response,
        process
    };
};
