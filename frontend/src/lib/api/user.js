import { apiGet, apiPatch } from './client';

export async function getCurrentUser() {
	return await apiGet('/user/me');
}

export async function getUsers() {
	return await apiGet('/user');
}

export async function getUser(id) {
	return await apiGet(`/user/${id}`);
}

export async function updateUserRole(id, roleName) {
	return await apiPatch(`/user/${id}/role`, {
		roleName
	});
}

export async function updateUserStatus(id, isActive) {
	return await apiPatch(`/user/${id}/status`, {
		isActive
	});
}
