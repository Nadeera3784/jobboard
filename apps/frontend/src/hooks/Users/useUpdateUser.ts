import { useState } from 'react';
import axios from 'axios';

import { ApiResponse, ResponseState, UpdateUserType } from '../../types';
import { HttpStatus, AppConstants } from '../../constants';

export const useUpdateUser = () => {
  const [response, setResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  const process = async (params: UpdateUserType, id: string) => {
    setResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const ENDPOINT = `${AppConstants.API_URL}/users/${id}`;

    try {
      const apiResponse = await axios.put<ApiResponse>(ENDPOINT, params);
      setResponse({
        errored: false,
        status: apiResponse.data.statusCode === HttpStatus.OK,
        message: apiResponse.data.message,
        data: apiResponse.data.data,
        status_code: apiResponse.status,
        loading: false,
      });
    } catch (error: any) {
      setResponse({
        errored: true,
        message:
          error.response?.data.errors ||
          error.response?.data.message ||
          error.message,
        data: {},
        status: false,
        status_code: error.response?.status || HttpStatus.BAD_REQUEST,
        loading: false,
      });
    }
  };

  return {
    response,
    process,
  };
};
