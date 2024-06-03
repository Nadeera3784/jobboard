import { useState } from 'react';

import { ApiResponse, ResponseState } from '../types';
import { HttpStatus } from '../constants';
import { httpClient } from '../utils';

export const useSharedDeleteApi = () => {
  const [response, setResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: null,
    message: '',
  });
  const process = async (endpoint: string) => {
    setResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    try {
      const apiResponse = await httpClient.delete<ApiResponse>(endpoint);
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
