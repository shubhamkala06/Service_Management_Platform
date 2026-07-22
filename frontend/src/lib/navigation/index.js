import admin from './admin';
import employee from './employee';
import manager from './manager';
import supportEngineer from './supportEngineer';

const navigation = {
	SYSTEM_ADMINISTRATOR: admin,
	EMPLOYEE: employee,
	MANAGER: manager,
	SUPPORT_ENGINEER: supportEngineer
};

export function getNavigation(role) {
	return navigation[role] ?? [];
}
