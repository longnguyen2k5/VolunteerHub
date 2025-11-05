export const oauth2Config = {
  authorizationEndpoint: `${
    import.meta.env.VITE_AUTH_SERVER_URL
  }/oauth2/authorize`, // đã đúng path
  tokenEndpoint: `${import.meta.env.VITE_AUTH_SERVER_URL}/oauth2/token`, // đã đúng path
  userInfoEndpoint: `${import.meta.env.VITE_API_URL}/users/info`, // ✅ Fixed: match backend endpoint

  clientId: import.meta.env.VITE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  scopes: import.meta.env.VITE_SCOPES,

  // PKCE configuration
  codeChallengeMethod: "S256",

  // Token storage keys
  accessTokenKey: "access_token",
  refreshTokenKey: "refresh_token",
  tokenExpiryKey: "token_expiry",
};
