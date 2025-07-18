import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CompanySettingsForm } from '../../components/Company/CompanySettingsForm';
import appStateStore from '../../store';
import { UpdateUserSettingsType } from '../../types';
import { httpClient } from '../../utils';
import { AppConstants, HttpStatus } from '../../constants';

export const CompanySettingsPage = () => {
  const { user, getCurrentUser } = appStateStore(state => state);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleSubmit = async (
    formData: UpdateUserSettingsType,
    imageFile?: File,
  ) => {
    setIsLoading(true);
    try {
      let response;

      if (imageFile) {
        // Use FormData for file uploads
        const data = new FormData();

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            data.append(key, value.toString());
          }
        });

        // Append the image file
        data.append('image', imageFile);

        response = await httpClient.put(
          `${AppConstants.API_URL}/users/user-settings`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        // Use JSON for text-only updates
        response = await httpClient.put(
          `${AppConstants.API_URL}/users/user-settings`,
          formData,
        );
      }

      if (response.status === HttpStatus.OK) {
        toast.success('Company settings updated successfully!');
        getCurrentUser(); // Refresh user data
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update settings';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 mb-5">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Company Settings
            </h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>

        <CompanySettingsForm
          user={user}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
