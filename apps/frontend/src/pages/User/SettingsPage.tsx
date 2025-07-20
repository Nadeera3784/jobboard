import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SettingsForm } from '../../components/User/SettingsForm';
import appStateStore from '../../store';
import { Intercom } from '../../utils';
import { UpdateUserSettingsType } from '../../types';
import { HttpStatus, AppConstants } from '../../constants';

export const SettingsPage = () => {
  const { user, getCurrentUser } = appStateStore(state => state);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleSubmit = async (
    formData: UpdateUserSettingsType,
    imageFile?: File,
    resumeFile?: File,
  ) => {
    if (!user?._id) {
      toast.error('User not found');
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (imageFile || resumeFile) {
        // Use FormData for file uploads
        const data = new FormData();

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            data.append(key, value.toString());
          }
        });

        // Append files if present
        if (imageFile) {
          data.append('image', imageFile);
        }
        if (resumeFile) {
          data.append('resume', resumeFile);
        }

        response = await Intercom.put(
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
        response = await Intercom.put(
          `${AppConstants.API_URL}/users/user-settings`,
          formData,
        );
      }

      if (response.status === HttpStatus.OK) {
        toast.success('Settings updated successfully!');
        getCurrentUser();
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update settings';
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
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
          <SettingsForm
            user={user}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
