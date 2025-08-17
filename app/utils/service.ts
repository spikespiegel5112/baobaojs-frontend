import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "/api/baobaoapi" : "/";

export default axios;
