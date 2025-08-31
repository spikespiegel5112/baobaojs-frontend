import axios from "axios";

console.log(import.meta.env);

axios.defaults.baseURL =
  (import.meta.env.MODE === "development" ? "/api" : import.meta.env.VITE_API_URL) + "/baobaoapi";

// Add a response interceptor
axios.interceptors.response.use(
  function onFulfilled(response) {
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

export default axios;
