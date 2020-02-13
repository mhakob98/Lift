export interface User {
    id:number;
    name: string;
    email: string;
    roleId: Role;
    instagramAccounts: InstagramAccount[]
    updatedAt: string;
    createdAt: string;
    refferalCode:string;
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
    userId: number;
    verification: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Account {
    email: string;
    password: string;
}