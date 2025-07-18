import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SettingsForm } from '../../components/User/SettingsForm';
import appStateStore from '../../store';
import { httpClient } from '../../utils';
import { User, UpdateUserType } from '../../types';
import { HttpStatus, AppConstants } from '../../constants';

export const SettingsPage = () => {
  const { user, getCurrentUser } = appStateStore(state => state);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleSubmit = async (formData: UpdateUserType) => {
    if (!user?._id) {
      toast.error('User not found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await httpClient.put(
        `${AppConstants.API_URL}/users/${user._id}`,
        formData,
      );

      if (response.status === HttpStatus.OK) {
        toast.success('Settings updated successfully!');
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
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>

        <SettingsForm
          user={user}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
