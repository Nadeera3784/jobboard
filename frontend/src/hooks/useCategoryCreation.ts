import { useState } from 'react';
import axios from 'axios';

export interface createCategory {
    name: string
}

const useCategoryCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createCategory = async (categoryData: createCategory) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/v1/categories', categoryData);
      if (response.status !== 200) {
        throw new Error('Failed to create category');
      }
      setSuccess(true);
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, success, createCategory };
};

export default useCategoryCreation;
