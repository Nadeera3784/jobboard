import { useState } from 'react';
import axios from 'axios';

import { ApiResponse, GetCategory, ResponseState } from '../types';
import AppConstants from '../constants/AppConstants';

export const useGetCategoryById = () => {
    const [response, setResponse] = useState<ResponseState>({
        status: false,
        loading: false,
        errored: false,
        data: {},
        status_code: 400,
        message: ''
    });

    const process = async (params: GetCategory, finallyCallback?: (response: any) => void) => {
        setResponse(prevResponse => ({
            ...prevResponse,
            loading: true
        }));
        const ENDPOINT = `${AppConstants.API_URL}/categories/${params.id}`;
        try {
            const apiResponse = await axios.get<ApiResponse>(ENDPOINT);
            setResponse({
                errored: false,
                status: apiResponse.data.type === 'success',
                message: apiResponse.data.message,
                data: apiResponse.data.data,
                status_code: apiResponse.status,
                loading: false
            });
        } catch (error: any) {
            setResponse({
                errored: true,
                message: error.response?.data.errors || error.response?.data.message || error.message,
                data: {},
                status: false,
                status_code: error.response?.status || 400,
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