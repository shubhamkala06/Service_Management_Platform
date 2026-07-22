import { House, ClipboardList, Laptop, Users, Settings } from 'lucide-svelte';

export default [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: House
	},
	{
		label: 'Tickets',
		href: '/tickets',
		icon: ClipboardList
	},
	{
		label: 'Assets',
		href: '/assets',
		icon: Laptop
	},
	{
		label: 'Users',
		href: '/admin/users',
		icon: Users
	},
	{
		label: 'Settings',
		href: '/admin/settings',
		icon: Settings
	}
];
