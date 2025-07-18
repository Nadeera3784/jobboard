import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, User, FileText } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileCompletionProps {
  user: UserType | null;
}

export const ProfileCompletion = ({ user }: ProfileCompletionProps) => {
  const hasProfilePicture = !!user?.image?.value;
  const hasResume = !!user?.resume?.value;
  
  const completedItems = [hasProfilePicture, hasResume].filter(Boolean).length;
  const totalItems = 2;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  
  const isComplete = completedItems === totalItems;

  // Hide the indicator when profile is 100% complete
  if (isComplete) {
    return null;
  }

  return (
    <div className="px-4 py-3 mb-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Profile Completion</h3>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {completionPercentage}%
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 bg-yellow-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Completion Items */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm">
            <div className="flex items-center">
              {hasProfilePicture ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              )}
              <User className="h-4 w-4 text-gray-400 ml-2 mr-2" />
              <span className={hasProfilePicture ? 'text-gray-700' : 'text-gray-500'}>
                Profile Picture
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center">
              {hasResume ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              )}
              <FileText className="h-4 w-4 text-gray-400 ml-2 mr-2" />
              <span className={hasResume ? 'text-gray-700' : 'text-gray-500'}>
                Resume
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/user/settings"
          className="block w-full text-center text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200"
        >
          Complete Profile
        </Link>
      </div>
    </div>
  );
}; 