import { useState } from 'react';

import { ApiResponse, ResponseState } from '../../types';
import { HttpStatus, AppConstants } from '../../constants';
import { httpClient } from '../../utils';

export const useCreateUser = () => {
  const [response, setResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  const process = async (data: any) => {
    setResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const ENDPOINT = `${AppConstants.API_URL}/users`;

    try {
      let formData = new FormData();
      const keys = Object.keys(data);

      if (typeof data == 'object' && keys.length > 0) {
        keys.forEach(key => {
          formData.append(key, data[key]);
        });
      }

      const apiResponse = await httpClient.post<ApiResponse>(ENDPOINT, formData);
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
