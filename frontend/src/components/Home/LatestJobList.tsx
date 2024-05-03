import { useEffect } from 'react';

import JobCardBasic from '../Search/JobCardBasic';
import { useGetSearch } from '../../hooks/Search/useGetSearch';

const LatestJobList = () => {
  const { response: searchReponse, process: processSearch } = useGetSearch();

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
