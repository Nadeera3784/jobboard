export type ApiResponse = {
    statusCode: number;
    message: string;
    data: any;
}
  
export type ResponseState = {
    status: boolean;
    loading: boolean;
    errored: boolean;
    data: any;
    status_code: number | null;
    message: string;
};