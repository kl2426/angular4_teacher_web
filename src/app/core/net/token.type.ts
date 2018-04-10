export interface TokenData {
    /**
     * TOKEN值
     */
    accessToken: string;
    /**
     * TOKEN过期时间，格式：timestamp
     */
    expire_time: number;

    /**
     * 刷新token
     */
    refreshToken?: string;

    /**
     * 刷新Token有效时间，格式：timestamp
     */
    refreshToken_valid_time?: number;

    [key: string]: any;
}
