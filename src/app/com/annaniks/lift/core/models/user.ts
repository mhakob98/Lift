import { TariffData } from './tariff';
import { PostStatistic } from './statistics';

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
    tariffs: TariffData[]
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
    selected?: boolean;
    needPassword: boolean;
    statistica: InstagramAccountStatistics;
    subscription: InstagramAccountSubscription;
}

export interface Account {
    email: string;
    password: string;
}

export interface InstagramAccountStatistics {

    createdAt: string;
    date: string;
    day: number;
    followers: number;
    followings: number;
    id: number;
    instagramAccountId: number;
    mouth: number;
    posts: {
        posts: PostStatistic[];
    }
    postsCount: number;
    updatedAt: string;
    year: number;

}

export interface InstagramAccountSubscription {
    autoFollowing: boolean;
    autoView: boolean;
    createdAt: string;
    id: number;
    liftBonus: boolean;
    loginId: number;
    updatedAt: string;
}