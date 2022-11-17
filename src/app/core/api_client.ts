import axios, { AxiosError, AxiosInstance } from "axios";

import { AuthRepoImpl } from "../modules/auth/data/repo";
import { ROUTES } from "../routes";

export interface ApiClient extends AxiosInstance {}

const currentDomain = window.location.hostname;

const prodDomain = "foglie-admin.vercel.app";
const devDomain = "foglie-admin.vercel.app";

const prodApiUrl = "https://foglie-dialloro-api.herokuapp.com/graphql";
const devApiUrl = "https://foglie-dialloro-api.herokuapp.com/graphql";
const localApiUrl = "http://localhost:3000";

function getBaseApiUrl(): string {
  if (currentDomain === prodDomain) {
    return prodApiUrl;
  } else if (currentDomain === devDomain) {
    return devApiUrl;
  }
  return localApiUrl;
}

export const BASE_URL = getBaseApiUrl();

function authInterceptor(error: AxiosError) {
  if (error.response?.status === 401) {
    AuthRepoImpl.logout();
    // eslint-disable-next-line fp/no-mutation
    window.location.href = ROUTES.login;
  } else {
    return Promise.reject(error);
  }
}

export const apiClient: ApiClient = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use((res) => res, authInterceptor);
