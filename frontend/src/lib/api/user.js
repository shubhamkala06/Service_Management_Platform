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

export async function updateUserRole(id, roleId) {
	return await apiPatch(`/user/${id}/role`, {
		roleId
	});
}

export async function updateUserStatus(id, isActive) {
	return await apiPatch(`/user/${id}/status`, {
		isActive
	});
}