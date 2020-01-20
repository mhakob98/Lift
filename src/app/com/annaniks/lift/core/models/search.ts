import { Hashtag } from './hashtag';

export declare type Search = Hashtag[] | Account[];

export interface SearchTerm {
    query: string;
    type: string
}