export interface User {
    name: string;
    email: string;
    roleId: Role;
    istagramAccounts: []
    updatedAt: string;
    createdAt: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Account {
    email: string;
    password: string;
}