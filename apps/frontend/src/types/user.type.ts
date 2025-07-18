export type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
  image?: {
    key: string;
    value: string;
  };
  resume?: {
    key: string;
    value: string;
  };
  about?: string;
  country?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  comments?: boolean;
  candidates?: boolean;
  offers?: boolean;
  pushNotifications?: string;
  created_at?: string;
  updated_at?: string;
  email_verified?: string;
  is_two_factor_authentication_enabled?: boolean;
};

export type CreateUserType = {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
  phone?: string;
  image?: File;
};

export type UpdateUserType = {
  name: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
  image?: File | undefined;
};

export type GetUserType = {
  id: string;
};

export type DeleteUserType = {
  endpoint: string;
};

export type UpdateUserSettingsType = {
  name: string;
  email: string;
  phone?: string;
  about?: string;
  country?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  comments?: boolean;
  candidates?: boolean;
  offers?: boolean;
  pushNotifications?: string;
};
