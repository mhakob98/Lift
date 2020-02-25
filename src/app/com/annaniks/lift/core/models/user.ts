export interface User {
    id: number;
    name: string;
    email: string;
    roleId: Role;
    avatar: string;
    instagramAccounts: InstagramAccount[]
    updatedAt: string;
    createdAt: string;
    refferalCode: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface InstagramAccount {
    id: number;
    login: string;
    password?: string;
    apiKey?: string;
    userId?: number;
    avatar: string;
    verification: boolean;
    createdAt?: string;
    updatedAt?: string;
    instagramId: string;
    selected?:boolean;
    needPassword:boolean;
}

export interface Account {
    email: string;
    password: string;
}