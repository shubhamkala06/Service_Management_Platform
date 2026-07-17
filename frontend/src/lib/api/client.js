import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

/**
 * 
 * @param {string} path
 * @param {import("axios").AxiosRequestConfig} [config]
 *
 */
export async function get(path,config={}) {
  const response = await api.get(path,config);
  return response.data;
}

/**
 * 
 * @param {string} path 
 * @param {object} data 
 * @param {import("axios").AxiosRequestConfig} [config]
 * 
 */
export async function post(path, data, config={}) {
  const response = await api.post(path, data, config);
  return response.data;
}