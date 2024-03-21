import { useState } from 'react';
import axios from 'axios';

import { ApiResponse, DeleteCategory, ResponseState } from '../../types';
import HttpStatus from '../../constants/HttpStatus';

export const useDeleteCategory = () => {
    const [response, setResponse] = useState<ResponseState>({
        status: false,
        loading: false,
        errored: false,
        data: {},
        status_code: HttpStatus.OK,
        message: ''
    });
    const process = async (params: DeleteCategory, finallyCallback?: (response: any) => void) => {
        setResponse(prevResponse => ({
            ...prevResponse,
            loading: true
        }));
        const ENDPOINT = params.endpoint;
        try {
            const apiResponse = await axios.delete<ApiResponse>(ENDPOINT);
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
                status_code: error.response?.status || HttpStatus.BAD_REQUEST,
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
