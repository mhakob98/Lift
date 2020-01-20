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