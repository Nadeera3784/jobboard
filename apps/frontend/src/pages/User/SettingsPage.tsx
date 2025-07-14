import { SettingsForm } from "../../components/User/SettingsForm";

export const SettingsPage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container p-4 lg:p-8">
        <div className="flex-1 space-y-4 mb-5">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>

        <SettingsForm/>   
  
      </div>
    </div>
  );
};
