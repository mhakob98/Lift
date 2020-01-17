export interface AuthState {
    isAuth: boolean;
}

export interface TokenResponse {
    refreshToken: string;
    accessToken: string;
}