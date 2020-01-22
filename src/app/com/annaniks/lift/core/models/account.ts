import { SubscriptionParam } from './subscription-parameter';

export interface Account {

}

export interface AccountConnectData {
    username: string;
    password: string;
}

export interface TwoFactorLoginData {
    username: string;
    password: string;
    code: string;
    two_factor_identifier: string;
}

export class AccountSettings {
    loginId: number | string;
    id?: number;
    userId?: number;
    status?: string;
    location: any;
    followersByAccounts: any;
    commentersByAccounts: any;
    likers: any;
    tags: any;
    comments: any;
    likeCountForFollower: number;
    unfollowDays: number;
    seeStories: boolean;
    dontFollowHiddenAccounts: boolean;
    hidePostsAndStories: boolean;
    hidePosts: boolean;
    hideStories: boolean;
    followTime: FollowTime
    filter: Filter;
    createdAt?: string;
    updatedAt?: string;

    constructor() {
        this.loginId = null;
        this.id = null;
        this.userId = null;
        this.status = null;
        this.location = null;
        this.followersByAccounts = [];
        this.commentersByAccounts = [];
        this.likers = [];
        this.tags = [];
        this.comments = [];
        this.likeCountForFollower = null;
        this.unfollowDays = null;
        this.seeStories = null;
        this.dontFollowHiddenAccounts = null;
        this.hidePostsAndStories = null;
        this.hidePosts = null;
        this.hideStories = null;
        this.followTime = {} as FollowTime;
        this.filter = {} as Filter;
        this.createdAt = null;
        this.updatedAt = null;
    }
}

interface FollowTime {
    start: string;
    end: string;
}

interface Filter {
    followers: FilterRange;
    folowings: FilterRange;
    likeInPhoto: FilterRange;
    postCount: FilterRange;
    haveAvatar: boolean;
    lastPostAge: number;
    lasStoryAge: number;
    profileDescription: boolean;
    description: FilterDescription;
    haveSite: boolean;
}

interface FilterRange {
    min: string;
    max: string;
}

interface FilterDescription {
    include: string[];
    exclude: string[]
}

export interface Condition {
    type: SubscriptionParam;
}