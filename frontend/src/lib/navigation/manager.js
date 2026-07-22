import { House, ClipboardList, ChartColumn, User } from 'lucide-svelte';

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
		label: 'Reports',
		href: '/reports',
		icon: ChartColumn
	},
	{
		label: 'Profile',
		href: '/profile',
		icon: User
	}
];
