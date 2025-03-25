import axios from "axios";

const axiosPublicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
});
const axiosPrivateInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
});

axiosPrivateInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosPublicInstance, axiosPrivateInstance };
