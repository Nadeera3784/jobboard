export type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
  image?: File;
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
