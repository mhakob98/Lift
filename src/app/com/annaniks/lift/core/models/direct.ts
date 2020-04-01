export interface Mailing {
    id: number;
    instagramAccountId: number;
    delay: number;
    filter: {}
    sendAfterFollow: boolean
    messages: {
        list: string[];
    }
    createdAt: string;
    updatedAt: string;
}

export interface MailingResponse {
    newMailing: Mailing[];
    oldMailing: Mailing[]
}