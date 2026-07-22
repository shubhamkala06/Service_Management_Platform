import { apiGet } from './client';

export async function getRoles() {
	return await apiGet('/user/roles');
}