import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const TestPage = () => {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      // Define your API base URL
      const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';
      // Define your endpoint
      const endpoint = '/jobs';
      // Define your query parameters (replace with your actual parameters)
      const filter = {
          category: { $regex: null },
          location: { $regex: null },
          remote: { $regex: null },
          job_type: { $regex: null },
          experience_level: { $regex: null}
      };
      const search = {
          $regex: '',
          $options: 'i'
      };
      const order = {
        name: 1,
        category: 1,
        location: 1,
        remote: 1,
        job_type: 1,
        experience_level: 1,
        created_at: 1,
      };
      const limit = Number(10);
      const page = 1;

      // Construct the query string
      const queryString = `?filter=${encodeURIComponent(JSON.stringify(filter))}&search=${encodeURIComponent(JSON.stringify(search))}&order=${encodeURIComponent(JSON.stringify(order))}&limit=${limit}&page=${page}`;

      // Construct the request URL
      const requestURL = `${API_BASE_URL}${endpoint}${queryString}`;

      // Make the request using Axios
      axios.get(requestURL)
          .then(response => {
             console.log('DEBUG', response.data);
              setJobs(response.data);
          })
          .catch(error => {
              console.error('Error:', error);
          });
  }, []); // Empty dependency array to ensure the effect runs only once

    return (
        <div>
        <h2>Test page</h2>
        </div>
    )
}