import { Account } from './account';

export interface SuitableSettingsRequest {
    hashtags: string[],
    specialAccountsSubscriber: Account[],
    specialLocationAccounts: Account[],
    commentsToSpecialAccount: Account[],
    likesToSpecialAccount: Account[],
    maximumPerDay: number,
    maximumPerHour: number,
    publicationTimeLimit: boolean
}