import axios from "axios";

import { toast } from "react-toastify";
 
const Api = axios.create({

  withCredentials: true

});
 
Api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);
 
Api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response) {

      const { data } = error.response;

      console.log(data.message);

      toast.error(data.message);

    } else {

      console.log(error);

    }

    return Promise.reject(error);

  }

);
 
export default Api;

 