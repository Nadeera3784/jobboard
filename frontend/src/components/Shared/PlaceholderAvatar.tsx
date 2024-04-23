import React from "react";
import { getInitials } from "../../utils";
import { PlaceholderAvatarType } from "../../types";

const PlaceholderAvatar: React.FC<PlaceholderAvatarType> = ({ name }) => {
  return (
    <div className="relative inline-flex items-center justify-center h-12 w-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(name)}</span>
    </div>
  );
};

export default PlaceholderAvatar;