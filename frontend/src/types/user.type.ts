export type CreateUser = {
    name: string;
    email: string;
    password: string;
    role?: string;
    status?: string;
    phone?: string;
    image?: string
}

export type UpdateUser = {
    name: string;
    email: string;
    role?: string;
    status?: string;
    phone?: string;
    image?: string
}

export type GetUser = {
    id: string;
}

export type DeleteUser = {
    endpoint: string;
}
