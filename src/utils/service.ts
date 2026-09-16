import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

type RequestInstance = {
  get(url: string, config?: AxiosRequestConfig): Promise<T>;
  post(url: string, data?: AxiosResponse, config?: AxiosRequestConfig): Promise<T>;
  put(url: string, data?: AxiosResponse, config?: AxiosRequestConfig): Promise<T>;
  delete(url: string, data?: AxiosResponse, config?: AxiosRequestConfig): Promise<T>;
} & typeof axios;

const request = axios.create() as RequestInstance;

console.log(import.meta.env);

request.defaults.baseURL =
  import.meta.env.MODE === "development"
    ? "/baobaoapi"
    : import.meta.env.VITE_API_URL + "/baobaoapi";

// Add a response interceptor
request.interceptors.response.use(
  function onFulfilled(response) {
    // dispatch(setUserInfo(null));
    // dispatch(setIsLoggedIn(false));
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return Promise.resolve(response.data);
  },
  function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response.data);
  },
);

export default request;
