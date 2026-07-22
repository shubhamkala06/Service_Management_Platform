import admin from './admin';
import employee from './employee';
import manager from './manager';
import supportEngineer from './supportEngineer';

const navigation = {
	'System Administrator': admin,
	Employee: employee,
	Manager: manager,
	'Support Engineer': supportEngineer
};

export function getNavigation(role) {
	return navigation[role] ?? [];
}
