import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: apiURL,
	withCredentials: true
});

export async function apiGet(path, config = {}) {
	const response = await api.get(path, config);
	return response.data;
}

export async function apiPost(path, data, config = {}) {
	const response = await api.post(path, data, config);
	return response.data;
}

export async function apiPatch(path, data, config = {}) {
	const response = await api.patch(path, data, config);
	return response.data;
}

export async function apiPut(path, data, config = {}) {
	const response = await api.put(path, data, config);
	return response.data;
}

export async function apiDelete(path, config={}) {
	const response = await api.delete(path,config);
	return response.data;
}