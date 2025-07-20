export type ApiResponse<T = unknown> = {
  status: boolean;
  statusCode: number;
  data: T;
  message: string;
};

export type ErrorResponse<T = unknown> = {
  status: boolean;
  statusCode: number;
  data: T;
  message: string;
};
