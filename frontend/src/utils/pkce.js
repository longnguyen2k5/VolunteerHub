import CryptoJS from 'crypto-js';

/**
 * Generate random code verifier (43-128 characters)
 * Base64 URL-safe encoding
 */
export function generateCodeVerifier() {
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    return base64UrlEncode(randomBytes.toString(CryptoJS.enc.Base64));
}

/**
 * Generate code challenge from verifier
 * SHA256 hash then Base64 URL encode
 */
export function generateCodeChallenge(verifier) {
    const hash = CryptoJS.SHA256(verifier);
    return base64UrlEncode(hash.toString(CryptoJS.enc.Base64));
}

/**
 * Base64 URL-safe encoding
 * Replace +/= with -_
 */
function base64UrlEncode(str) {
    return str
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Store code verifier in sessionStorage
 */
export function storeCodeVerifier(verifier) {
    sessionStorage.setItem('pkce_code_verifier', verifier);
}

/**
 * Retrieve code verifier from sessionStorage
 */
export function getCodeVerifier() {
    return sessionStorage.getItem('pkce_code_verifier');
}

/**
 * Clear code verifier after use
 */
export function clearCodeVerifier() {
    sessionStorage.removeItem('pkce_code_verifier');
}

/**
 * Store state for CSRF protection
 */
export function generateAndStoreState() {
    const state = CryptoJS.lib.WordArray.random(16).toString();
    sessionStorage.setItem('oauth_state', state);
    return state;
}

/**
 * Verify state matches
 */
export function verifyState(state) {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return state === storedState;
}