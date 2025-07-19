import { useEffect, useState } from 'react';

import JobCardBasic from '../Search/JobCardBasic';
import { Intercom } from '../../utils';
import { HttpStatus } from '../../constants';
import { ApiResponse, ResponseState } from '../../types';

const LatestJobList = () => {
  const [searchReponse, setSearchResponse] = useState<ResponseState>({
    status: false,
    loading: false,
    errored: false,
    data: {},
    status_code: HttpStatus.OK,
    message: '',
  });

  const processSearch = async (query: string) => {
    setSearchResponse(prevResponse => ({
      ...prevResponse,
      loading: true,
    }));
    const ENDPOINT = `/jobs/search${query}`;
    try {
      const apiResponse = await Intercom.get<ApiResponse>(ENDPOINT);
      setSearchResponse({
        errored: false,
        status: apiResponse.data.statusCode === HttpStatus.OK,
        message: apiResponse.data.message,
        data: apiResponse.data.data,
        status_code: apiResponse.status,
        loading: false,
      });
    } catch (error: any) {
      setSearchResponse({
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

  const order = {
    name: 1,
    category: 1,
    location: 1,
    remote: 1,
    job_type: 1,
    experience_level: 1,
  };

  useEffect(() => {
    const queryURL = `?order=${encodeURIComponent(JSON.stringify(order))}&limit=${6}&page=${1}`;
    processSearch(queryURL);
  }, [searchReponse.status]);

  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -m-4">
          {searchReponse?.data?.data &&
            (searchReponse.data.data as any[]).map((job, key) => (
              <JobCardBasic key={key} job={job} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobList;
