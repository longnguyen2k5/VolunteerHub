import axios from "axios";
import axiosInstance from "./axiosConfig";
import { oauth2Config } from "../config/oauth2Config";

export const authAPI = {
  /**
   * Register new user
   */
  register: async (formData) => {
    try {
      console.log(
        "Making registration request to:",
        `${axiosInstance.defaults.baseURL}/auth/register`
      );
      console.log("Registration request data:", formData);

      const response = await axiosInstance.post("/auth/register", formData);
      console.log("Registration success response:", response.data);
      return response;
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  /**
   * Exchange authorization code for access token
   */
  exchangeCodeForToken: ({ code, codeVerifier, redirectUri }) => {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: oauth2Config.clientId,
      code_verifier: codeVerifier,
    });

    return axios
      .post(oauth2Config.tokenEndpoint, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .catch((error) => {
        console.error("Token exchange failed:", error.response?.status);
        throw error;
      });
  },

  /**
   * Refresh access token
   */
  refreshAccessToken: (refreshToken) => {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: oauth2Config.clientId,
    });

    return axios.post(oauth2Config.tokenEndpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  /**
   * Get current user info
   */
  getUserInfo: (token) => {
    return axios
      .get(oauth2Config.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error.response?.status);
        throw error;
      });
  },
};
