/**
 * Cấu hình OAuth2 cho việc xác thực.
 * Chứa các endpoint, clientId, scope và các key lưu trữ token.
 */
export const oauth2Config = {
  // Endpoint authorization server để lấy authorization code
  authorizationEndpoint: `${import.meta.env.VITE_AUTH_SERVER_URL
    }/oauth2/authorize`,

  // Endpoint để trao đổi authorization code lấy access token
  tokenEndpoint: `${import.meta.env.VITE_AUTH_SERVER_URL}/oauth2/token`,

  // Endpoint lấy thông tin user (user info) từ resource server
  userInfoEndpoint: `${import.meta.env.VITE_API_URL}/users/info`,

  // Thông tin Client App
  clientId: import.meta.env.VITE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  scopes: import.meta.env.VITE_SCOPES,

  // Cấu hình PKCE (Proof Key for Code Exchange) để tăng bảo mật
  codeChallengeMethod: "S256",

  // Key dùng để lưu token vào localStorage
  accessTokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  tokenExpiryKey: "token_expiry",
};

