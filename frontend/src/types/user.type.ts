export type CreateUser = {
    name: string;
    email: string;
    password: string;
    role?: string;
    status?: string;
    phone?: string;
    image?: string
}