import axios from "axios";
import { apiDomain, apiProtocol } from "../constants";
const axiosInstance = axios.create({
  baseURL: `${apiProtocol}://${apiDomain}`,
});

export default axiosInstance;
